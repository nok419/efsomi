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
  subCategory: string;
  path: string;
  thumbnail: string; // サムネイル画像のパスを追加
  characteristics: string[]; // 音の特徴を追加
}

export interface BridgeConfig {
  duration: number;
  fadeDuration: number;
  environmentalSoundId: string;
}

// 各コンポーネントのProps型も定義
export interface AudioPlayerProps {
  currentSong: Song | null;
  onPlayStateChange: (isPlaying: boolean) => void;
}

export interface BridgeControllerProps {
  config: BridgeConfig;
  onConfigChange: (config: BridgeConfig) => void;
  selectedSound: EnvironmentalSound | null; // 選択中の環境音を追加
}

export interface SoundSelectorProps {
  sounds: EnvironmentalSound[];
  onSoundSelect: (sound: EnvironmentalSound) => void;
}