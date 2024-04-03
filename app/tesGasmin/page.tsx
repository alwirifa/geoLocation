"use client"

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import YouTube from 'react-youtube';
import { CircleSpinner } from 'react-spinner-overlay';

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

const Page = () => {
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<any>(null);

  const geofenceAreas: GeofenceArea[] = [

    // { latitude: -6.925368719382597, longitude: 107.6648914323083, radius: 6, videoId: "lP26UCnoH9s" },
    // { latitude: -6.925666016230372, longitude: 107.66497922370358, radius: 6, videoId: "DOOrIxw5xOw" },
    // { latitude: -6.925464304205161, longitude: 107.6645636305663, radius: 6, videoId: "bk8WKwHDUNk" },
    // { latitude: -6.925770034941376, longitude: 107.66466558186403, radius: 6, videoId: "36YnV9STBqc" },


    // // gasmin
    { latitude: -6.9166387, longitude: 107.6615271, radius: 4, videoId: "DOOrIxw5xOw" },

    { latitude: -6.9167608, longitude: 107.6616099, radius: 4, videoId: "XnUNOaxw6bs" },

    { latitude: -6.9167322, longitude: 107.6613635, radius: 4, videoId: "36YnV9STBqc" },

    { latitude: -6.9168766, longitude: 107.6614897, radius: 4, videoId: "bk8WKwHDUNk" },

  

    // { latitude: -6.2223542, longitude: 106.806881, radius: 20, videoId: "lP26UCnoH9s" },
    // { latitude: -6.2220232, longitude: 106.8068387, radius: 20, videoId: "WkBX4N79r4w" },
    // { latitude: -6.2216925, longitude: 106.8064602, radius: 25, videoId: "bk8WKwHDUNk" },
    // { latitude: -6.221902133889262, longitude: 106.80623434081818, radius: 20, videoId: "36YnV9STBqc" },
    // { latitude: -6.2222515, longitude: 106.8060507, radius: 20, videoId: "RP0vhIfNOQQ" },
    // { latitude: -6.2216579, longitude: 106.806822, radius: 20, videoId: "ku5VKha1VB8" },
  ]

  const watchUserLocation = () => {
    setExperienceStarted(true);
    setIsLoading(true);

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });

          let isInsideAnyGeofence = false;
          let areaIndex = null;
          let videoToPlay = 'yNKvkPJl-tg';

          geofenceAreas.forEach((area, index) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              isInsideAnyGeofence = true;
              areaIndex = index;
              videoToPlay = area.videoId;
            }
          });

          setIsPlaying(true);

          if (currentVideoId !== videoToPlay) {
            setCurrentVideoId(videoToPlay);
          }

          setCurrentAreaIndex(isInsideAnyGeofence ? areaIndex : null);

          if (!isInsideAnyGeofence && currentVideoId === 'yNKvkPJl-tg') {
            setIsPlaying(false);
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
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setExperienceStarted(false);
  };

  useEffect(() => {
    return () => {
      stopWatchUserLocation();
    };
  }, []);

  const onReady = (event: any) => {
    setPlayer(event.target);
    playerRef.current = event.target;
  };

  useEffect(() => {
    if (player && currentVideoId) {
      player.loadVideoById(currentVideoId);
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
      setIsLoading(false);
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

  return (
    <div className='h-[100svh] w-full relative'>
      <div className='bg-background h-[100svh] w-full bg-cover bg-center'>
        <div className='absolute top-0 flex justify-between w-full p-8'>
          <div>
            <img src='/images/ttd.png' alt='' className='w-auto h-8' />
          </div>
          <div className='flex gap-4 items-center'>
            <img src='/images/jakartaLogo.png' alt='' className='w-auto h-4' />
            <img src='/images/forteLogo.png' alt='' className='w-auto h-4' />
          </div>
        </div>

        {!experienceStarted ? (
          <div className={`flex flex-col items-center justify-center w-full pt-[16svh]`}>
            <div className='flex flex-col justify-center items-center gap-1'>
              <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
              <p className='text-sm'>Tomy Herseta, 2024.</p>
            </div>

            <p className='text-justify p-8 mt-6 font-medium'>
              Instalasi ini merupakan sebuah pengalaman mendengar yang membutuhkan partisipasi aktif dari pengunjung.{' '}
              <br />
              <br />
              Silakan gunakan earphone Anda untuk pengalaman yang lebih optimal.
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-4 items-center  pt-[16svh]'>
            {/* Geofence area indicators */}
            <div className='relative h-[200px] w-[200px] border-2 border-black'>
              {/* Render geofence areas here */}
            </div>

            {/* Current geofence area info */}
            {currentAreaIndex !== null ? (
              <p className='mt-4 font-semibold'>You are currently inside geofence area {currentAreaIndex + 1}</p>
            ) : (
              <p className='mt-4 font-semibold'>You are not inside any geofence area</p>
            )}

            {/* YouTube players */}
            <div className='flex'>
              {geofenceAreas.map((area) => (
                <YouTube
                  key={area.videoId}
                  videoId={area.videoId}
                  onReady={onReady}
                  opts={{ height: '100', width: '100', controls: 0, autoplay: 0, playsinline: 1 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom section */}
        {experienceStarted ? (
          <div>
            <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
              <img src='/images/headphones.png' alt='' className='h-24 w-24' />
              <button
                className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
                onClick={stopWatchUserLocation}
              >
                STOP LISTENING
              </button>
              {isLoading && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
                  <CircleSpinner color='#FFF' outerBorderOpacity={0.5} outerBorderWidth={3} innerBorderWidth={3} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
            <img src='/images/headphones.png' alt='' className='h-24 w-24' />
            <button
              className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
              onClick={watchUserLocation}
            >
              START EXPERIENCE
            </button>
          </div>
        )}

        {/* Navbar */}
        <div className='absolute bottom-0 w-full'>
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default Page;

