// src/App.tsx
import { useEffect, useState } from 'react';
import { View, Card, Button, Grid, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Song, EnvironmentalSound, BridgeConfig, ReviewData } from './types/audio';
import { songs } from './data/songs';
import { environmentalSounds } from './data/environmentalSounds';

// コンポーネント群
import AudioPlayer from './components/shared/AudioPlayer';
import SoundSelector from './components/shared/SoundSelector';
import MusicSelector from './components/shared/MusicSelector';
import BridgeController from './components/shared/BridgeController';
import MultiBridgeController from './components/shared/MultiBridgeController';
import { ReviewDialog } from './components/shared/ReviewDialog';

// 好みで導入可能な例: Amplifyデータ管理
// import { ExperimentDataStore } from './lib/ExperimentDataStore';

import './App.css';    // UI調整用
import './index.css';  // UI調整用

// Amplify UIのテーマを設定（必要に応じてtokensを追加）
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

// アプリ本体 (1画面で完結)
export default function App() {
  // 楽曲
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);

  // 環境音
  const [selectedSound, setSelectedSound] = useState<EnvironmentalSound | null>(null);
  const [multiBridgeSounds, setMultiBridgeSounds] = useState<EnvironmentalSound[]>([]);

  // Bridge設定
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({
    duration: 5,
    fadeDuration: 1,
    environmentalSoundId: '',
    crossfadeOffset: 0,
    bridgeSoundCount: 1
  });

  // レビュー入力ダイアログの表示管理
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // ===== 初期データ設定: 現在曲 / 次の曲など
  useEffect(() => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      if (songs.length > 1) {
        setNextSong(songs[1]);
      }
    }
  }, []);

  // 次曲がセットされたらログを吐いてみる
  useEffect(() => {
    if (nextSong) {
      console.log('Next song queued:', nextSong.title);
    }
  }, [nextSong]);

  // レビュー送信ハンドラ
  const handleReviewSubmit = (data: ReviewData): void => {
    console.log('Review submitted:', data);
    setIsReviewOpen(false);
    // 例: 送信後にデータストアへ保存など
    // dataStore.saveReview(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <View backgroundColor="background.secondary" minHeight="100vh" padding="large">
        
        {/* メインレイアウト: 左側に Bridgeコントロール＆環境音＆曲選択、右側にプレーヤ */}
        <Grid templateColumns={{ base: '1fr', large: '1fr 320px' }} gap="medium">
          <View>
            {/* 上段: BridgeController + SoundSelector */}
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
                onSoundSelect={(sound: EnvironmentalSound) => {
                  setSelectedSound(sound);
                  // Bridge設定にも反映
                  setBridgeConfig((prev) => ({
                    ...prev,
                    environmentalSoundId: sound.id
                  }));
                }}
                selectedSoundId={selectedSound?.id}
              />
            </Grid>

            {/* 中段: MultiBridgeController (複数の環境音を扱う場合のみ使う) */}
            <MultiBridgeController
              config={bridgeConfig}
              onConfigChange={setBridgeConfig}
              availableSounds={environmentalSounds}
              multiBridgeSounds={multiBridgeSounds}
              setMultiBridgeSounds={setMultiBridgeSounds}
            />

            {/* 下段: 楽曲セレクタ */}
            <MusicSelector
              presetSongs={songs}
              onSongSelect={(song: Song) => setNextSong(song)}
              selectedSong={nextSong}
              onPlaylistLoad={(url: string) => {
                console.log('Loading playlist:', url);
              }}
            />

            {/* オーディオプレーヤと評価ボタン */}
            <Card>
              <AudioPlayer
                currentSong={currentSong}
                onPlayStateChange={(isPlaying) => {
                  console.log('Playback state:', isPlaying);
                }}
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

        {/* レビュー入力ダイアログ */}
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
