"use client"

import { useEffect, useRef, useState } from 'react';
import { XSound, X, FileEvent } from 'xsound';

type FileChangeEvent = React.ChangeEvent<HTMLInputElement> & {
  target: HTMLInputElement & {
    files: FileList;
  };
};

export default function Home() {
  const resultRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploaderRef = useRef<HTMLInputElement>(null);
  const [overdriveParams, setOverdriveParams] = useState({
    drive: 1.0
  });

  const handleOverdriveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : parseFloat(event.target.value);
    const name = event.target.name;

    if (name === 'drive') {
      setOverdriveParams({
        ...overdriveParams,
        [name]: Math.max(0, Math.min(1, value as number))
      });
    }
    handleApplyOverdrive(); // Call apply function whenever value changes
  };

  const handleApplyOverdrive = () => {
    X('audio').module('overdrive').param(overdriveParams);
  };

  useEffect(() => {
    if (!resultRef.current || !canvasRef.current || !uploaderRef.current) {
      return;
    }

    const result = resultRef.current;
    const uploader = uploaderRef.current;

    X('audio').setup({
      decodeCallback: (audiobuffer: AudioBuffer) => {
        result.textContent = `sampling rate ${audiobuffer.sampleRate} Hz\n${audiobuffer.length} samples\n${audiobuffer.duration} sec\n${audiobuffer.numberOfChannels} channels\n`;
      },
      updateCallback: (source, currentTime) => {
        // do something ...
      },
      endedCallback: (source, currentTime) => {
        result.textContent = currentTime.toString();
      },
      errorCallback: (error: Error) => {
        result.textContent = error.message;
      }
    });

   

    X('audio')
      .module('analyser')
      .domain('timeoverview', 0)
      .setup(canvasRef.current)
     
      .drag((event, startTime, endTime, mode, direction) => {
        X('audio').param({ currentTime: endTime });
      });

    uploader.onchange = (event) => {
      const file = (event as unknown as FileChangeEvent).target.files[0];

      if (!file) {
        result.textContent = 'There is no uploaded file';
        return;
      }

      X.file({
        event           : event as unknown as FileEvent,
        type            : 'arraybuffer',
        successCallback : (event, arraybuffer) => {
          X('audio').ready(arraybuffer);
          result.textContent = `filename ${file.name}\nMIME ${file.type}\n${file.size} bytes\n`;
        },
        errorCallback  : (event, textStatus) => {
          result.textContent = textStatus;
        },
        progressCallback: (event) => {
          if (event.lengthComputable && (event.total > 0)) {
            result.textContent = `${Math.trunc((event.loaded / event.total) * 100)} %`;
          }
        }
      });
    };

    // Activate overdrive effect
    X('audio').module('overdrive').activate();

    // Set overdrive effect parameters
    X('audio').module('overdrive').param(overdriveParams);

  }, []);

  const handleStart = () => {
    X('audio').start(X('audio').param('currentTime'));
  };

  const handleStop = () => {
    X('audio').stop();
  };

  const handleUpload = () => {
    uploaderRef.current?.click();
  };

  return (
    <div>
      <p id="result-text" ref={resultRef}></p>
      <canvas className="hidden" ref={canvasRef}></canvas>
      <h2>Overdrive Parameters</h2>
      <label>
        Drive:
        <input type="range" min="0" max="1" step="0.01" name="drive" value={overdriveParams.drive} onChange={handleOverdriveChange} />
        <output>{overdriveParams.drive}</output>
      </label>
      <button id="button-start" onClick={handleStart}>Start</button>
      <button id="button-stop" onClick={handleStop}>Stop</button>
      <button id="button-uploader" onClick={handleUpload}>Upload</button>
      <input type="file" ref={uploaderRef} style={{ display: 'none' }} />
    </div>
  );
}
