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
    { latitude: -6.9166387, longitude: 107.6615271, radius: 4, videoId: "DOOrIxw5xOw" },
    { latitude: -6.9167608, longitude: 107.6616099, radius: 4, videoId: "XnUNOaxw6bs" },
    { latitude: -6.9167322, longitude: 107.6613635, radius: 4, videoId: "36YnV9STBqc" },
    { latitude: -6.9168766, longitude: 107.6614897, radius: 4, videoId: "bk8WKwHDUNk" },
  ];

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

  const startExperience = () => {
    watchUserLocation();
  };

  useEffect(() => {
    if (experienceStarted) {
      watchUserLocation();
    }
  }, [experienceStarted]);

  const onAreaChange = (areaIndex: number) => {
    setCurrentAreaIndex(areaIndex);
    setIsPlaying(true);
  };

  return (
    <div className='h-[100svh] w-full relative'>
      {/* Konten lainnya */}

      {!experienceStarted && (
        <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
          <img src='/images/headphones.png' alt='' className='h-24 w-24' />
          <button
            className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
            onClick={startExperience}
          >
            START EXPERIENCE
          </button>
        </div>
      )}

      <div className='flex'>
        {geofenceAreas.map((area, index) => (
          <YouTube
            key={area.videoId}
            videoId={area.videoId}
            onReady={onReady}
            opts={{ height: '100', width: '100', controls: 0, autoplay: 0, playsinline: 1 }}
            onPlay={() => onAreaChange(index)}
          />
        ))}
      </div>

      {/* Bottom section */}
      {experienceStarted && (
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
      )}

      {/* Navbar */}
      <div className='absolute bottom-0 w-full'>
        <Navbar />
      </div>
    </div>
  );
};

export default Page;
