// src/lib/audio/StorageManager.ts
import { Storage } from 'aws-amplify/storage';
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
      // キャッシュをチェック
      const cached = this.urlCache.get(key);
      if (cached) return cached;

      // S3から署名付きURLを取得
      const url = await Storage.get(key, {
        validateObjectExistence: true,
        expiresIn: 3600 // 1時間
      });

      this.urlCache.set(key, url);
      return url;
    } catch (error) {
      throw new AudioLoadError(`Failed to get audio URL for ${key}: ${error}`);
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