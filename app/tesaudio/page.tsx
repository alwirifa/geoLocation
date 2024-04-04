"use client"

import React, { useEffect, useRef, useState } from 'react';
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
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const playerRef = useRef<any>(null);

  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925572458911993, longitude: 107.66502260462097, radius: 15, videoId: "DOOrIxw5xOw" },
    { latitude: -6.9167608, longitude: 107.6616099, radius: 8, videoId: "XnUNOaxw6bs" },
    { latitude: -6.9167322, longitude: 107.6613635, radius: 8, videoId: "36YnV9STBqc" },
    { latitude: -6.9168766, longitude: 107.6614897, radius: 8, videoId: "bk8WKwHDUNk" },
    { latitude: -6.5168766, longitude: 107.7614897, radius: 8, videoId: 'yNKvkPJl-tg' }
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
  
          setCurrentAreaIndex(isInsideAnyGeofence ? areaIndex : null);
          setIsPlaying(isInsideAnyGeofence);
          setShowPlayButton(!isInsideAnyGeofence); // Ubah kondisi di sini
  
          if (player && isInsideAnyGeofence) {
            player.playVideo();
          } else if (player) {
            player.pauseVideo();
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

  const GPS = () => {
    watchUserLocation();
  };

  const playVideo = () => {
    setIsPlaying(true);
    player.playVideo();
  };

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


        <div className='absolute bottom-0 w-full'>
          <button onClick={GPS}>GPS</button>
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded" onClick={playVideo}>Play Video</button>
      
          <p className="text-white font-semibold">AUDIO {currentAreaIndex}</p>
          <img src="/images/close.png" className='h-[30px] w-[30px]' alt="" onClick={stopWatchUserLocation} />
        </div>

      </div>
    </div>
  );
};

export default CustomYouTubePlayer;
