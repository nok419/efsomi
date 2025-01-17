import { useState } from 'react';
import { Card, Flex, Text, Button, View } from '@aws-amplify/ui-react';
import { Song } from '../../../types/audio';

interface MusicSelectorProps {
  presetSongs: Song[];
  onSongSelect: (song: Song) => void;
  selectedSong: Song | null;
}

export default function MusicSelector({ 
  presetSongs, 
  onSongSelect, 
  selectedSong 
}: MusicSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Card padding="medium">
      <Text fontSize="large" fontWeight="bold">Music Selection</Text>
      <Flex gap="medium" direction={{ base: 'column', medium: 'row' }}>
        <View flex={1}>
          <Text fontWeight="semibold" marginBottom="small">
            プリセット音楽
          </Text>
          <View position="relative">
            <Button
              width="100%"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSong ? selectedSong.title : '音楽を選択'}
            </Button>
            {isDropdownOpen && (
              <Card
                position="absolute"
                width="100%"
                padding="zero"
                className="dropdown-menu"
                style={{ marginTop: '4px', zIndex: 1000 }} // zIndexを1000に変更
              >
                {presetSongs.map(song => (
                  <Button
                    key={song.id}
                    variation="link"
                    width="100%"
                    textAlign="left"
                    padding="small"
                    backgroundColor={selectedSong?.id === song.id ? 'background.tertiary' : undefined}
                    onClick={() => {
                      onSongSelect(song);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Flex direction="column" gap="xxs">
                      <Text>{song.title}</Text>
                      <Text variation="tertiary" fontSize="small">
                        {song.artist}
                      </Text>
                    </Flex>
                  </Button>
                ))}
              </Card>
            )}
          </View>
        </View>
      </Flex>
    </Card>
  );
}