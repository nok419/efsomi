// src/data/environmentalSounds.ts

export const loadEnvironmentalSounds = async () => {
  const response = await fetch('/audio/envsounds/');
  if (!response.ok) {
    throw new Error(`Failed to load environmental sounds: ${response.statusText}`);
  }
  const files = await response.json();
  return files.filter((file: string) => file.endsWith('.mp3') || file.endsWith('.wav')).map((file: string, index: number) => ({
    id: `${index + 1}`,
    name: file.replace(/\.[^/.]+$/, ""), // ファイル名から拡張子を除去して名前に使用
    category: index % 2 === 0 ? 'urban' : 'nature',
    src: `/audio/envsounds/${file}`,
    thumbnail: `/audio/envsounds/${file.replace(/\.[^/.]+$/, "")}.jpg` // サムネイルのパスを修正
  }));
};