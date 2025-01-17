// src/data/environmentalSounds.ts

<<<<<<< HEAD
export const loadEnvironmentalSounds = async () => {
  const response = await fetch('/audio/envsounds/');
  if (!response.ok) {
    throw new Error(`Failed to load environmental sounds: ${response.statusText}`);
=======
export const environmentalSounds: EnvironmentalSound[] = [
  {
    id: 'env1',
    name: '波の音',
    category: 'nature',
    subCategory: 'water',
    characteristics: ['peaceful', 'continuous'],
    src: '/audio/environmental/wave.mp3',
    thumbnail: '/images/s.jpg'
  },
  {
    id: 'env2',
    name: '雨の音',
    category: 'nature',
    subCategory: 'weather',
    characteristics: ['ambient', 'soothing'],
    src: '/audio/environmental/rain.mp3',
    thumbnail: '/images/r.jpg'
  },
  {
    id: 'env3',
    name: '街の喧騒',
    category: 'urban',
    subCategory: 'city',
    characteristics: ['busy', 'dynamic'],
    src: '/audio/environmental/city.mp3',
    thumbnail: '/images/c.jpg'
  },
  {
    id: 'env4',
    name: 'カフェの雰囲気',
    category: 'urban',
    subCategory: 'indoor',
    characteristics: ['social', 'warm'],
    src: '/audio/environmental/cafe.mp3',
    thumbnail: '/images/ca.jpg'
>>>>>>> 870b0701c8d440ed4529140f847bf19e9d9ffbd8
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