"use client"

"use client"

import React, { useState, useEffect } from 'react';
import Pizzicato from 'pizzicato';

const MusicPlayer: React.FC = () => {
  const [gain, setGain] = useState(0.4);
  const [reverbTime, setReverbTime] = useState(0.01);
  const [reverbDecay, setReverbDecay] = useState(0.01);
  const [reverbMix, setReverbMix] = useState(0.5);
  const [delayFeedback, setDelayFeedback] = useState(0.6); // Feedback parameter for delay effect
  const [delayTime, setDelayTime] = useState(0.4); // Time parameter for delay effect
  const [delayMix, setDelayMix] = useState(0.5); // Mix parameter for delay effect
  const [sound, setSound] = useState<Pizzicato.Sound | null>(null);
  const [playButton, setPlayButton] = useState(true);

  useEffect(() => {
    const sound = new Pizzicato.Sound('/music/music.mp3', () => {
      const distortion = new Pizzicato.Effects.Distortion({
        gain: gain,
      });
      const reverb = new Pizzicato.Effects.Reverb({
        time: reverbTime,
        decay: reverbDecay,
        reverse: false,
        mix: reverbMix,
      });
      const delay = new Pizzicato.Effects.Delay({
        feedback: delayFeedback,
        time: delayTime,
        mix: delayMix,
      });
      sound.addEffect(distortion);
      sound.addEffect(reverb);
      sound.addEffect(delay);
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
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGain = parseFloat(event.target.value);
    setGain(newGain);
    if (sound && sound.effects[0]) {
      (sound.effects[0] as Pizzicato.Effects.Distortion).gain = newGain;
    }
  };

  const handleReverbTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReverbTime = parseFloat(event.target.value);
    setReverbTime(newReverbTime);
    if (sound && sound.effects[1]) {
      (sound.effects[1] as Pizzicato.Effects.Reverb).time = newReverbTime;
    }
  };

  const handleReverbDecayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReverbDecay = parseFloat(event.target.value);
    setReverbDecay(newReverbDecay);
    if (sound && sound.effects[1]) {
      (sound.effects[1] as Pizzicato.Effects.Reverb).decay = newReverbDecay;
    }
  };

  const handleReverbMixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReverbMix = parseFloat(event.target.value);
    setReverbMix(newReverbMix);
    if (sound && sound.effects[1]) {
      (sound.effects[1] as Pizzicato.Effects.Reverb).mix = newReverbMix;
    }
  };

  const handleDelayFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDelayFeedback = parseFloat(event.target.value);
    setDelayFeedback(newDelayFeedback);
    if (sound && sound.effects[2]) {
      (sound.effects[2] as Pizzicato.Effects.Delay).feedback = newDelayFeedback;
    }
  };

  const handleDelayTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDelayTime = parseFloat(event.target.value);
    setDelayTime(newDelayTime);
    if (sound && sound.effects[2]) {
      (sound.effects[2] as Pizzicato.Effects.Delay).time = newDelayTime;
    }
  };

  const handleDelayMixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDelayMix = parseFloat(event.target.value);
    setDelayMix(newDelayMix);
    if (sound && sound.effects[2]) {
      (sound.effects[2] as Pizzicato.Effects.Delay).mix = newDelayMix;
    }
  };

  return (
    <div>
      <button onClick={handlePlay}>{playButton ? 'Play' : 'Pause'}</button>
      <div>
        
        <label>Gain: {gain}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={gain}
          onChange={handleSliderChange}
        />
      </div>
      <div>
        <label>Reverb Time: {reverbTime}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={reverbTime}
          onChange={handleReverbTimeChange}
        />
      </div>
      <div>
        <label>Reverb Decay: {reverbDecay}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={reverbDecay}
          onChange={handleReverbDecayChange}
        />
      </div>
      <div>
        <label>Reverb Mix: {reverbMix}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={reverbMix}
          onChange={handleReverbMixChange}
        />
      </div>
      <div>
        <label>Delay Feedback: {delayFeedback}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={delayFeedback}
          onChange={handleDelayFeedbackChange}
        />
      </div>
      <div>
        <label>Delay Time: {delayTime}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={delayTime}
          onChange={handleDelayTimeChange}
        />
      </div>
      <div>
        <label>Delay Mix: {delayMix}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={delayMix}
          onChange={handleDelayMixChange}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
