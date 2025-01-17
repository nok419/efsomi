// src/data/songs.ts

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

