// src/components/shared/BridgeController.tsx
import { Card, Flex, Text, Image } from '@aws-amplify/ui-react';
import { BridgeControllerProps } from '../../types/audio';

export default function BridgeController({ 
  config, 
  onConfigChange, 
  selectedSound 
}: BridgeControllerProps) {

  // コールバック
  const handleDurationChange = (val: number) => {
    onConfigChange({ ...config, duration: val });
  };
  const handleFadeChange = (val: number) => {
    onConfigChange({ ...config, fadeDuration: val });
  };
  const handleCrossfadeOffsetChange = (val: number) => {
    onConfigChange({ ...config, crossfadeOffset: val });
  };

  return (
    <Card padding="large">
      <Flex direction="column" gap="large">
        {/* タイトル & 選択中の環境音サムネ */}
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold">Bridge Control</Text>
          {selectedSound && (
            <Flex
              gap="small"
              alignItems="center"
              backgroundColor="background.tertiary"
              padding="medium"
              borderRadius="medium"
              width="40%"
            >
              <Image
                src={selectedSound.thumbnail}
                alt={selectedSound.name}
                width="32px"
                height="40px"
                borderRadius="small"
              />
              <Text fontSize="medium">{selectedSound.name}</Text>
            </Flex>
          )}
        </Flex>

        {/* Bridge Duration */}
        <Flex direction="column" gap="medium">
          <Text fontSize="large">
            Bridge Duration ({config.duration.toFixed(1)}s)
          </Text>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={config.duration}
            onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
            className="custom-slider"
          />
        </Flex>

        {/* Fade Duration */}
        <Flex direction="column" gap="medium">
          <Text fontSize="large">
            Fade Duration ({config.fadeDuration.toFixed(1)}s)
          </Text>
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.1}
            value={config.fadeDuration}
            onChange={(e) => handleFadeChange(parseFloat(e.target.value))}
            className="custom-slider"
          />
        </Flex>

        {/* Crossfade Offset */}
        <Flex direction="column" gap="medium">
          <Text fontSize="large">
            Crossfade Offset ({config.crossfadeOffset.toFixed(1)}s)
          </Text>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.1}
            value={config.crossfadeOffset}
            onChange={(e) => handleCrossfadeOffsetChange(parseFloat(e.target.value))}
            className="custom-slider"
          />
          <Text fontSize="small" color="font.tertiary">
            負値: 先にBridgeを被せる / 正値: 曲Aの終端とBridge再生を遅らせる
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
