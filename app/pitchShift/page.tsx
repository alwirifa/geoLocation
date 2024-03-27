"use client"

import React, { useState, useEffect } from 'react';

type Props = {}

const Page = (props: Props) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const newAudioContext = new (window.AudioContext);
    setAudioContext(newAudioContext);

    return () => {
      newAudioContext.close();
    };
  }, []);

  useEffect(() => {
    if (!audioContext) return;

    const loadAudioFile = async () => {
      try {
        const response = await fetch('/music/habibi.mp3');
        const audioData = await response.arrayBuffer();
        const decodedAudioData = await audioContext.decodeAudioData(audioData);
        setAudioBuffer(decodedAudioData);
      } catch (error) {
        console.error('Error loading audio file:', error);
      }
    };

    loadAudioFile();
  }, [audioContext, props]);

  useEffect(() => {
    if (!audioContext || !audioBuffer || !isPlaying) return;

    const playAudio = () => {
      const newSourceNode = audioContext.createBufferSource();
      const overdriveNode = audioContext.createGain();
      overdriveNode.gain.value = 0.5; // Adjust this value to control overdrive effect
      newSourceNode.buffer = audioBuffer;
      newSourceNode.connect(overdriveNode);
      
      // Overdrive effect
      const waveShaperNode = audioContext.createWaveShaper();
      const overdriveCurve = makeOverdriveCurve(100); // Adjust the parameter for shaping the overdrive
      waveShaperNode.curve = overdriveCurve;
      overdriveNode.connect(waveShaperNode);
      waveShaperNode.connect(audioContext.destination);
      
      newSourceNode.start(0);
      setSourceNode(newSourceNode);
    };

    playAudio();

    return () => {
      if (sourceNode) {
        sourceNode.stop();
        setSourceNode(null);
      }
    };
  }, [audioContext, audioBuffer, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Function to create the overdrive curve
  const makeOverdriveCurve = (amount: number) => {
    const sampleRate = audioContext ? audioContext.sampleRate : 44100;
    const curve = new Float32Array(1024);

    for (let i = 0; i < 512; i++) {
      const x = i * 2 / 512 - 1;
      curve[i] = (3 + amount) * x * 20 * (Math.PI / 180) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  };

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
}

export default Page;
