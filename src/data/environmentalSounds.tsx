// data/environmentalSounds.ts
import { EnvironmentalSound } from '../../types/audio';

export const environmentalSounds: EnvironmentalSound[] = [
  {
    id: 'wave-1',
    name: '波の音',
    category: 'nature',
    subCategory: 'water',
    path: '/sounds/wave-1.mp3',
    thumbnail: '/images/wave-1-thumb.jpg',
    characteristics: ['穏やか', '継続的']
  },
  {
    id: 'rain-1',
    name: '雨音',
    category: 'nature',
    subCategory: 'weather',
    path: '/sounds/rain-1.mp3',
    thumbnail: '/images/rain-1-thumb.jpg',
    characteristics: ['静か', 'リズミカル']
  },
  {
    id: 'cafe-1',
    name: 'カフェ',
    category: 'urban',
    subCategory: 'indoor',
    path: '/sounds/cafe-1.mp3',
    thumbnail: '/images/cafe-1-thumb.jpg',
    characteristics: ['にぎやか', '会話']
  },
  // ... 他の環境音データ
];