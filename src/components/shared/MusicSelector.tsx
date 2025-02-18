// src/components/shared/MusicSelector.tsx
import { useState } from 'react';
import { Card, Flex, Text, Button, View } from '@aws-amplify/ui-react';
import { Song } from '../../types/audio';

interface MusicSelectorProps {
  presetSongs: Song[];
  onSongSelect: (song: Song) => void;
  onPlaylistLoad: (url: string) => void;
  selectedSong: Song | null;
}

export default function MusicSelector({ 
  presetSongs, 
  onSongSelect, 
  onPlaylistLoad,
  selectedSong 
}: MusicSelectorProps) {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState('');

  // フィルタしたリスト
  const filteredSongs = presetSongs.filter(song =>
    song.title.toLowerCase().includes(filterText.toLowerCase()) ||
    song.artist.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Card padding="medium">
      <Text fontSize="large" fontWeight="bold">Music Selection</Text>
      <Flex direction={{ base: 'column', medium: 'row' }} gap="medium" marginTop="small">
        {/* プリセット曲選択 */}
        <View flex={1}>
          <Text fontWeight="semibold" marginBottom="small">
            プリセット音楽
          </Text>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="検索 (タイトル/アーティスト)"
            className="custom-input"
            style={{ width: '100%', marginBottom: '8px' }}
          />
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
                {filteredSongs.map(song => (
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

        {/* Spotify プレイリストURL入力 */}
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
                padding: '8px',
                borderRadius: '4px'
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
