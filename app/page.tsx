"use client"

import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import Navbar from './components/Navbar';

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
  const [firstPlay, setFirstPlay] = useState(true);

  const { language, toggleLanguage } = useGlobalContext();
  const data = language === 'en' ? enData : idData;

  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.2223542, longitude: 106.806881, radius: 30, videoId: "xK4ZqrLys_k" },
    { latitude: -6.2220232, longitude: 106.8068387, radius: 25, videoId: "XKueVSGTk2o" },
    { latitude: -6.2216925, longitude: 106.8064602, radius: 25, videoId: "YDfiTGGPYCk" },
    { latitude: -6.221902133889262, longitude: 106.80623434081818, radius: 25, videoId: "gCNeDWCI0vo" },
    { latitude: -6.2222515, longitude: 106.8060507, radius: 25, videoId: "jfKfPfyJRdk" },
    { latitude: -6.2216579, longitude: 106.806822, radius: 25, videoId: "DOOrIxw5xOw" },
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

          if (!isInsideAnyGeofence) {
            setCurrentVideoId('lJAjCRP00SI')
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
    if (player) {
      player.pauseVideo(); // Memeriksa apakah player telah diinisialisasi sebelum memanggil pauseVideo()
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
        player.playVideo();
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

    } else {
      setCurrentVideoId("lJAjCRP00SI");
    }

    console.log(currentVideoId)
    console.log(currentAreaIndex)
  }, [currentAreaIndex]);

  
  const playVideo = () => {
    setHasUserClicked(true)
    const videoIdToPlay = currentAreaIndex !== null && geofenceAreas[currentAreaIndex]
      ? geofenceAreas[currentAreaIndex].videoId
      : "1SLr62VBBjw";
    setCurrentVideoId(videoIdToPlay);
    setShowPlayButton(false)
    setIsPlaying(true);
    setVideoPlayed(true);
    
    setTimeout(() => {
          if(player) {
            player.playVideo();
          }
        }, 5000); // Time delay 3 detik
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


          <div className='absolute top-0 '>
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

              <div className='bg-white border-2 border-purple p-4 rounded-md flex justify-center items-center flex-col gap-4 '>
                <p className='font-bold exo text-center text-purple px-6 pt-6'>Please allow your GPS location<br /> before start the experience</p>
                <button className='p-4 py-2 mb-4 rounded-md border-2 border-purple text-purple font-bold  text-sm exo shadow-md' onClick={playVideo}>
                  OK
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

                <img src="/images/map.png" alt="" className='h-auto w-[300px]' />
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