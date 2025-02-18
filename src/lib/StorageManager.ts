// src/lib/StorageManager.ts
import { getUrl } from 'aws-amplify/storage';
import { AudioLoadError } from '../../types/audio';

export class StorageManager {
  private static instance: StorageManager;
  private urlCache: Map<string, string> = new Map();
  
  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async getAudioUrl(key: string): Promise<string> {
    try {
      const cached = this.urlCache.get(key);
      if (cached) return cached;

      const { url } = await getUrl({
        key,
        options: {
          validateObjectExistence: true,
          expiresIn: 3600
        }
      });

      if (!url) {
        throw new Error('Failed to get URL');
      }

      const urlString = url.toString();
      this.urlCache.set(key, urlString);
      return urlString;

    } catch (error) {
      throw new AudioLoadError(`Failed to get audio URL for ${key}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async preloadUrls(keys: string[]): Promise<void> {
    await Promise.all(
      keys.map(key => this.getAudioUrl(key).catch(error => {
        console.warn(`Failed to preload URL for ${key}:`, error);
      }))
    );
  }

  clearCache(): void {
    this.urlCache.clear();
  }
}
