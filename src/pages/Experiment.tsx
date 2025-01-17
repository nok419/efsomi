import { useState, useEffect } from 'react';
import { loadSongs } from '../data/songs';
import { loadEnvironmentalSounds } from '../data/environmentalSounds';
import AudioPlayer from '../components/shared/AudioPlayer';
import MusicSelector from '../components/shared/MusicSelector';
import SoundSelector from '../components/shared/SoundSelector';
import BridgeController from '../components/shared/BridgeController';
import { ReviewDialog } from '../components/shared/ReviewDialog';
import { AudioEngine } from '../lib/AudioEngine';
import { ExperimentDataStore } from '../lib/ExperimentDataStore';
import { Song, EnvironmentalSound, ReviewData, BridgeConfig } from '../../types/audio';

const audioEngine = new AudioEngine();
const dataStore = new ExperimentDataStore();

const Experiment = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [environmentalSounds, setEnvironmentalSounds] = useState<EnvironmentalSound[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedSound, setSelectedSound] = useState<EnvironmentalSound | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({ duration: 5, fadeDuration: 1, environmentalSoundId: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedSongs = await loadSongs();
        const loadedEnvironmentalSounds = await loadEnvironmentalSounds();
        console.log('Loaded Songs:', loadedSongs); // デバッグ用ログ
        console.log('Loaded Environmental Sounds:', loadedEnvironmentalSounds); // デバッグ用ログ
        setSongs(loadedSongs);
        setEnvironmentalSounds(loadedEnvironmentalSounds);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchData();
    audioEngine.initialize();
  }, []);

  const handleSongSelect = async (song: Song) => {
    setSelectedSong(song);
    const buffer = await audioEngine.loadAudio(song.path);
    audioEngine.playTrack(buffer);
  };

  const handleSoundSelect = (sound: EnvironmentalSound) => {
    setSelectedSound(sound);
    setBridgeConfig(prevConfig => ({ ...prevConfig, environmentalSoundId: sound.id }));
  };

  const handleTransitionComplete = () => {
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    await dataStore.saveReview(reviewData);
    setIsReviewDialogOpen(false);
  };

  const handlePlayStateChange = async (isPlaying: boolean) => {
    if (!isPlaying && selectedSound) {
      const nextSong = songs[(songs.indexOf(selectedSong!) + 1) % songs.length];
      const nextBuffer = await audioEngine.loadAudio(nextSong.path);
      const bridgeBuffer = await audioEngine.loadAudio(selectedSound.src);
      await audioEngine.performTransition(nextBuffer, bridgeBuffer, bridgeConfig);
      setSelectedSong(nextSong);
      dataStore.logTransition({
        fromTrack: {
          trackId: selectedSong!.id,
          title: selectedSong!.title
        },
        toTrack: {
          trackId: nextSong.id,
          title: nextSong.title
        },
        bridge: {
          soundId: selectedSound.id,
          name: selectedSound.name,
          type: 'environmental',
          config: bridgeConfig
        }
      });
      handleTransitionComplete();
    }
  };

  return (
    <div>
      <MusicSelector
        presetSongs={songs}
        onSongSelect={handleSongSelect}
        selectedSong={selectedSong}
      />
      <SoundSelector
        sounds={environmentalSounds}
        onSoundSelect={handleSoundSelect}
        selectedSoundId={selectedSound?.id}
      />
      <BridgeController
        config={bridgeConfig}
        onConfigChange={setBridgeConfig}
        selectedSound={selectedSound}
      />
      <AudioPlayer
        currentSong={selectedSong}
        onPlayStateChange={handlePlayStateChange}
        onTrackEnd={async () => {
          console.log('Track ended');
          // 必要に応じて他の処理を追加
        }}
      />
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        currentTrack={selectedSong}
        nextTrack={songs[(songs.indexOf(selectedSong!) + 1) % songs.length]}
        bridgeSound={selectedSound}
      />
    </div>
  );
};

export default Experiment;