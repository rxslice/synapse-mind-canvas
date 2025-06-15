
export interface CloudStorageData {
  nodes: any[];
  connections: any[];
  settings: any;
  timestamp: string;
  version: string;
}

export interface CloudStorageStats {
  totalSaves: number;
  lastSync: Date | null;
  storageUsed: number;
  maxStorage: number;
}

class CloudStorageService {
  private baseKey = 'synapse-cloud';
  private maxBackups = 10;

  async saveToCloud(data: CloudStorageData): Promise<boolean> {
    try {
      const cloudData = {
        ...data,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      // Save current data
      localStorage.setItem(`${this.baseKey}-current`, JSON.stringify(cloudData));
      
      // Maintain backup history
      this.rotateBackups(cloudData);
      
      // Update stats
      this.updateStats();
      
      console.log('Data saved to cloud storage');
      return true;
    } catch (error) {
      console.error('Cloud save failed:', error);
      return false;
    }
  }

  async loadFromCloud(): Promise<CloudStorageData | null> {
    try {
      const saved = localStorage.getItem(`${this.baseKey}-current`);
      if (!saved) return null;
      
      const data = JSON.parse(saved);
      console.log('Data loaded from cloud storage');
      return data;
    } catch (error) {
      console.error('Cloud load failed:', error);
      return null;
    }
  }

  async getBackups(): Promise<CloudStorageData[]> {
    try {
      const backups: CloudStorageData[] = [];
      for (let i = 0; i < this.maxBackups; i++) {
        const backup = localStorage.getItem(`${this.baseKey}-backup-${i}`);
        if (backup) {
          backups.push(JSON.parse(backup));
        }
      }
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Failed to get backups:', error);
      return [];
    }
  }

  async restoreFromBackup(timestamp: string): Promise<CloudStorageData | null> {
    try {
      const backups = await this.getBackups();
      const backup = backups.find(b => b.timestamp === timestamp);
      
      if (backup) {
        await this.saveToCloud(backup);
        return backup;
      }
      return null;
    } catch (error) {
      console.error('Restore failed:', error);
      return null;
    }
  }

  getStats(): CloudStorageStats {
    try {
      const stats = localStorage.getItem(`${this.baseKey}-stats`);
      if (stats) {
        const parsed = JSON.parse(stats);
        return {
          ...parsed,
          lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null
        };
      }
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
    
    return {
      totalSaves: 0,
      lastSync: null,
      storageUsed: 0,
      maxStorage: 5 * 1024 * 1024 // 5MB
    };
  }

  private rotateBackups(newData: CloudStorageData): void {
    try {
      // Shift existing backups
      for (let i = this.maxBackups - 1; i > 0; i--) {
        const backup = localStorage.getItem(`${this.baseKey}-backup-${i - 1}`);
        if (backup) {
          localStorage.setItem(`${this.baseKey}-backup-${i}`, backup);
        }
      }
      
      // Save current as newest backup
      localStorage.setItem(`${this.baseKey}-backup-0`, JSON.stringify(newData));
    } catch (error) {
      console.error('Backup rotation failed:', error);
    }
  }

  private updateStats(): void {
    try {
      const currentStats = this.getStats();
      const newStats = {
        totalSaves: currentStats.totalSaves + 1,
        lastSync: new Date().toISOString(),
        storageUsed: this.calculateStorageUsed(),
        maxStorage: currentStats.maxStorage
      };
      
      localStorage.setItem(`${this.baseKey}-stats`, JSON.stringify(newStats));
    } catch (error) {
      console.error('Stats update failed:', error);
    }
  }

  private calculateStorageUsed(): number {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.baseKey)) {
          const value = localStorage.getItem(key);
          if (value) {
            total += new Blob([value]).size;
          }
        }
      }
      return total;
    } catch (error) {
      console.error('Storage calculation failed:', error);
      return 0;
    }
  }

  async clearCloudData(): Promise<boolean> {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.baseKey)) {
          keys.push(key);
        }
      }
      
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Clear cloud data failed:', error);
      return false;
    }
  }
}

export const cloudStorage = new CloudStorageService();
