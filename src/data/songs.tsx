// src/data/songs.ts

<<<<<<< HEAD
export const loadSongs = async () => {
  const response = await fetch('/audio/songs/');
  if (!response.ok) {
    throw new Error(`Failed to load songs: ${response.statusText}`);
  }
  const files = await response.json();
  return files.filter((file: string) => file.endsWith('.mp3') || file.endsWith('.wav')).map((file: string, index: number) => ({
    id: `${index + 1}`,
    title: file.replace(/\.[^/.]+$/, ""), // ファイル名から拡張子を除去してタイトルに使用
    artist: `Artist ${index + 1}`,
    path: `/audio/songs/${file}`,
    albumArt: `/audio/songs/${file.replace(/\.[^/.]+$/, "")}.jpg` // アルバムアートのパスを修正
  }));
};
=======
export const songs: Song[] = [
  {
    id: 'song1',
    title: 'test1',
    artist: 'Test Artist 1',
    path: '/audio/11.mp3',
    albumArt: '/images/11.jpg'
  },
  {
    id: 'song2',
    title: 'test2',
    artist: 'Test Artist 2',
    path: '/audio/22.mp3',
    albumArt: '/images/22.jpg'
  },
];
>>>>>>> 870b0701c8d440ed4529140f847bf19e9d9ffbd8

