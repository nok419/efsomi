// src/pages/Experiment.tsx
import { useState, useEffect } from 'react';
import { Card, Grid, View } from '@aws-amplify/ui-react';
import AudioPlayer from '../components/shared/AudioPlayer';
import SoundSelector from '../components/shared/SoundSelector';
import BridgeController from '../components/shared/BridgeController';
import MultiBridgeController from '../components/shared/MultiBridgeController';
import { Song, EnvironmentalSound, BridgeConfig } from '../types/audio';
import { songs } from '../data/songs';
import { environmentalSounds } from '../data/environmentalSounds';

export default function Experiment() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [selectedSound, setSelectedSound] = useState<EnvironmentalSound | null>(null);
  const [multiBridgeSounds, setMultiBridgeSounds] = useState<EnvironmentalSound[]>([]);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({
    duration: 5,
    fadeDuration: 1,
    environmentalSoundId: '',
    crossfadeOffset: 0,
    bridgeSoundCount: 1
  });

  useEffect(() => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      if (songs.length > 1) {
        setNextSong(songs[1]);
      }
    }
  }, []);

  useEffect(() => {
    if (nextSong) {
      console.log('Next song queued:', nextSong.title);
    }
  }, [nextSong]);

  return (
    <View padding="medium">
      <Grid
        templateColumns={{ base: '1fr', medium: '1fr 300px' }}
        gap="medium"
      >
        <Card padding="medium">
          <BridgeController
            config={bridgeConfig}
            onConfigChange={setBridgeConfig}
            selectedSound={selectedSound}
          />
          <SoundSelector
            sounds={environmentalSounds}
            onSoundSelect={(sound: EnvironmentalSound) => setSelectedSound(sound)}
            selectedSoundId={selectedSound?.id}
          />

          <MultiBridgeController
            config={bridgeConfig}
            onConfigChange={setBridgeConfig}
            availableSounds={environmentalSounds}
            multiBridgeSounds={multiBridgeSounds}
            setMultiBridgeSounds={setMultiBridgeSounds}
          />
        </Card>

        <View>
          <AudioPlayer
            currentSong={currentSong}
            onPlayStateChange={(isPlaying: boolean) => {
              console.log('Playback state changed:', isPlaying);
            }}
          />
        </View>
      </Grid>
    </View>
  );
}
