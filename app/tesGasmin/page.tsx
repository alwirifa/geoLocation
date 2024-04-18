"use client"

import React, { useState, useEffect } from 'react';
import Pizzicato from 'pizzicato';

const MusicPlayer: React.FC = () => {
  const [gain, setGain] = useState(0.4);
  const [sound, setSound] = useState<Pizzicato.Sound | null>(null);
  const [playButton, setPlayButton] = useState(false)

  useEffect(() => {
    const sound = new Pizzicato.Sound('/music/music.mp3', () => {
      const distortion = new Pizzicato.Effects.Distortion({
        gain: gain,
      });
      sound.addEffect(distortion);
      setSound(sound);
    });

    return () => {
      sound && sound.stop();
    };
  }, []);

  const handlePlay = () => {
    setPlayButton(!playButton)

    if (playButton) {
      sound && sound.play();
    } else {
      sound && sound.pause();
    }
    console.log(playButton)
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGain = parseFloat(event.target.value);
    setGain(newGain);
    if (sound && sound.effects[0]) {
      (sound.effects[0] as Pizzicato.Effects.Distortion).gain = newGain;
    }
  };
  

  return (
    <div>
      <button onClick={handlePlay}>Play</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={gain}
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default MusicPlayer;
