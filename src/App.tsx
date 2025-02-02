// App.tsx
import { useState, useEffect } from 'react';
import { View, Card, Button, Grid, ThemeProvider } from '@aws-amplify/ui-react';
import AudioPlayer from './components/shared/AudioPlayer';
import SoundSelector from './components/shared/SoundSelector';
import BridgeController from './components/shared/BridgeController';
import { Song, EnvironmentalSound, BridgeConfig, ReviewData } from '../types/audio';
import { loadSongs } from './data/songs';
import { loadEnvironmentalSounds } from './data/environmentalSounds';
import MusicSelector from './components/shared/MusicSelector';
import { ReviewDialog } from './components/shared/ReviewDialog';
import { ExperimentDataStore } from './lib/ExperimentDataStore'; // 追加
import { AudioEngine } from './lib/AudioEngine'; // 追加
import '@aws-amplify/ui-react/styles.css';

const theme = {
  name: 'efsomi-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#E6EAF0' },
          20: { value: '#C7D0E0' },
          40: { value: '#8A9CC0' },
          60: { value: '#4C699F' },
          80: { value: '#1A365D' },  // メインカラー
          90: { value: '#0D1B2E' },
          100: { value: '#060D17' }
        },
        secondary: {
          80: { value: '#2c5282' }
        }
      },
      background: {
        primary: { value: '#FFFFFF' },
        secondary: { value: '#F8FAFC' },
        tertiary: { value: '#F1F5F9' }
      },
      border: {
        primary: { value: '{colors.brand.primary.60.value}' },
        secondary: { value: '{colors.brand.primary.40.value}' }
      }
    },
    components: {
      card: {
        backgroundColor: { value: '{colors.background.secondary.value}' },
        borderRadius: { value: '8px' },
        borderWidth: { value: '1px' },
        borderColor: { value: '{colors.border.primary.value}' }
      },
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80.value}' },
          color: { value: '#FFFFFF' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.60.value}' }
          }
        },
        link: {
          color: { value: '{colors.brand.primary.80.value}' },
          _hover: {
            color: { value: '{colors.brand.primary.60.value}' }
          }
        }
      },
      heading: {
        color: { value: '{colors.brand.primary.80.value}' }
      },
      text: {
        color: { value: '{colors.brand.primary.90.value}' }
      }
    }
  }
};

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [environmentalSounds, setEnvironmentalSounds] = useState<EnvironmentalSound[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [selectedSound, setSelectedSound] = useState<EnvironmentalSound | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({
    duration: 5,
    fadeDuration: 1,
    environmentalSoundId: ''
  });

  const handleTrackEnd = async () => {
    if (!currentSong || !nextSong || !selectedSound) return;

    try {
      const audioEngine = new AudioEngine();
      await audioEngine.initialize();
      const nextBuffer = await audioEngine.loadAudioFromStorage(nextSong.path);
      const bridgeBuffer = await audioEngine.loadAudioFromStorage(selectedSound.src);

      await audioEngine.performTransition(nextBuffer, bridgeBuffer, bridgeConfig);

      setCurrentSong(nextSong);
      const nextIndex = songs.indexOf(nextSong) + 1;
      setNextSong(songs[nextIndex % songs.length]);

      setIsReviewOpen(true);
    } catch (error) {
      console.error('Failed to perform transition:', error);
    }
  };

  const handleReviewSubmit = async (data: ReviewData) => {
    if (!currentSong || !nextSong || !selectedSound) return;

    try {
      const experimentDataStore = new ExperimentDataStore();
      await experimentDataStore.saveTransitionReviewData(
        { title: currentSong.title, artist: currentSong.artist },
        { title: nextSong.title, artist: nextSong.artist },
        { name: selectedSound.name, category: selectedSound.category },
        data
      );
    } catch (error) {
      console.error('Failed to save review data:', error);
    }

    setIsReviewOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const loadedSongs = await loadSongs();
      const loadedEnvironmentalSounds = await loadEnvironmentalSounds();
      setSongs(loadedSongs);
      setEnvironmentalSounds(loadedEnvironmentalSounds);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      if (songs.length > 1) {
        setNextSong(songs[1]);
      }
    }
  }, [songs]);

  useEffect(() => {
    if (nextSong) {
      console.log('Next song queued:', nextSong.title);
    }
  }, [nextSong]);

  return (
    <ThemeProvider theme={theme}>
      <View backgroundColor="background.secondary" minHeight="100vh" padding="large">
        <Grid templateColumns={{ base: '1fr', large: '1fr 320px' }} gap="medium">
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
                onSoundSelect={setSelectedSound}
                selectedSoundId={selectedSound?.id}
              />
            </Grid>

            <MusicSelector
              presetSongs={songs}
              onSongSelect={setNextSong}
              selectedSong={nextSong}
            />

            <Card>
              <AudioPlayer
                currentSong={currentSong}
                onPlayStateChange={(isPlaying) => {
                  console.log('Playback state:', isPlaying);
                }}
                onTrackEnd={handleTrackEnd}
              />
              
              <Button
                variation="primary"
                size="large"
                onClick={() => setIsReviewOpen(true)}
                marginTop="medium"
              >
                評価を入力
              </Button>
            </Card>
          </View>
        </Grid>

        <ReviewDialog
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onSubmit={handleReviewSubmit}
          currentTrack={currentSong}
          nextTrack={nextSong}
          bridgeSound={selectedSound}
        />
      </View>
    </ThemeProvider>
  );
}