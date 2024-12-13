// src/data/songs.ts
import { Song } from '../../types/audio';

export const songs: Song[] = [
  {
    id: 'song1',
    title: 'Peaceful Morning',
    artist: 'Test Artist 1',
    path: '/audio/songs/peaceful_morning.mp3',
    albumArt: '/images/album_peaceful.jpg'
  },
  {
    id: 'song2',
    title: 'Urban Night',
    artist: 'Test Artist 2',
    path: '/audio/songs/urban_night.mp3',
    albumArt: '/images/album_urban.jpg'
  },
  {
    id: 'song3',
    title: 'Nature Walk',
    artist: 'Test Artist 3',
    path: '/audio/songs/nature_walk.mp3',
    albumArt: '/images/album_nature.jpg'
  }
];

