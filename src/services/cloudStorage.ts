
interface CloudStorageData {
  nodes: any[];
  connections: any[];
  insights: any[];
  lastModified: string;
  version: string;
}

export class CloudStorageService {
  private storageKey = 'synapse-canvas-data';
  private autoSaveInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeAutoSave();
  }

  async saveToCloud(data: CloudStorageData): Promise<boolean> {
    try {
      // For now, use localStorage as fallback until Supabase integration
      const storageData = {
        ...data,
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(storageData));
      localStorage.setItem(`${this.storageKey}-backup`, JSON.stringify(storageData));
      
      console.log('Data saved to cloud storage');
      return true;
    } catch (error) {
      console.error('Failed to save to cloud storage:', error);
      return false;
    }
  }

  async loadFromCloud(): Promise<CloudStorageData | null> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data) as CloudStorageData;
      }
      return null;
    } catch (error) {
      console.error('Failed to load from cloud storage:', error);
      // Try backup
      try {
        const backupData = localStorage.getItem(`${this.storageKey}-backup`);
        if (backupData) {
          return JSON.parse(backupData) as CloudStorageData;
        }
      } catch (backupError) {
        console.error('Failed to load backup data:', backupError);
      }
      return null;
    }
  }

  async syncData(localData: CloudStorageData): Promise<CloudStorageData> {
    try {
      const cloudData = await this.loadFromCloud();
      
      if (!cloudData) {
        await this.saveToCloud(localData);
        return localData;
      }

      // Simple last-modified wins conflict resolution
      if (new Date(localData.lastModified) > new Date(cloudData.lastModified)) {
        await this.saveToCloud(localData);
        return localData;
      } else {
        return cloudData;
      }
    } catch (error) {
      console.error('Failed to sync data:', error);
      return localData;
    }
  }

  private initializeAutoSave() {
    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.triggerAutoSave();
    }, 30000);
  }

  private triggerAutoSave() {
    // This will be called by the main app when canvas data changes
    window.dispatchEvent(new CustomEvent('triggerAutoSave'));
  }

  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }
}

export const cloudStorage = new CloudStorageService();
