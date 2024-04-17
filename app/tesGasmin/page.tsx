"use client";

import React, { useState, useEffect } from 'react';
import Pizzicato from 'pizzicato';

const Page = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Pizzicato.Sound | null>(null);

  useEffect(() => {
    const initializeSound = () => {
      const newSound = new Pizzicato.Sound('/music/music.mp3', () => {
      
        // Create a reverb effect
        const reverb = new Pizzicato.Effects.Reverb({
          time: 3,
          decay: 2,
          reverse: false,
          mix: 0.7
        });

        // Create a distortion effect
        const distortion = new Pizzicato.Effects.Distortion({
          gain: 0.4
        });

        // Add effects to the sound
        newSound.addEffect(reverb);
        newSound.addEffect(distortion);

        // Set the sound
        setSound(newSound);
      });
    };

    initializeSound();

    return () => {
      if (sound) {
        sound.stop();
      }
    };
  }, []); 

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? 'Pause Music' : 'Play Music'}</button>
    </div>
  );
};

export default Page;
