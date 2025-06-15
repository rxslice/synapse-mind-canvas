
interface ApiConfig {
  geminiApiKey: string;
  isConfigured: boolean;
  lastValidated?: string;
}

export class SecureApiManager {
  private static instance: SecureApiManager;
  private config: ApiConfig | null = null;
  private encryptionKey = 'synapse-secure-key-v1';

  static getInstance(): SecureApiManager {
    if (!SecureApiManager.instance) {
      SecureApiManager.instance = new SecureApiManager();
    }
    return SecureApiManager.instance;
  }

  private constructor() {
    this.loadConfiguration();
  }

  private simpleEncrypt(text: string): string {
    // Simple XOR encryption for demo - in production use proper encryption
    return btoa(text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length))
    ).join(''));
  }

  private simpleDecrypt(encrypted: string): string {
    try {
      const decoded = atob(encrypted);
      return decoded.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length))
      ).join('');
    } catch {
      return '';
    }
  }

  setApiKey(apiKey: string): boolean {
    try {
      if (!apiKey || apiKey.length < 10) {
        throw new Error('Invalid API key format');
      }

      const encryptedKey = this.simpleEncrypt(apiKey);
      const config: ApiConfig = {
        geminiApiKey: encryptedKey,
        isConfigured: true,
        lastValidated: new Date().toISOString()
      };

      localStorage.setItem('synapse-secure-config', JSON.stringify(config));
      this.config = {
        ...config,
        geminiApiKey: apiKey // Keep unencrypted in memory for current session
      };

      return true;
    } catch (error) {
      console.error('Failed to set API key:', error);
      return false;
    }
  }

  getApiKey(): string | null {
    if (!this.config?.isConfigured) {
      return null;
    }
    return this.config.geminiApiKey;
  }

  isConfigured(): boolean {
    return this.config?.isConfigured || false;
  }

  private loadConfiguration(): void {
    try {
      const stored = localStorage.getItem('synapse-secure-config');
      if (stored) {
        const config = JSON.parse(stored) as ApiConfig;
        if (config.isConfigured && config.geminiApiKey) {
          const decryptedKey = this.simpleDecrypt(config.geminiApiKey);
          this.config = {
            ...config,
            geminiApiKey: decryptedKey
          };
        }
      }
    } catch (error) {
      console.error('Failed to load API configuration:', error);
      this.config = null;
    }
  }

  async validateApiKey(): Promise<boolean> {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;

    try {
      // Test API key with a simple request
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'test' }] }],
            generationConfig: { maxOutputTokens: 1 }
          })
        }
      );

      const isValid = response.ok;
      if (isValid && this.config) {
        this.config.lastValidated = new Date().toISOString();
        const stored = localStorage.getItem('synapse-secure-config');
        if (stored) {
          const config = JSON.parse(stored);
          config.lastValidated = this.config.lastValidated;
          localStorage.setItem('synapse-secure-config', JSON.stringify(config));
        }
      }

      return isValid;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  clearConfiguration(): void {
    localStorage.removeItem('synapse-secure-config');
    this.config = null;
  }

  rotateApiKey(newApiKey: string): boolean {
    this.clearConfiguration();
    return this.setApiKey(newApiKey);
  }
}

export const secureApi = SecureApiManager.getInstance();
