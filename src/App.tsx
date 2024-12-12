// App.tsx
import { useState, useEffect } from 'react';
import { View, Grid, ThemeProvider } from '@aws-amplify/ui-react';
import AudioPlayer from './components/shared/AudioPlayer';
import SoundSelector from './components/shared/SoundSelector';
import BridgeController from './components/shared/BridgeController';
import { Song, EnvironmentalSound, BridgeConfig } from '../types/audio';
import { songs } from './data/songs';
import { environmentalSounds } from './data/environmentalSounds';
import MusicSelector from './components/shared/MusicSelector';

const theme = {
  name: 'efsomi-theme',
  tokens: {
    colors: {
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
      },
      brand: {
        primary: '#1a365d',
        secondary: '#2a4a7f',
        tertiary: '#3a5a9f',
      },
    }
  }
};

export default function App() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [selectedSound, setSelectedSound] = useState<EnvironmentalSound | null>(null);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({
    duration: 5,
    fadeDuration: 1,
    environmentalSoundId: ''
  });

  useEffect(() => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      if (songs.length > 1) {
        setNextSong(songs[1]);
      }
    }
  }, []);

  const handleSoundSelect = (sound: EnvironmentalSound) => {
    setSelectedSound(sound);
    setBridgeConfig(prev => ({
      ...prev,
      environmentalSoundId: sound.id
    }));
  };

  //nextSong
  useEffect(() => {
    if (nextSong) {
      console.log('Next song queued:', nextSong.title);
      // 次の曲の準備処理をここに実装予定
    }
  }, [nextSong]);

  return (
    <ThemeProvider theme={theme}>
      <View
        backgroundColor="background.secondary"
        minHeight="100vh"
        padding={{ base: 'medium', large: 'large' }}
      >
        <Grid
          templateColumns={{ base: '1fr', large: '1fr 320px' }}
          gap="medium"
        >
          <View>
            <Grid
              templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
              gap="medium"
            >
              <BridgeController
                config={bridgeConfig}
                onConfigChange={setBridgeConfig}
                selectedSound={selectedSound}
              />
              <SoundSelector
                sounds={environmentalSounds}
                onSoundSelect={handleSoundSelect}
              />
            </Grid>
            <MusicSelector
              presetSongs={songs}
              onSongSelect={setNextSong}
              onPlaylistLoad={(url) => {
                console.log('Loading playlist:', url);
              }}
            />
          </View>
          <AudioPlayer
            currentSong={currentSong}
            onPlayStateChange={(isPlaying) => {
              console.log('Playback state:', isPlaying);
            }}
          />
        </Grid>
      </View>
    </ThemeProvider>
  );
}