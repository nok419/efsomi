// src/types/audio.ts

// 各種エラー定義
export class AudioLoadError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AudioLoadError';
  }
}

export class PlaybackError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PlaybackError';
  }
}

// 楽曲情報
export interface Song {
  id: string;
  title: string;
  artist: string;
  path: string;
  albumArt?: string;
}

// 環境音情報
export interface EnvironmentalSound {
  id: string;
  name: string;
  category: 'nature' | 'urban';
  subCategory: string;
  characteristics: string[];
  src: string;
  thumbnail: string;
}

// Bridge設定
export interface BridgeConfig {
  duration: number;             // Bridge長
  fadeDuration: number;         // フェード時間
  environmentalSoundId: string; // 選択中の環境音ID
  crossfadeOffset: number;      // クロスフェードオフセット
  bridgeSoundCount: number;     // 複数環境音挿入時の数
}

// レビュー用データ
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

// セッション関連（使う場合のみ）
export interface TransitionEvent {
  eventId: string;
  sessionId: string;
  fromSongId?: string;
  toSongId?: string;
  // ...
}

export interface ExperimentSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  transitions: TransitionEvent[];
  reviews: ReviewData[];
}

// AudioPlayer用Props
export interface AudioPlayerProps {
  currentSong: Song | null;
  onPlayStateChange: (isPlaying: boolean) => void;
}

// BridgeController用Props
export interface BridgeControllerProps {
  config: BridgeConfig;
  onConfigChange: (newConfig: BridgeConfig) => void;
  selectedSound: EnvironmentalSound | null;
}

// SoundSelector用Props
export interface SoundSelectorProps {
  sounds: EnvironmentalSound[];
  selectedSoundId?: string;
  onSoundSelect: (sound: EnvironmentalSound) => void;
}

// ReviewDialog用Props
export interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewData) => void;
  currentTrack: Song | null;
  nextTrack: Song | null;
  bridgeSound: EnvironmentalSound | null;
}
