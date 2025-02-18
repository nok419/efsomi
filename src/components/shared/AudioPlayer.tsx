// src/components/shared/AudioPlayer.tsx
import { useEffect, useCallback, useRef, useState } from 'react';
import { Flex, Button, View, Text, Icon } from '@aws-amplify/ui-react';
import { AudioPlayerProps } from '../../types/audio';
import { AudioEngine } from '../../lib/AudioEngine';

export default function AudioPlayer({ currentSong, onPlayStateChange }: AudioPlayerProps) {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number>();

  // AudioEngine の初期化
  const initializeAudioEngine = useCallback(async () => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new AudioEngine();
      await audioEngineRef.current.initialize();
    }
  }, []);

  // 初回タッチ/クリックで audio context を解放
  useEffect(() => {
    const handleUserInteraction = async () => {
      try {
        await initializeAudioEngine();
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
      } catch (err) {
        console.error('Audio init failed:', err);
      }
    };
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, [initializeAudioEngine]);

  // currentSong が切り替わったら再生準備
  useEffect(() => {
    const loadAndPlay = async () => {
      if (!currentSong || !audioEngineRef.current) return;
      try {
        const buf = await audioEngineRef.current.loadAudioFromStorage(currentSong.path);
        setDuration(buf.duration);
        if (isPlaying) {
          await audioEngineRef.current.play(buf);
        }
      } catch (err) {
        console.error('Fail to load song:', err);
      }
    };
    loadAndPlay();
  }, [currentSong, isPlaying]);

  // 再生中は requestAnimationFrame で時間更新
  useEffect(() => {
    const update = () => {
      if (audioEngineRef.current && isPlaying) {
        setCurrentTime(audioEngineRef.current.getCurrentTime());
        rafRef.current = requestAnimationFrame(update);
      }
    };
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(update);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  // 再生/停止
  const handlePlayPause = () => {
    if (!audioEngineRef.current) return;
    if (isPlaying) {
      audioEngineRef.current.pause();
    } else {
      audioEngineRef.current.resume();
    }
    setIsPlaying(!isPlaying);
    onPlayStateChange(!isPlaying);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View
      padding="large"
      backgroundColor="background.secondary"
      style={{
        backgroundImage: currentSong?.albumArt ? `url(${currentSong.albumArt})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 背景ぼかし用 */}
      <View
        style={{
          background: 'rgba(0,0,0,0.6)',
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(10px)'
        }}
      />
      
      <Flex direction="column" gap="medium" style={{ position: 'relative', zIndex: 1 }}>
        {/* 曲情報 */}
        <Flex direction="column" alignItems="center" gap="small">
          <Text color="white" fontSize="xl" fontWeight="bold">
            {currentSong?.title || 'No track selected'}
          </Text>
          <Text color="white" variation="secondary" fontSize="large">
            {currentSong?.artist || 'Unknown artist'}
          </Text>
        </Flex>

        {/* 再生ボタン */}
        <Flex justifyContent="center" gap="large" alignItems="center">
          <Button
            variation="link"
            size="large"
            color="white"
            onTouchStart={(e) => e.preventDefault()}
            onClick={handlePlayPause}
          >
            <Icon fontSize="50px" ariaLabel={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶️'}
            </Icon>
          </Button>
        </Flex>

        {/* シークバー */}
        <Flex direction="column" gap="small" width="100%">
          <View
            height="8px"
            backgroundColor="rgba(255,255,255,0.2)"
            borderRadius="full"
            overflow="hidden"
          >
            <View
              width={`${(currentTime / duration) * 100}%`}
              height="100%"
              backgroundColor="white"
            />
          </View>
          <Flex justifyContent="space-between">
            <Text color="white" fontSize="small">
              {formatTime(currentTime)}
            </Text>
            <Text color="white" fontSize="small">
              {formatTime(duration)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
}
