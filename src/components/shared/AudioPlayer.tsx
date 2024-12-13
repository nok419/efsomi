import { Flex,  Button, View ,Text,Icon} from '@aws-amplify/ui-react';
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
    <Flex direction="column" gap="medium" padding="large">
      {/* Track Info */}
      <Flex direction="column" alignItems="center" gap="medium">
        
        <Text fontSize="xl" fontWeight="bold">{currentSong?.title}</Text>
        <Text variation="secondary" fontSize="large">{currentSong?.artist}</Text>
      </Flex>

      {/* Controls */}
      <Flex justifyContent="center" gap="large" alignItems="center">
        <Button 
          variation="link"
          size="large"
          fontSize="xxxl"
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
          <Icon
            fontSize="50px"
            ariaLabel={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? '⏸' : '▶️'}
          </Icon>
        </Button>
        <Button 
          variation="link"
          size="large"
          fontSize="xxxl"
        >
          ⏭
        </Button>
      </Flex>

      {/* Seek Bar */}
      <Flex direction="column" gap="small" width="100%">
        <View 
          height="8px" 
          backgroundColor="background.tertiary"
          borderRadius="full"
          overflow="hidden"
        >
          <View 
            width={`${(currentTime / duration) * 100}%`}
            height="100%"
            backgroundColor="brand.primary"
          />
        </View>
        <Flex justifyContent="space-between">
          <Text fontSize="small" variation="secondary">
            {formatTime(currentTime)}
          </Text>
          <Text fontSize="small" variation="secondary">
            {formatTime(duration)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}