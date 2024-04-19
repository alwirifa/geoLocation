"use client"

import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import Navbar from './components/Navbar';
import Pizzicato from 'pizzicato';

import { enData, idData } from './data';
import { useGlobalContext } from './context/store';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
}

interface GeofenceArea {
  latitude: number;
  longitude: number;
  radius: number;
  videoId: string;
}

const CustomYouTubePlayer = () => {
  const [player, setPlayer] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const [experienceStarted, setExperienceStarted] = useState(false);

  // audio + effect
  const [gain, setGain] = useState(0.4);
  const [reverbTime, setReverbTime] = useState(0.01);
  const [reverbDecay, setReverbDecay] = useState(0.01);
  const [reverbMix, setReverbMix] = useState(0.5);
  const [delayFeedback, setDelayFeedback] = useState(0); // Feedback parameter for delay effect
  const [delayTime, setDelayTime] = useState(0); // Time parameter for delay effect
  const [delayMix, setDelayMix] = useState(0); // Mix parameter for delay effect
  const [sound, setSound] = useState<Pizzicato.Sound | null>(null);
  const [playButton, setPlayButton] = useState(true);

  const { language, toggleLanguage } = useGlobalContext();
  const data = language === 'en' ? enData : idData;

  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925382988682443, longitude: 107.66489520342901, radius: 8, videoId: "lP26UCnoH9s" },
    { latitude: -6.925643885570046, longitude: 107.66497546412633, radius: 8, videoId: "WkBX4N79r4w" },
    { latitude: -6.9254657883091, longitude: 107.66459461924887, radius: 8, videoId: "bk8WKwHDUNk" },
    { latitude: -6.925726685150913, longitude: 107.66474727194769, radius: 8, videoId: "36YnV9STBqc" },
    // { latitude: -6.916132, longitude: 107.6570591, radius: 8, videoId: '' },
    { latitude:     -6.925506406988566, longitude: 107.66503211873619,      radius: 8, videoId: '' },


    // { latitude: -6.2223542, longitude: 106.806881, radius: 20, videoId: "lP26UCnoH9s" },
    // { latitude: -6.2220232, longitude: 106.8068387, radius: 20, videoId: "WkBX4N79r4w" },
    // { latitude: -6.2216925, longitude: 106.8064602, radius: 25, videoId: "bk8WKwHDUNk" },
    // { latitude: -6.221902133889262, longitude: 106.80623434081818, radius: 20, videoId: "36YnV9STBqc" },
    // { latitude: -6.2222515, longitude: 106.8060507, radius: 20, videoId: "RP0vhIfNOQQ" },
    // { latitude: -6.2216579, longitude: 106.806822, radius: 20, videoId: "ku5VKha1VB8" },
  ];

  const watchUserLocation = () => {

    setExperienceStarted(true)

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });

          let isInsideAnyGeofence = false;
          let areaIndex = null;

          geofenceAreas.forEach((area, index) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              isInsideAnyGeofence = true;
              areaIndex = index;
            }
          });

          setCurrentAreaIndex(isInsideAnyGeofence ? areaIndex : null);

          if (!hasUserClicked) {

            setIsPlaying(isInsideAnyGeofence);
          }

        },
        (error) => {
          console.error('Error watching user location: ', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      setWatchId(id);
    } else {
      console.log('Geolocation is not supported by this browser');
    }
  };


  const stopWatchUserLocation = () => {
    setExperienceStarted(false)
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    // player.pauseVideo();
  

    sound && sound.pause();

    if (currentAreaIndex === 4) {
      sound && sound.play();
    } 
  };

  useEffect(() => {
    return () => {
      stopWatchUserLocation();
    };
  }, []);

  useEffect(() => {
    if (player && currentVideoId) {
      player.loadVideoById(currentVideoId);
      if (isPlaying) {
      } else {
        player.pauseVideo();
      }
    }
  }, [player, currentVideoId, isPlaying]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance * 1000;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const opts = {
    height: '100',
    width: '100',
    playerVars: {
      autoplay: 0,
      playsinline: 1
    },
  };

  useEffect(() => {
    if (currentAreaIndex !== null && geofenceAreas[currentAreaIndex]) {
      const { videoId } = geofenceAreas[currentAreaIndex];
      setCurrentVideoId(videoId);

      if (currentAreaIndex === 3) {
        sound && sound.play();
      } else {
        sound && sound.pause();
      }

    } else {
      setCurrentVideoId("HIRNdveLnJI");
    }
  }, [currentAreaIndex]);

  const playVideo = () => {
    setHasUserClicked(true)

    const videoIdToPlay = currentAreaIndex !== null && geofenceAreas[currentAreaIndex]
      ? geofenceAreas[currentAreaIndex].videoId
      : "HIRNdveLnJI";

      console.log(videoIdToPlay)

    setCurrentVideoId(videoIdToPlay);
    setShowPlayButton(false)
    setIsPlaying(true);
    setVideoPlayed(true);
    player.playVideo();

  };


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
    <div className='h-[100svh] w-full relative '>
      <div className='h-[100svh] w-full relative '>
        <div className='bg-background h-[100svh] w-full bg-cover bg-center'>

          <div className='absolute top-0 flex justify-between w-full p-8'>
            <div>
              <img src="/images/ttd.png" alt="" className='w-auto h-8' />
            </div>
            <div className='flex gap-4 items-center'>
              <img src="/images/jakartaLogo.png" alt="" className='w-auto h-4' />
              <img src="/images/forteLogo.png" alt="" className='w-auto h-4' />
            </div>
          </div>


          <div className='absolute top-0'>
            {geofenceAreas.map((area, index) => (
              <YouTube
                key={index}
                videoId={area.videoId}
                onReady={onReady}
                opts={opts}
              />
            ))}
          </div>

          {showPlayButton ? (
            <div className='w-full h-full flex justify-center items-center fixed top-0 z-50 bg-black/50'>

              <div className='bg-white border border-black p-4 rounded-md flex justify-center items-center flex-col gap-4 '>
                <p className='font-semibold'>Allow Your GPS location</p>
                <button className='p-4 py-2 rounded-md border border-black font-semibold shadow--md' onClick={playVideo}>
                  ok
                </button>
              </div>
            </div>
          ) : (
            <button className='hidden' onClick={playVideo}>
              ieu eweuh
            </button>
          )}

          {experienceStarted ? (
            <div className="flex flex-col gap-4 items-center  pt-[16svh] z-20">

              <div className='flex flex-col justify-center items-center gap-1'>
                <p className='text-lg text-purple font-bold exo'>HERE, NOWHERE HEAR</p>
                <p className='text-xs'>Tomy Herseta, 2024.</p>
              </div>
              <div className='relative'>
                <div className='bg-purple  flex justify-end items-center px-3 py-1 absolute top-0 w-full'>
                  <img src="/images/close.png" className='h-[30px] w-[30px]' alt="" onClick={stopWatchUserLocation} />
                </div>
                <div className='mt-8 h-[200px] w-[300px]'>

                  {userLocation && (
                    <div>
                      <p>Latitude: {userLocation.latitude}</p>
                      <p>Longitude: {userLocation.longitude}</p>
                      <p>Accuracy: {userLocation.accuracy} meters</p>
                      <p>Speed: {userLocation.speed} meters/second</p>
                    </div>
                  )}
                </div>
                {/* <img src="/images/map.png" alt="" className='h-auto w-[300px]' /> */}
                <div className='bg-purple  flex justify-between items-center p-2 px-4 absolute bottom-0 w-full'>
                  {currentAreaIndex !== null ? (
                    <p className="text-white font-bold exo">AUDIO {currentAreaIndex + 1}</p>
                  ) : (
                    <p className="text-white font-bold exo">OUT OF AREA</p>
                  )}

                  <div>
                    <img src="/images/audio.png" alt="" className='h-6 w-6' />
                  </div>
                </div>
              </div>

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

            </div>

          ) : (
            <div>

              <div className={`flex flex-col items-center justify-center w-full pt-[16svh]`}>

                <div className='flex flex-col justify-center items-center gap-1'>
                  <p className='text-lg text-purple font-bold exo'>HERE, NOWHERE HEAR</p>
                  <p className='text-xs'>Tomy Herseta, 2024.</p>
                </div>

                <div className='flex flex-col gap-4 px-10 mt-4 '>
                  <p className='text-justify font-medium '>
                    {data.home1}
                  </p>
                  <p className='text-justify font-medium'>
                    {data.home2}
                  </p>
                </div>
              </div>
              <div className='absolute w-full bottom-[12svh] flex flex-col gap-4 justify-center items-center'>
                <p className='uppercase text-lg text-purple font-bold exo text-center px-16'>{data.device}</p>
                <img src='/images/headphones.png' alt='' className='h-20 w-20' />
                <button
                  className='border-2 border-purple text-purple font-bold text-lg px-6 py-2 rounded-full max-w-max exo'
                  onClick={watchUserLocation}
                ><p className='exo'>

                    START EXPERIENCE
                  </p>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <div className='absolute bottom-0 w-full'>
        <Navbar />
      </div>

    </div>
  );
};

export default CustomYouTubePlayer;