"use client"

import React from 'react';
import { XSound, X } from 'xsound'; 

const AudioButton: React.FC = () => {
  const playAudio = () => {
    // path to  audio file
    const audioPath = '/music/habibi.mp3';

    // Create an instance of AudioContext
    const context = XSound.get();

    // Create an audio buffer source
    const source = context.createBufferSource();

    // EFFECT OVERDRIVE
    fetch(audioPath)
      .then((response) => response.arrayBuffer())
      .then((data) => context.decodeAudioData(data))
      .then((buffer) => {
        source.buffer = buffer;

        const overdrive = new X.OverDrive(context);

        source.connect(overdrive.INPUT);

        overdrive.OUTPUT.connect(context.destination);

        overdrive.param({
          drive: 0.5, 
         
        });

        overdrive.activate();

        source.start(0);
      })


      // EFFECT PITCH SHIFTER

      // fetch(audioPath)
      // .then((response) => response.arrayBuffer())
      // .then((data) => context.decodeAudioData(data))
      // .then((buffer) => {
      //   source.buffer = buffer;

      //   const pitchShifter = new X.PitchShifter(context);

      //   source.connect(pitchShifter.INPUT);

      //   pitchShifter.OUTPUT.connect(context.destination);

      //   pitchShifter.param({
      //     state: true,
      //     pitch: 2, 
      //   });

      //   pitchShifter.activate();

      //   source.start(0);
      // })

      
      .catch((error) => console.error('Error loading audio:', error));
  };

  

  return (
    <button onClick={playAudio}>Play Audio with OverDrive</button>
  );
};

export default AudioButton;
