// BridgeController.tsx
import { Card, Flex, Text,Image} from '@aws-amplify/ui-react';
import { BridgeControllerProps } from '../../../types/audio';

export default function BridgeController({ 
  config, 
  onConfigChange, 
  selectedSound 
}: BridgeControllerProps) {
  return (
    <Card padding="medium">
      <Flex direction="column" gap="medium">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="large" fontWeight="bold">Bridge Control</Text>
          {selectedSound && (
            <Flex 
              gap="small" 
              alignItems="center"
              backgroundColor="background.tertiary"
              padding="xs"
              borderRadius="small"
            >
              <Image
                src={selectedSound.thumbnail}
                alt={selectedSound.name}
                width="24px"
                height="24px"
                borderRadius="small"
              />
              <Text fontSize="small">{selectedSound.name}</Text>
            </Flex>
          )}
        </Flex>

        <Flex direction="column" gap="small">
          <Text>Bridge Duration ({config.duration.toFixed(1)}s)</Text>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={config.duration}
            onChange={(e) => onConfigChange({
              ...config,
              duration: parseFloat(e.target.value)
            })}
            className="custom-slider"
          />
        </Flex>

        <Flex direction="column" gap="small">
          <Text>Fade Duration ({config.fadeDuration.toFixed(1)}s)</Text>
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.1}
            value={config.fadeDuration}
            onChange={(e) => onConfigChange({
              ...config,
              fadeDuration: parseFloat(e.target.value)
            })}
            className="custom-slider"
          />
        </Flex>
      </Flex>
    </Card>
  );
}