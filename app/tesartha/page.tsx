"use client"

import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import Navbar from '../components/Navbar';
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



  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925391401199705, longitude: 107.66489758575915, radius: 10, videoId: "XnUNOaxw6bs" },
    { latitude: -6.925487185695368, longitude: 107.66453954172253, radius: 10, videoId: "36YnV9STBqc" },
    // { latitude: -6.925579012135751, longitude: 107.66500683304874, radius: 8, videoId: "bk8WKwHDUNk" },
    { latitude: -6.5168766, longitude: 107.7614897, radius: 8, videoId: 'yNKvkPJl-tg' }
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
    } else {
      setCurrentVideoId("HIRNdveLnJI");
    }
  }, [currentAreaIndex]);

  const playVideo = () => {
    setHasUserClicked(true)


    const videoIdToPlay = currentAreaIndex !== null && geofenceAreas[currentAreaIndex]
      ? geofenceAreas[currentAreaIndex].videoId
      : "HIRNdveLnJI";

    setCurrentVideoId(videoIdToPlay);
    setShowPlayButton(false)
    setIsPlaying(true);
    setVideoPlayed(true);
    player.playVideo();
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


          <div className='absolute hidden top-0'>
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
            <div className='w-full h-full flex justify-center items-center fixed top-0'>

              <div className='bg-white border-2 border-black p-4 rounded-md flex justify-center items-center flex-col gap-4'>
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
            <div className="flex flex-col gap-4 items-center  pt-[16svh]">

              <div className='flex flex-col justify-center items-center gap-1'>
                <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
                <p className='text-xs'>Tomy Herseta, 2024.</p>
              </div>
              <div className='relative'>
                <div className='bg-purple  flex justify-end items-center px-3 py-1 absolute top-0 w-full'>
                  <img src="/images/close.png" className='h-[30px] w-[30px]' alt="" onClick={stopWatchUserLocation} />
                </div>
                <img src="/images/map.png" alt="" className='h-auto w-[300px]' />
                <div className='bg-purple  flex justify-between items-center p-2 px-4 absolute bottom-0 w-full'>
                  {currentAreaIndex !== null ? (
                    <p className="text-white font-semibold">AUDIO {currentAreaIndex + 1}</p>
                  ) : (
                    <p className="text-white font-semibold">OUT OF AREA</p>
                  )}

                  <div>
                    <img src="/images/audio.png" alt="" className='h-6 w-6' />
                  </div>
                </div>

                <div className='absolute bottom-[134px] right-16 p-4 border-2 border-green-500 flex justify-center items-center'>
                  <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 0 ? 'visible' : 'hidden'}`} />
                </div>
                <div className='absolute top-36 right-24 p-4 border-2 border-green-500 flex justify-center items-center'>
                  <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 1 ? 'visible' : 'hidden'}`} />
                </div>
                <div className='absolute top-20 left-32 p-4 border-2 border-green-500 flex justify-center items-center'>
                  <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 2 ? 'visible' : 'hidden'}`} />
                </div>
                <div className='absolute top-32 left-16 p-4 border-2 border-green-500 flex justify-center items-center'>
                  <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 3 ? 'visible' : 'hidden'}`} />
                </div>

                <div className='absolute bottom-40 left-4 p-4 border-2 border-green-500 flex justify-center items-center'>
                  <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 4 ? 'visible' : 'hidden'}`} />
                </div>

                <div className='absolute top-16 right-8 p-4 border-2 border-green-500 flex justify-center items-center'>
                  <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 5 ? 'visible' : 'hidden'}`} />
                </div>
              </div>
            </div>

          ) : (
            <div>

              <div className={`flex flex-col items-center justify-center w-full pt-[16svh]`}>

                <div className='flex flex-col justify-center items-center gap-1'>
                  <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
                  <p className='text-xs'>Tomy Herseta, 2024.</p>
                </div>

                <div className='flex flex-col gap-4 p-8 mt-6 '>
                 
                </div>
              </div>
              <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
                <img src='/images/headphones.png' alt='' className='h-24 w-24' />
                <button
                  className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
                  onClick={watchUserLocation}
                >
                  START EXPERIENCE
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