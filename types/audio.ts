// types/audio.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  path: string;
  albumArt?: string;
}

export interface EnvironmentalSound {
  id: string;
  name: string;
  category: 'nature' | 'urban';
  subCategory?: string;
  characteristics: string[];
  src: string;
  thumbnail?: string;
}

export interface BridgeConfig {
  duration: number;
  fadeDuration: number;
  environmentalSoundId: string;
}

// 実験データ関連の型定義を追加
export interface TransitionEvent {
  eventId: string;
  sessionId: string;
  timestamp: string;
  fromTrack: {
    trackId: string;
    title: string;
  };
  toTrack: {
    trackId: string;
    title: string;
  };
  bridge: {
    soundId: string;
    name: string;
    type: 'environmental' | 'whitenoise';
    config: BridgeConfig;
  };
}

export interface ReviewData {
  ratings: {
    continuity: number;
    emotional: number;
    contextual: number;
  };
  additionalFeedback: {
    wantToSkip: boolean;
    feltDiscomfort: boolean;
    wouldUseAgain: boolean;
  };
  timestamp: number;
}

export interface ExperimentSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  transitions: TransitionEvent[];
  reviews: ReviewData[];
}

// コンポーネントProps型定義
export interface AudioPlayerProps {
  currentSong: Song | null;
  onPlayStateChange: (isPlaying: boolean) => void;
}

export interface BridgeControllerProps {
  config: BridgeConfig;
  onConfigChange: (config: BridgeConfig) => void;
  selectedSound: EnvironmentalSound | null;
}

export interface SoundSelectorProps {
  sounds: EnvironmentalSound[];
  onSoundSelect: (sound: EnvironmentalSound) => void;
  selectedSoundId?: string;
}

// 音声処理関連のエラー型
export class AudioLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AudioLoadError';
  }
}

export class PlaybackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlaybackError';
  }
}

// パフォーマンス設定
export const AUDIO_CONFIG = {
  sampleRate: 44100,
  bitDepth: 16,
  channels: 2,
  maxLatency: 100, // ms
  transitionLatency: 50, // ms
  bufferSize: 2048,
} as const;