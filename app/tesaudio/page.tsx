"use client"

import React, { useState } from 'react';

const AudioButton: React.FC = () => {
  const [overdriveAmount, setOverdriveAmount] = useState(0); 
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [overdrive, setOverdrive] = useState<WaveShaperNode | null>(null);

  const playAudio = async () => {
    // path to audio file
    const audioPath = '/music/music.mp3';

    try {
      // fetch audio file
      const response = await fetch(audioPath);
      const arrayBuffer = await response.arrayBuffer();

      // create audio context
      const context = new (window.AudioContext)();
      setAudioContext(context);

      // decode audio data
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      // create audio source
      const src = context.createBufferSource();
      src.buffer = audioBuffer;
      setSource(src);

      // create overdrive effect
      const od = context.createWaveShaper();
      od.curve = makeDistortionCurve(overdriveAmount);
      od.oversample = '4x';
      setOverdrive(od);

      // connect audio nodes
      src.connect(od);
      od.connect(context.destination);

      // start playing audio
      src.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // function to create distortion curve
  const makeDistortionCurve = (amount: number) => {
    if (amount === 0) return null; 
    const numSamples = 1024;
    const curve = new Float32Array(numSamples);
    const deg = Math.PI / 180;
    const x = amount * 1000; // scale the amount to match the previous range
    for (let i = 0; i < numSamples; ++i) {
      const value = (i * 2) / numSamples - 1;
      curve[i] = (3 + x) * value * 20 * deg / (Math.PI + x * Math.abs(value));
    }
    return curve;
  };

  // function to handle slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setOverdriveAmount(newValue);
    if (overdrive) {
      overdrive.curve = makeDistortionCurve(newValue);
    }
  };

  
  return (
    <div>
      <button onClick={playAudio}>Play Audio with OverDrive</button>
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={overdriveAmount}
          onChange={handleSliderChange}
        />
        <span>{overdriveAmount}</span>
  
      </div>
    </div>
  );
};

export default AudioButton;
