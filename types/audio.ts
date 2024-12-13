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
}

export interface BridgeControllerProps {
  config: BridgeConfig;
  onConfigChange: (config: BridgeConfig) => void;
  selectedSound: EnvironmentalSound | null;
}

export interface SoundSelectorProps {
  sounds: EnvironmentalSound[];
  onSoundSelect: (sound: EnvironmentalSound) => void;
  selectedSoundId: string | undefined;
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

export interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewData) => void;
  currentTrack: { title: string; artist: string } | null;
}