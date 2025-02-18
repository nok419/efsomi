// src/pages/ExperimentFlow.tsx
import { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Text,
  View,
  Card,
  StepperField
} from '@aws-amplify/ui-react';

import { ReviewDialog } from '../components/shared/ReviewDialog';
import {
  Song,
  EnvironmentalSound,
  BridgeConfig,
  ReviewData,
} from '../types/audio';
import { songs } from '../data/songs';
import { environmentalSounds } from '../data/environmentalSounds';
import MusicSelector from '../components/shared/MusicSelector';
import SoundSelector from '../components/shared/SoundSelector';
import BridgeController from '../components/shared/BridgeController';
import MultiBridgeController from '../components/shared/MultiBridgeController';
import AudioPlayer from '../components/shared/AudioPlayer';

export default function ExperimentFlow() {
  // ステップ管理: 0=楽曲選択 → 1=環境音選択 → 2=Bridge設定 → 3=再生＆評価
  const [stepIndex, setStepIndex] = useState(0);

  // 楽曲＆環境音データ
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [selectedSound, setSelectedSound] = useState<EnvironmentalSound | null>(null);
  const [multiBridgeSounds, setMultiBridgeSounds] = useState<EnvironmentalSound[]>([]);

  // Bridge 設定パラメータ
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>({
    duration: 5,
    fadeDuration: 1,
    environmentalSoundId: '',
    crossfadeOffset: 0,
    bridgeSoundCount: 1
  });

  // レビューDialog
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // 初期化：とりあえず先頭の曲を currentSong, 2番目を nextSong
  useEffect(() => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      if (songs.length > 1) {
        setNextSong(songs[1]);
      }
    }
  }, []);

  // ステップ前進
  const handleNextStep = () => {
    if (stepIndex < 3) {
      setStepIndex(stepIndex + 1);
    } else {
      // ステップ3→4相当になったらレビューDialogを開く
      setIsReviewOpen(true);
    }
  };

  // ステップ戻る
  const handlePrevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  // ReviewDialog の送信イベント
  const handleReviewSubmit = (data: ReviewData): void => {
    console.log('Review submitted:', data);
    setIsReviewOpen(false);
    // 必要に応じて DataStore.saveReview(...) を呼ぶ
  };

  return (
    <View>
      {/* ステップの進捗UI */}
      <Card marginBottom="medium">
        <Text fontWeight="bold">実験ステップ</Text>
        <StepperField
          label="Stepper"
          labelHidden
          min={0}
          max={3}
          step={1}
          value={stepIndex}
          isDisabled
        />
      </Card>

      {/* ステップごとのUI */}
      {stepIndex === 0 && (
        <Card padding="medium" marginBottom="medium">
          <Text fontWeight="bold" marginBottom="small">
            Step 1: 楽曲選択
          </Text>
          <MusicSelector
            presetSongs={songs}
            onSongSelect={(song: Song) => setNextSong(song)}
            selectedSong={nextSong}
            onPlaylistLoad={(url: string) => {
              console.log('Loading playlist:', url);
            }}
          />
        </Card>
      )}

      {stepIndex === 1 && (
        <Card padding="medium" marginBottom="medium">
          <Text fontWeight="bold" marginBottom="small">
            Step 2: 環境音選択
          </Text>
          <SoundSelector
            sounds={environmentalSounds}
            onSoundSelect={(sound: EnvironmentalSound) => {
              setSelectedSound(sound);
              // BridgeConfigにも反映
              setBridgeConfig((prev) => ({
                ...prev,
                environmentalSoundId: sound.id
              }));
            }}
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
      )}

      {stepIndex === 2 && (
        <Card padding="medium" marginBottom="medium">
          <Text fontWeight="bold" marginBottom="small">
            Step 3: パラメータ調整
          </Text>
          <BridgeController
            config={bridgeConfig}
            onConfigChange={setBridgeConfig}
            selectedSound={selectedSound}
          />
        </Card>
      )}

      {stepIndex === 3 && (
        <Card padding="medium" marginBottom="medium">
          <Text fontWeight="bold" marginBottom="small">
            Step 4: 再生 & 評価
          </Text>
          <AudioPlayer
            currentSong={currentSong}
            onPlayStateChange={(isPlaying: boolean) => {
              console.log('Playback state changed:', isPlaying);
            }}
          />
          <Text marginTop="small" fontStyle="italic" fontSize="small">
            ※ 再生後，問題なければ「次へ」を押し、レビュー入力へ進んでください
          </Text>
        </Card>
      )}

      {/* ナビゲーションボタン */}
      <Flex marginTop="medium" gap="small">
        <Button onClick={handlePrevStep} isDisabled={stepIndex === 0}>
          戻る
        </Button>
        <Button onClick={handleNextStep} variation="primary" isDisabled={stepIndex > 3}>
          {stepIndex < 3 ? '次へ' : '評価へ'}
        </Button>
      </Flex>

      {/* レビュー入力用ダイアログ */}
      <ReviewDialog
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleReviewSubmit}
        currentTrack={currentSong}
        nextTrack={nextSong}
        bridgeSound={selectedSound}
      />
    </View>
  );
}
