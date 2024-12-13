// types/audio.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  path: string;
  albumArt?: string;
  duration?: number;
}

export interface EnvironmentalSound {
  id: string;
  name: string;
  category: 'nature' | 'urban';
  src: string;
  thumbnail: string;
  subCategory: string;
  characteristics: string[];
}

export interface BridgeConfig {
  duration: number;
  fadeDuration: number;
  environmentalSoundId: string;
}

export interface AudioPlayerProps {
  currentSong: Song | null;
  onPlayStateChange: (isPlaying: boolean) => void;
  onNextTrack?: () => void;  // 追加: 次の曲への遷移
  onPreviousTrack?: () => void;  // 追加: 前の曲への遷移
}

export interface BridgeControllerProps {  // 追加: BridgeController用の型定義
  config: BridgeConfig;
  onConfigChange: (config: BridgeConfig) => void;
  selectedSound: EnvironmentalSound | null;
}

export interface SoundSelectorProps {
  sounds: EnvironmentalSound[];
  onSoundSelect: (sound: EnvironmentalSound) => void;
  selectedSoundId?: string;
}

export interface MusicSelectorProps {  // 追加: MusicSelector用の型定義
  presetSongs: Song[];
  onSongSelect: (song: Song) => void;
  onPlaylistLoad: (url: string) => void;
  selectedSong: Song | null;
}

export interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewData) => void;
  currentTrack: Song | null;
  nextTrack: Song | null;
  bridgeSound: EnvironmentalSound | null;
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

// 追加: 再生状態管理用の型定義
export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

// 追加: オーディオエンジン用の型定義
export interface AudioEngineConfig {
  crossFadeDuration: number;
  environmentalSoundGain: number;
  masterVolume: number;
}

// 追加: 実験セッション用の型定義
export interface ExperimentSession {
  sessionId: string;
  startTime: number;
  userId: string;
  transitions: TransitionEvent[];
}

export interface TransitionEvent {
  id: string;
  timestamp: number;
  fromSong: Song;
  toSong: Song;
  bridgeSound: EnvironmentalSound;
  bridgeConfig: BridgeConfig;
  review: ReviewData;
}