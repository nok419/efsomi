import { useState } from 'react';
import { Card, Flex, Text, Button, View } from '@aws-amplify/ui-react';
import { Song } from '../../../types/audio';

interface MusicSelectorProps {
  presetSongs: Song[];
  onSongSelect: (song: Song) => void;
  onPlaylistLoad: (url: string) => void;
  selectedSong: Song | null; // 追加
}

export default function MusicSelector({ 
  presetSongs, 
  onSongSelect, 
  onPlaylistLoad,
  selectedSong 
}: MusicSelectorProps) {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Card padding="medium">
      <Text fontSize="large" fontWeight="bold">Music Selection</Text>
      <Flex gap="medium" direction={{ base: 'column', medium: 'row' }}>
        {/* Preset Music Section */}
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
                style={{ marginTop: '4px', zIndex: 100 }}
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

        {/* Spotify Playlist Section */}
        <View flex={1}>
          <Text fontWeight="semibold" marginBottom="small">
            Spotifyプレイリスト
          </Text>
          <Flex gap="small">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Spotify URL"
              className="custom-input"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--amplify-colors-border-primary)',
                backgroundColor: 'var(--amplify-colors-background-primary)',
                color: 'var(--amplify-colors-font-primary)'
              }}
            />
            <Button
              onClick={() => {
                onPlaylistLoad(playlistUrl);
                setPlaylistUrl('');
              }}
            >
              Load
            </Button>
          </Flex>
        </View>
      </Flex>
    </Card>
  );
}