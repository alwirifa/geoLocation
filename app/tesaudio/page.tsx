"use client"

import React, { useState } from 'react';

type Props = {};

const Page = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    setIsPlaying(true);
    const audio = new Audio('/music/habibi.mp3');
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Music'}
      </button>
    </div>
  );
};

export default Page;
