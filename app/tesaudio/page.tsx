"use client"

import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
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




  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925391401199705, longitude: 107.66489758575915, radius: 10, videoId: "XnUNOaxw6bs" },
    { latitude: -6.925487185695368, longitude: 107.66453954172253, radius: 10, videoId: "36YnV9STBqc" },
    // { latitude: -6.925579012135751, longitude: 107.66500683304874, radius: 8, videoId: "bk8WKwHDUNk" },
    { latitude: -6.5168766, longitude: 107.7614897, radius: 8, videoId: 'yNKvkPJl-tg' }
  ];

  const watchUserLocation = () => {

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
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
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

      <div className='absolute bottom-10 left-0 flex flex-col gap-4'>
        {userLocation && (
          <div>
            <p>Latitude: {userLocation.latitude}</p>
            <p>Longitude: {userLocation.longitude}</p>
            <p>Accuracy: {userLocation.accuracy} meters</p>
          </div>
        )}
        {currentAreaIndex !== null ? (
          <p className="font-semibold">AUDIO {currentAreaIndex + 1}</p>
        ) : (
          <p className="font-semibold">OUT OF AREA</p>
        )}
       
       
       
       
        {showPlayButton  ? (
          <div>
            <button className='p-4 border font-semibold' onClick={playVideo}>
              Play Video 
            </button>
          </div>
        ) : (
          <button className='hidden' onClick={playVideo}>
            ieu eweuh
          </button>
        )}

        <div className='p-8' onClick={watchUserLocation}>
          Watch User Location
        </div>
      </div>

    </div>
  );
};

export default CustomYouTubePlayer;