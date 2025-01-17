// src/data/songs.ts

export const loadSongs = async () => {
  return [
    {
      id: '1',
      title: 'Test Song 1',
      artist: 'Test Artist 1',
      path: '/audio/songs/test1.mp3',
      albumArt: '/audio/songs/test1.jpg'
    },
    {
      id: '2',
      title: 'Test Song 2',
      artist: 'Test Artist 2',
      path: '/audio/songs/test2.mp3',
      albumArt: '/audio/songs/test2.jpg'
    },
    {
      id: '3',
      title: 'Test Song 3',
      artist: 'Test Artist 3',
      path: '/audio/songs/test3.mp3',
      albumArt: '/audio/songs/test3.jpg'
    }
  ];
};

