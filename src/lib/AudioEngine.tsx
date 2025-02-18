// src/lib/AudioEngine.tsx
import { AudioLoadError} from '../types/audio';

// シンプルなAudioNodeラッパ
interface AudioNode {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  startTime?: number;
}

/**
 * AudioContextベースの再生制御
 */
export class AudioEngine {
  private context: AudioContext;
  private currentTrack: AudioNode | null = null;
  // 省略: nextTrack, bridgeSound など
  
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private isInitialized = false;

  constructor() {
    this.context = new AudioContext();
  }

  async initialize(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    this.isInitialized = true;
  }

  private checkInitialization() {
    if (!this.isInitialized) {
      throw new AudioLoadError('AudioEngine not initialized');
    }
  }

  // Amplify StorageなどからURL取得済みと仮定
  async loadAudio(url: string): Promise<AudioBuffer> {
    this.checkInitialization();
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }
    const resp = await fetch(url);
    if (!resp.ok) throw new AudioLoadError(`Failed to fetch: ${resp.statusText}`);
    const arrBuf = await resp.arrayBuffer();
    const audioBuf = await this.context.decodeAudioData(arrBuf);
    this.bufferCache.set(url, audioBuf);
    return audioBuf;
  }

  async loadAudioFromStorage(key: string): Promise<AudioBuffer> {
    // StorageManagerでURLを取得する流れがあるなら呼び出し
    // ここではデモのため直接 loadAudio(key) を同等扱いに
    return this.loadAudio(key);
  }

  // 再生
  async play(buffer: AudioBuffer) {
    this.checkInitialization();
    // 既存を止める
    await this.stopCurrent();

    const sourceNode = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    sourceNode.buffer = buffer;
    sourceNode.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    sourceNode.start();
    this.currentTrack = {
      source: sourceNode,
      gainNode,
      startTime: this.context.currentTime
    };
  }

  pause(): void {
    this.checkInitialization();
    if (this.context.state === 'running') {
      this.context.suspend();
    }
  }

  resume(): void {
    this.checkInitialization();
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  private async stopCurrent(): Promise<void> {
    if (this.currentTrack) {
      try {
        this.currentTrack.source.stop();
      } catch {
        // ignore
      }
      this.currentTrack = null;
    }
  }

  dispose(): void {
    this.stopCurrent();
    this.bufferCache.clear();
    this.context.close();
    this.isInitialized = false;
  }

  getCurrentTime(): number {
    if (!this.currentTrack || this.context.state !== 'running') return 0;
    if (typeof this.currentTrack.startTime === 'number') {
      return this.context.currentTime - this.currentTrack.startTime;
    }
    return 0;
  }
}
