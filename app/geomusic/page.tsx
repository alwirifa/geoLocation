"use client"

import React, { useState } from 'react';
import YouTube from 'react-youtube';

type Props = {}

const Page = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [Speed, setSpeed] = useState(1); // Default Speed: 1

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(prevState => !prevState);
    }
  };

  const changeSpeed = (delta: number) => {
    const newSpeed = Speed + delta;
    if (player) {
      player.setPlaybackRate(newSpeed);
      setSpeed(newSpeed);
    }
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <div className='flex flex-col gap-2  justify-center items-center'>
        <YouTube
          videoId="P5mwtvf0yCU"
          onReady={onReady}
          opts={{ height: '400', width: '400', controls: 0 }} // Hiding YouTube controls
        />
        <div className="flex gap-2">
          <button onClick={() => changeSpeed(0.1)} className='px-4 py-2 fong-semibold text-sm rounded-md bg-purple text-white'>
            Speed Up
          </button>
          <button onClick={() => changeSpeed(-0.1)} className='px-4 py-2 fong-semibold text-sm rounded-md bg-purple text-white'>
            Speed Down
          </button>
          <button onClick={togglePlay} className='px-4 py-2 fong-semibold text-sm rounded-md bg-purple text-white'>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
