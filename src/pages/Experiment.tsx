// src/pages/Experiment.tsx
import { useState, useEffect } from 'react';
import { Card,Text, Grid, View, Heading } from '@aws-amplify/ui-react';
import AudioPlayer from '../components/shared/AudioPlayer';
import SoundSelector from '../components/shared/SoundSelector';
import BridgeController from '../components/shared/BridgeController';
import { Song, EnvironmentalSound, BridgeConfig } from '../types/audio';
import { songs } from '../data/songs';
import { environmentalSounds } from '../data/environmentalSounds';

export default function Experiment() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({
    duration: 5,
    fadeDuration: 1,
    environmentalSoundId: ''
  });

  useEffect(() => {
    // 初期データのロード
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      if (songs.length > 1) {
        setNextSong(songs[1]);
      }
    }
  }, []);

  const handleSoundSelect = (sound: EnvironmentalSound) => {
    setBridgeConfig(prev => ({
      ...prev,
      environmentalSoundId: sound.id
    }));
  };

  const handlePlayStateChange = (isPlaying: boolean) => {
    console.log('Playback state changed:', isPlaying);
    // 実際の音声再生制御を実装予定
  };

  return (
    <View padding="medium">
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 300px' }}
        gap="medium"
      >
        {/* Main Content */}
        <Card padding="medium">
          <Heading level={3}>Bridge Settings</Heading>
          <BridgeController
            config={bridgeConfig}
            onConfigChange={setBridgeConfig}
          />
          <SoundSelector
            sounds={environmentalSounds}
            onSoundSelect={handleSoundSelect}
          />
          {nextSong && (
            <View padding="medium">
              <Heading level={4}>Next Song</Heading>
              <Text>{nextSong.title} - {nextSong.artist}</Text>
            </View>
          )}
        </Card>

        {/* Side Panel */}
        <View>
          <AudioPlayer
            currentSong={currentSong}
            onPlayStateChange={handlePlayStateChange}
          />
        </View>
      </Grid>
    </View>
  );
}