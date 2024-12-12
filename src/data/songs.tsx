// src/data/songs.tsx
import { Song } from '../../types/audio';

export const songs: Song[] = [
  {
    id: 'song1',
    title: 'Morning Light',
    artist: 'Artist 1',
    path: '/assets/songs/morning-light.mp3',
    albumArt: '/assets/images/morning-light.jpg'
  },
  // ...他の曲も同様に定義
];