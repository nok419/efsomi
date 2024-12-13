// components/shared/BridgeController.tsx
import { Card, Flex, Text, Image,} from '@aws-amplify/ui-react';
import { BridgeControllerProps } from '../../../types/audio';

export default function BridgeController({ 
  config, 
  onConfigChange, 
  selectedSound 
}: BridgeControllerProps) {
  return (
    <Card padding="large">
      <Flex direction="column" gap="large">
        {/* Header */}
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

        {/* Bridge Duration Control */}
        <Flex direction="column" gap="medium">
          <Text fontSize="large">Bridge Duration ({config.duration.toFixed(1)}s)</Text>
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
            style={{
              width: '100%',
              height: '12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          />
        </Flex>

        {/* Fade Duration Control */}
        <Flex direction="column" gap="medium">
          <Text fontSize="large">Fade Duration ({config.fadeDuration.toFixed(1)}s)</Text>
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
            style={{
              width: '100%',
              height: '12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          />
        </Flex>
      </Flex>
    </Card>
  );
}