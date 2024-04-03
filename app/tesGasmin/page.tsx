"use client"

import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import Navbar from '../components/Navbar';
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

const CustomYouTubePlayer = () => {
  const [player, setPlayer] = useState<any>(null); // State untuk menyimpan referensi ke player YouTube
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<any>(null);


  const geofenceAreas: GeofenceArea[] = [

    // // gasmin
    { latitude: -6.9166387, longitude: 107.6615271, radius: 4, videoId: "DOOrIxw5xOw" },

    { latitude: -6.9167608, longitude: 107.6616099, radius: 4, videoId: "XnUNOaxw6bs" },

    { latitude: -6.9167322, longitude: 107.6613635, radius: 4, videoId: "36YnV9STBqc" },

    { latitude: -6.9168766, longitude: 107.6614897, radius: 4, videoId: "bk8WKwHDUNk" },
    { latitude: -6.5168766, longitude: 107.7614897, radius: 4, videoId: 'yNKvkPJl-tg' }

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

          geofenceAreas.forEach((area, index) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              isInsideAnyGeofence = true;
              areaIndex = index;
            }
          });

          setIsPlaying(true);


          setCurrentAreaIndex(isInsideAnyGeofence ? areaIndex : null);

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
      player.playVideo(); // Tambahkan pemutaran video secara otomatis saat komponen dimount
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


  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const playVideo = () => {
    watchUserLocation();
    if (player && currentAreaIndex !== 4) { // Memeriksa apakah currentAreaIndex bukan 4 (indeks untuk video di luar area)
      player.playVideo(); // Memanggil fungsi playVideo() dari objek player
    }
  };


  const opts = {
    height: '100',
    width: '100',
    playerVars: {
      autoplay: 0, // Atur ke 1 untuk autoplay
    },
  };

  return (
    <div>

      <div className=''>

        {geofenceAreas.map((area) => (
          <YouTube
            key={area.videoId}
            videoId={area.videoId}
            onReady={onReady}
            opts={opts}
          />
        ))}
      </div>

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
            {/* {isLoading && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
                  <CircleSpinner color='#FFF' outerBorderOpacity={0.5} outerBorderWidth={3} innerBorderWidth={3} />
                </div>
              )} */}
          </div>
        </div>
      ) : (
        <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
          <img src='/images/headphones.png' alt='' className='h-24 w-24' />
          <button
            className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
            onClick={playVideo}
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
  );
};

export default CustomYouTubePlayer;
