"use client"

import React, { useState, useEffect } from "react";

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
}

const geofenceAreas: GeofenceArea[] = [
  { latitude: -6.925536627901488, longitude: 107.66501751536497, radius: 15 },
  { latitude: -6.9167522, longitude: 107.6614443, radius: 4 },
  { latitude: -6.9165868, longitude: 107.6613089, radius: 4 },
  { latitude: -6.9164866, longitude: 107.6614578, radius: 4 },
];

export default function TestGeolocation() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });
        },
        (error) => {
          console.error("Error getting user location: ", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };

  const watchUserLocation = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });

          // Check if user is within any geofence area
          geofenceAreas.forEach((area, index) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              if (currentVideo !== index) {
                setCurrentVideo(index);
              }
            } else {
              if (currentVideo === index) {
                setCurrentVideo(null);
              }
            }
          });
        },
        (error) => {
          console.error("Error watching user location: ", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      setWatchId(id);
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };

  const stopWatchUserLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    getUserLocation();
    watchUserLocation();
    return () => {
      stopWatchUserLocation();
    };
  }, []);

  useEffect(() => {
    if (currentVideo !== null) {
      playVideo();
    }
  }, [currentVideo]);

  const playVideo = () => {
    const videoElement = document.getElementById(`video-${currentVideo}`);
    if (videoElement) {
      (videoElement as HTMLVideoElement).play();
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance * 1000; // Convert to meters
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const handleGetUserLocation = () => {
    getUserLocation();
  };

  const handleStartWatchUserLocation = () => {
    watchUserLocation();
  };

  const handleStopWatchUserLocation = () => {
    stopWatchUserLocation();
  };

  return (
    <>
      <h1>Geolocation App</h1>
      <div className="w-full flex justify-center items-center gap-4">
        <button className="border border-slate-300 text-sm font-semibold px-4 py-2 rounded-md" onClick={handleGetUserLocation}>Get User Location</button>
        <button className="border border-slate-300 text-sm font-semibold px-4 py-2 rounded-md" onClick={handleStartWatchUserLocation}>Start Watching User Location</button>
        <button className="border border-slate-300 text-sm font-semibold px-4 py-2 rounded-md" onClick={handleStopWatchUserLocation}>Stop Watching User Location</button>
      </div>
      {userLocation && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
          <p>Accuracy: {userLocation.accuracy} meters</p>
          <p>Speed: {userLocation.speed} meters/second</p>
        </div>
      )}
      {/* Video Players */}
      <div className="flex justify-center items-center mt-64">
        <div className='grid grid-cols-2 gap-10'>
          {geofenceAreas.map((area, index) => (
            <div key={index} className='flex flex-col gap-2 overflow-hidden bg-red-500'>
              <p>VIDEO {index + 1}</p>
              <video id={`video-${index}`} height='400px' width='400px' src={getVideoSource(index)} title={`Video ${index + 1}`} autoPlay loop controls />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const getVideoSource = (index: number): string => {
  const videoSources = [
    "https://www.youtube.com/embed/lP26UCnoH9s",
    "https://www.youtube.com/embed/NVXgPsK_eTw",
    "https://www.youtube.com/embed/XnUNOaxw6bs",
    "https://www.youtube.com/embed/Dx5qFachd3A",
  ];
  return videoSources[index];
};
