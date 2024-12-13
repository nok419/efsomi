// components/shared/AudioPlayer.tsx
import { Flex, Button, View, Text, Icon } from '@aws-amplify/ui-react';
import { AudioPlayerProps } from '../../../types/audio';
import { useState } from 'react';

export default function AudioPlayer({ currentSong, onPlayStateChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0);
  const duration = 240; // 仮の曲の長さ（秒）

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
      {/* オーバーレイ層 */}
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

      {/* コンテンツ層 */}
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
            fontSize="xxxl"
            color="white"
          >
            ⏮
          </Button>
          <Button
            size="large"
            variation="primary"
            width="80px"
            height="80px"
            borderRadius="full"
            onClick={() => {
              setIsPlaying(!isPlaying);
              onPlayStateChange(!isPlaying);
            }}
          >
            <Icon fontSize="50px" ariaLabel={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? '⏸' : '▶️'}
            </Icon>
          </Button>
          <Button
            variation="link"
            size="large"
            fontSize="xxxl"
            color="white"
          >
            ⏭
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
            <Text fontSize="small" color="white">
              {formatTime(currentTime)}
            </Text>
            <Text fontSize="small" color="white">
              {formatTime(duration)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
}