// src/lib/audio/AudioEngine.ts
import { getUrl } from 'aws-amplify/storage';
import { BridgeConfig, AudioLoadError, PlaybackError } from '../../types/audio';

interface AudioNode {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  startTime?: number;
}

export class AudioEngine {
  private context: AudioContext;
  private currentTrack: AudioNode | null = null;
  private nextTrack: AudioNode | null = null;
  private bridgeSound: AudioNode | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private urlCache: Map<string, string> = new Map();
  private isInitialized = false;

  constructor() {
    this.context = new AudioContext();
  }

  async initialize(): Promise<void> {
    try {
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      this.isInitialized = true;
    } catch (error) {
      throw new AudioLoadError('Failed to initialize audio context');
    }
  }

  private checkInitialization() {
    if (!this.isInitialized) {
      throw new AudioLoadError('AudioEngine not initialized');
    }
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

  async loadAudioFromStorage(key: string): Promise<AudioBuffer> {
    const url = await this.getAudioUrl(key);
    return this.loadAudio(url);
  }

  async loadAudio(url: string): Promise<AudioBuffer> {
    this.checkInitialization();
    
    try {
      const cached = this.bufferCache.get(url);
      if (cached) return cached;

      const response = await fetch(url);
      if (!response.ok) {
        throw new AudioLoadError(`Failed to load audio: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      this.bufferCache.set(url, audioBuffer);
      return audioBuffer;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AudioLoadError(error.message);
      }
      throw new AudioLoadError('Unknown error occurred');
    }
  }

  async preloadAudios(keys: string[]): Promise<void> {
    for (const key of keys.slice(0, 2)) {
      try {
        await this.loadAudioFromStorage(key);
      } catch (error) {
        console.warn(`Failed to preload audio: ${key}`, error);
      }
    }
  }

  private createAudioNode(buffer: AudioBuffer): AudioNode {
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    return { source, gainNode };
  }

  async play(buffer: AudioBuffer): Promise<void> {
    this.checkInitialization();
    
    try {
      await this.stopCurrent();
      
      const node = this.createAudioNode(buffer);
      node.startTime = this.context.currentTime;
      node.source.start();
      this.currentTrack = node;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AudioLoadError(error.message);
      }
      throw new AudioLoadError('Unknown error occurred');
    }
  }

  async performTransition(
    nextBuffer: AudioBuffer,
    bridgeBuffer: AudioBuffer,
    config: BridgeConfig
  ): Promise<void> {
    this.checkInitialization();

    if (!this.currentTrack) {
      throw new PlaybackError('No current track playing');
    }

    try {
      const currentTime = this.context.currentTime;
      const { duration, fadeDuration } = config;

      this.currentTrack.gainNode.gain.linearRampToValueAtTime(
        0,
        currentTime + fadeDuration
      );

      const bridgeNode = this.createAudioNode(bridgeBuffer);
      bridgeNode.gainNode.gain.setValueAtTime(0, currentTime + fadeDuration);
      bridgeNode.gainNode.gain.linearRampToValueAtTime(
        1,
        currentTime + fadeDuration * 2
      );
      bridgeNode.gainNode.gain.linearRampToValueAtTime(
        0,
        currentTime + duration - fadeDuration
      );
      bridgeNode.source.start(currentTime + fadeDuration);
      this.bridgeSound = bridgeNode;

      const nextNode = this.createAudioNode(nextBuffer);
      nextNode.gainNode.gain.setValueAtTime(0, currentTime + duration - fadeDuration);
      nextNode.gainNode.gain.linearRampToValueAtTime(
        1,
        currentTime + duration
      );
      nextNode.source.start(currentTime + duration - fadeDuration);
      this.nextTrack = nextNode;

      setTimeout(() => {
        this.currentTrack?.source.stop();
        this.currentTrack = this.nextTrack;
        this.nextTrack = null;
        this.bridgeSound = null;
      }, (duration + fadeDuration) * 1000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AudioLoadError(error.message);
      }
      throw new AudioLoadError('Unknown error occurred');
    }
  }

  private async stopCurrent(): Promise<void> {
    if (this.currentTrack?.startTime) {
      try {
        this.currentTrack.source.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
    }
    this.currentTrack = null;
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

  dispose(): void {
    try {
      this.stopCurrent();
      this.bufferCache.clear();
      this.urlCache.clear();
      this.context.close();
      this.isInitialized = false;
    } catch (error) {
      console.error('Error disposing AudioEngine:', error);
    }
  }

  isPlaying(): boolean {
    return this.currentTrack !== null && this.context.state === 'running';
  }

  getCurrentTime(): number {
    if (!this.currentTrack?.startTime) return 0;
    return this.context.currentTime - this.currentTrack.startTime;
  }

  async initializeForMobile(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    
    const buffer = this.context.createBuffer(1, 1, 22050);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(0);
  }

  getBridgeSound(): AudioNode | null {
    return this.bridgeSound;
  }
}