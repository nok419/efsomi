// src/data/environmentalSounds.ts
import { EnvironmentalSound } from '../../types/audio';

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
  }
];