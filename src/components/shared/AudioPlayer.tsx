import { Card, Flex, Image, Button, View ,Text} from '@aws-amplify/ui-react';
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
    <Card padding="medium">
      <Flex direction="column" gap="medium">
        <View 
          height="120px"
          backgroundColor="background.secondary" 
          borderRadius="medium"
        >
          {currentSong?.albumArt && (
            <Image
              src={currentSong.albumArt}
              alt={currentSong.title}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          )}
        </View>

        {/* Track Info */}
        <Flex direction="column" alignItems="center">
          <Text fontSize="medium" fontWeight="bold">{currentSong?.title}</Text>
          <Text variation="secondary">{currentSong?.artist}</Text>
        </Flex>

        {/* Seek Bar */}
        <Flex direction="column" gap="xs">
          <View 
            position="relative" 
            height="4px" 
            backgroundColor="background.secondary"
            borderRadius="full"
          >
            <View 
              position="absolute"
              height="100%"
              width={`${(currentTime / duration) * 100}%`}
              backgroundColor="brand.primary"
              borderRadius="full"
            />
          </View>
          <Flex justifyContent="space-between">
            <Text fontSize="xs">{formatTime(currentTime)}</Text>
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Flex>
        </Flex>

        {/* Controls */}
        <Flex justifyContent="center" gap="medium" alignItems="center">
          <Button variation="link" size="small">⏮</Button>
          <Button
            size="large"
            variation="primary"
            borderRadius="full"
            onClick={() => {
              setIsPlaying(!isPlaying);
              onPlayStateChange(!isPlaying);
            }}
          >
            {isPlaying ? '⏸' : '▶️'}
          </Button>
          <Button variation="link" size="small">⏭</Button>
        </Flex>
      </Flex>
    </Card>
  );
}