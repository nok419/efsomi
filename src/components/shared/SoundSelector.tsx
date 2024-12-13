import { Card, Flex, Button, Text, View } from '@aws-amplify/ui-react';
import { SoundSelectorProps } from '../../../types/audio';
import { useState } from 'react';

export default function SoundSelector({ sounds, onSoundSelect }: SoundSelectorProps) {
  const [soundMenuType, setSoundMenuType] = useState<'nature' | 'urban' | null>(null);

  const handleMenuOpen = (type: 'nature' | 'urban') => {
    setSoundMenuType(soundMenuType === type ? null : type);
  };

  return (
    <Card padding="medium">
      <Flex direction="column" gap="medium">
        <Text fontSize="large" fontWeight="bold">Environmental Sound</Text>
        
        <View position="relative">
          <Flex gap="small">
            <Button
              flex={1}
              backgroundColor={soundMenuType === 'nature' ? 'brand.primary' : 'background.secondary'}
              onClick={() => handleMenuOpen('nature')}
            >
              自然音
            </Button>
            <Button
              flex={1}
              backgroundColor={soundMenuType === 'urban' ? 'brand.primary' : 'background.secondary'}
              onClick={() => handleMenuOpen('urban')}
            >
              都市音
            </Button>
          </Flex>

          {soundMenuType && (
            <Card
              position="absolute"
              top="100%"
              left="0"
              right="0"
              marginTop="2px"
              padding="zero"
              style={{ zIndex: 10 }}
              backgroundColor="background.primary"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="border.primary"
            >
              {sounds
                .filter(sound => sound.category === soundMenuType)
                .map(sound => (
                  <Button
                    key={sound.id}
                    variation="link"
                    width="100%"
                    textAlign="left"
                    padding="small"
                    onClick={() => {
                      onSoundSelect(sound);
                      setSoundMenuType(null);
                    }}
                  >
                    {sound.name}
                  </Button>
                ))}
            </Card>
          )}
        </View>
      </Flex>
    </Card>
  );
}