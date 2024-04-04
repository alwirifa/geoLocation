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
  top: number; // Tambahan properti untuk posisi tombol khusus
  left: number; // Tambahan properti untuk posisi tombol khusus
}

const CustomYouTubePlayer = () => {
  const [player, setPlayer] = useState<any>(null);
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [showCustomButton, setShowCustomButton] = useState(false);

  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925592410971176, longitude: 107.66503232426012, radius: 15, videoId: "DOOrIxw5xOw", top: 100, left: 100 },
    { latitude: -6.9167608, longitude: 107.6616099, radius: 4, videoId: "XnUNOaxw6bs", top: 200, left: 200 },
    { latitude: -6.9167322, longitude: 107.6613635, radius: 4, videoId: "36YnV9STBqc", top: 300, left: 300 },
    { latitude: -6.9168766, longitude: 107.6614897, radius: 4, videoId: "bk8WKwHDUNk", top: 400, left: 400 },
    { latitude: -6.5168766, longitude: 107.7614897, radius: 4, videoId: 'yNKvkPJl-tg', top: 500, left: 500 }
  ];

  const watchUserLocation = () => {
    setExperienceStarted(true);
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

          // Memeriksa apakah pengguna telah memainkan video sebelumnya
          if (!isPlaying) {
            setIsPlaying(true);
            setShowCustomButton(true);
          }

          // Memeriksa apakah pengguna telah memasuki area baru
          if (areaIndex !== currentAreaIndex) {
            // Jika pengguna telah memasuki area baru, pause video dari area sebelumnya
            if (player) {
              player.pauseVideo();
            }
            setCurrentAreaIndex(areaIndex);
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
    if (player) {
      player.pauseVideo();
    }
  };

  useEffect(() => {
    return () => {
      stopWatchUserLocation();
    };
  }, []);

  // useEffect(() => {
  //   if (player && currentVideoId) {
  //     player.loadVideoById(currentVideoId);
  //     if (isPlaying) {
  //       player.playVideo();
  //       if (currentAreaIndex !== null) {
  //         player.unMute();
  //       }
  //     } else {
  //       player.pauseVideo();
  //     }
  //   }
  // }, [player, currentVideoId, isPlaying, currentAreaIndex]);

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

  const playVideo = (videoId: string) => {
    watchUserLocation();
    setCurrentVideoId(videoId);
    setShowCustomButton(false);
  };

  useEffect(() => {
    if (currentAreaIndex !== null) {
      const area = geofenceAreas[currentAreaIndex];
      setCurrentVideoId(area.videoId);
      setIsPlaying(true);
    } else {
      if (player) {
        player.mute();
      }
    }
  }, [currentAreaIndex]);

  const opts = {
    height: '100',
    width: '100',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className='h-[100svh] w-full relative '>
      <div className='bg-background h-[100svh] w-full bg-cover bg-center'>

        {geofenceAreas.map((area, index) => (
          <div key={index} className='absolute' style={{ top: area.top, left: area.left }}>
            {showCustomButton && currentAreaIndex === index && (
              <button
                className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
                onClick={() => playVideo(area.videoId)}
              >
                Play Video
              </button>
            )}
          </div>
        ))}

        {geofenceAreas.map((area) => (
          <YouTube
            key={area.videoId}
            videoId={area.videoId}
            onReady={onReady}
            opts={opts}
          />
        ))}

        {!experienceStarted && (
          <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
            <img src='/images/headphones.png' alt='' className='h-24 w-24' />
            <button
              className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'
              onClick={() => playVideo(geofenceAreas[0].videoId)}
            >
              START EXPERIENCE
            </button>
          </div>
        )}

        <div className='absolute bottom-0 w-full'>
          <Navbar />
        </div>

      </div>
    </div>
  );
};

export default CustomYouTubePlayer;
