"use client"

import React, { useState, useEffect } from 'react';
import Pizzicato from 'pizzicato';

const MusicPlayer: React.FC = () => {
  const [gain, setGain] = useState(0.4);
  const [reverbTime, setReverbTime] = useState(0.01);
  const [reverbDecay, setReverbDecay] = useState(0.01);
  const [reverbMix, setReverbMix] = useState(0.5);
  const [delayFeedback, setDelayFeedback] = useState(0.6);
  const [delayTime, setDelayTime] = useState(0.4);
  const [delayMix, setDelayMix] = useState(0.5);
  const [sound, setSound] = useState<Pizzicato.Sound | null>(null);
  const [playButton, setPlayButton] = useState(true);
  const [distortionEffectOn, setDistortionEffectOn] = useState(false);
  const [reverbEffectOn, setReverbEffectOn] = useState(false);
  const [delayEffectOn, setDelayEffectOn] = useState(false);

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

      if (distortionEffectOn) sound.addEffect(distortion);
      if (reverbEffectOn) sound.addEffect(reverb);
      if (delayEffectOn) sound.addEffect(delay);

      setSound(sound);
    });

    return () => {
      sound && sound.stop();
    };
  }, [])
  const handlePlay = () => {
    setPlayButton(!playButton);

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

  const toggleDistortionEffect = () => {
    setDistortionEffectOn(!distortionEffectOn);
    if (sound) {
      if (distortionEffectOn) {
        sound.removeEffect(sound.effects[0]);
      } else {
        sound.addEffect(new Pizzicato.Effects.Distortion({ gain: gain }));
      }
    }
  };

  const toggleReverbEffect = () => {
    setReverbEffectOn(!reverbEffectOn);
    if (sound) {
      if (reverbEffectOn) {
        const reverbIndex = sound.effects.findIndex(effect => effect instanceof Pizzicato.Effects.Reverb);
        if (reverbIndex !== -1) {
          sound.removeEffect(sound.effects[reverbIndex]);
        }
      } else {
        sound.addEffect(new Pizzicato.Effects.Reverb({
          time: reverbTime,
          decay: reverbDecay,
          reverse: false,
          mix: reverbMix,
        }));
      }
    }
  };
  
  const toggleDelayEffect = () => {
    setDelayEffectOn(!delayEffectOn);
    if (sound) {
      if (delayEffectOn) {
        const delayIndex = sound.effects.findIndex(effect => effect instanceof Pizzicato.Effects.Delay);
        if (delayIndex !== -1) {
          sound.removeEffect(sound.effects[delayIndex]);
        }
      } else {
        sound.addEffect(new Pizzicato.Effects.Delay({
          feedback: delayFeedback,
          time: delayTime,
          mix: delayMix,
        }));
      }
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
      <div className='flex gap-4'>

        {/* Distortion */}
        <div className='flex flex-col gap-2 border-2 p-4 rounded-md w-[200px]'>
          <label className='text-xl text-center uppercase font-bold'>Distortion</label>
          <button className="p-2" onClick={toggleDistortionEffect}>{distortionEffectOn ? <span className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold'>ON</span>: <span className='bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold'>OFF</span>}</button>
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

        {/* Reverb */}
        <div className='flex flex-col gap-2 border-2 p-4 rounded-md w-[200px]'>
          <label className='text-xl text-center uppercase font-bold'>Reverb</label>
          <button className="p-2" onClick={toggleReverbEffect}>{reverbEffectOn ?  <span className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold'>ON</span>: <span className='bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold'>OFF</span>}</button>
          <label>Reverb Time: {reverbTime}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbTime}
            onChange={handleReverbTimeChange}
          />
          <label>Reverb Decay: {reverbDecay}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbDecay}
            onChange={handleReverbDecayChange}
          />
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

        {/* Delay */}
        <div className='flex flex-col gap-2 border-2 p-4 rounded-md w-[200px]'>
          <label className='text-xl text-center uppercase font-bold'>Delay</label>
          <button className="p-2" onClick={toggleDelayEffect}>{delayEffectOn ?  <span className='bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold'>ON</span>: <span className='bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold'>OFF</span>}</button>
          <label>Delay Feedback: {delayFeedback}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={delayFeedback}
            onChange={handleDelayFeedbackChange}
          />
          <label>Delay Time: {delayTime}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={delayTime}
            onChange={handleDelayTimeChange}
          />
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
    </div>
  );
};

export default MusicPlayer;
