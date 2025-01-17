// src/data/environmentalSounds.ts

export const loadEnvironmentalSounds = async () => {
  return [
    {
      id: '1',
      name: 'Test Environmental Sound 1',
      category: 'nature',
      src: '/audio/envsounds/test1.mp3',
      thumbnail: '/audio/envsounds/test1.jpg'
    },
    {
      id: '2',
      name: 'Test Environmental Sound 2',
      category: 'urban',
      src: '/audio/envsounds/test2.mp3',
      thumbnail: '/audio/envsounds/test2.jpg'
    },
    {
      id: '3',
      name: 'Test Environmental Sound 3',
      category: 'nature',
      src: '/audio/envsounds/test3.mp3',
      thumbnail: '/audio/envsounds/test3.jpg'
    }
  ];
};