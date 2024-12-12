import { Card, Flex, Button, Text } from '@aws-amplify/ui-react';
import { SoundSelectorProps } from '../../../types/audio';
import { useState } from 'react';

export default function SoundSelector({ sounds, onSoundSelect }: SoundSelectorProps) {
  const [soundMenuType, setSoundMenuType] = useState<'nature' | 'urban' | null>(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0 });

  const handleMenuOpen = (type: 'nature' | 'urban', event: React.MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setMenuPosition({ left: rect.left });
    setSoundMenuType(soundMenuType === type ? null : type);
  };

  return (
    <Card padding="medium">
      <Flex direction="column" gap="medium">
        <Text fontSize="large" fontWeight="bold">Environmental Sound</Text>
        
        <Flex gap="small" position="relative">
          <Button
            flex={1}
            backgroundColor={soundMenuType === 'nature' ? 'brand.primary' : 'background.secondary'}
            onClick={(e) => handleMenuOpen('nature', e)}
          >
            自然音
          </Button>
          <Button
            flex={1}
            backgroundColor={soundMenuType === 'urban' ? 'brand.primary' : 'background.secondary'}
            onClick={(e) => handleMenuOpen('urban', e)}
          >
            都市音
          </Button>

          {soundMenuType && (
            <Card
              position="absolute"
              style={{ left: menuPosition.left }}
              top="100%"
              width="200px"
              marginTop="xxs"
              padding="zero"
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
        </Flex>
      </Flex>
    </Card>
  );
}