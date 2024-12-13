//インポート
import { useState, useEffect } from 'react';
import { Card, Grid, View } from '@aws-amplify/ui-react';
import AudioPlayer from '../components/shared/AudioPlayer';
import SoundSelector from '../components/shared/SoundSelector';
import BridgeController from '../components/shared/BridgeController';
import { Song, EnvironmentalSound, BridgeConfig } from '../../types/audio';
import { songs } from '../data/songs';
import { environmentalSounds } from '../data/environmentalSounds';

export default function Experiment() {
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

  useEffect(() => {
    if (nextSong) {
      // 次の曲の準備処理
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
            onSoundSelect={setSelectedSound}
            selectedSoundId={selectedSound?.id}
          />
        </Card>

        {/* Side Panel */}
        <View>
          <AudioPlayer
            currentSong={currentSong}
            onPlayStateChange={(isPlaying) => {
              console.log('Playback state changed:', isPlaying);
            }}
          />
        </View>
      </Grid>
    </View>
  );
}