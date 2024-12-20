// src/components/shared/AudioPlayer.tsx
import { useEffect, useCallback, useRef, useState } from 'react';
import { Flex, Button, View, Text, Icon } from '@aws-amplify/ui-react';
import { AudioEngine } from '../../lib/AudioEngine';
import { AudioPlayerProps } from '../../../types/audio';

export default function AudioPlayer({ currentSong, onPlayStateChange }: AudioPlayerProps) {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationFrameRef = useRef<number>();

  const initializeAudioEngine = useCallback(async () => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new AudioEngine();
      await audioEngineRef.current.initialize();
    }
  }, []);

  // Handle mobile audio initialization
  useEffect(() => {
    const handleUserInteraction = async () => {
      try {
        await initializeAudioEngine();
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
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

  // Handle song changes
  useEffect(() => {
    const loadAndPlaySong = async () => {
      if (!currentSong || !audioEngineRef.current) return;

      try {
        const buffer = await audioEngineRef.current.loadAudioFromStorage(currentSong.path);
        setDuration(buffer.duration);
        if (isPlaying) {
          await audioEngineRef.current.play(buffer);
        }
      } catch (error) {
        console.error('Failed to load song:', error);
      }
    };

    loadAndPlaySong();
  }, [currentSong, isPlaying]);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      if (audioEngineRef.current && isPlaying) {
        setCurrentTime(audioEngineRef.current.getCurrentTime());
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (!audioEngineRef.current) return;

    if (isPlaying) {
      audioEngineRef.current.pause();
    } else {
      audioEngineRef.current.resume();
    }
    
    setIsPlaying(!isPlaying);
    onPlayStateChange(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      {/* Overlay layer */}
      <View
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(10px)'
        }}
      />

      {/* Content layer */}
      <Flex direction="column" gap="medium" style={{ position: 'relative', zIndex: 1 }}>
        {/* Track Info */}
        <Flex direction="column" alignItems="center" gap="medium">
          <Text color="white" fontSize="xl" fontWeight="bold">
            {currentSong?.title || 'No track selected'}
          </Text>
          <Text color="white" variation="secondary" fontSize="large">
            {currentSong?.artist || 'Unknown artist'}
          </Text>
        </Flex>

        {/* Controls */}
        <Flex justifyContent="center" gap="large" alignItems="center">
          <Button
            variation="link"
            size="large"
            color="white"
            onTouchStart={(e) => e.preventDefault()}
            onClick={handlePlayPause}
          >
            <Icon fontSize="50px" ariaLabel={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? '⏸' : '▶️'}
            </Icon>
          </Button>
        </Flex>

        {/* Seek Bar */}
        <Flex direction="column" gap="small" width="100%">
          <View
            height="8px"
            backgroundColor="rgba(255, 255, 255, 0.2)"
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