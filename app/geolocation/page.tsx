"use client"

import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

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

const TestGeolocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    getUserLocation(); // Memanggil untuk mendapatkan lokasi pengguna saat komponen dimuat
  }, []);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925365384155353, longitude: 107.66494545222442, radius: 15, videoId: "DOOrIxw5xOw" },
    { latitude: -6.9167522, longitude: 107.6614443, radius: 4, videoId: "36YnV9STBqc" },
    { latitude: -6.9165868, longitude: 107.6613089, radius: 4, videoId: "lP26UCnoH9s" },
    { latitude: -6.9164866, longitude: 107.6614578, radius: 4, videoId: "bk8WKwHDUNk" },
  ];

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });
          checkGeofence(latitude, longitude);
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
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude, accuracy: 0, speed: 0 });
          checkGeofence(latitude, longitude);
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

  const checkGeofence = (latitude: number, longitude: number) => {
    geofenceAreas.forEach((area) => {
      const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
      if (distance <= area.radius && currentVideoId !== area.videoId) {
        setCurrentVideoId(area.videoId);
        if (player) {
          if (!isPlaying) {
            player.playVideo();
            setIsPlaying(true);
            console.log(isPlaying)
          }
        }
      }
    });
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

  return (
    <>
      <h1>Geolocation App</h1>
      <div className="w-full flex justify-center items-center gap-4">
        <button className="border border-slate-300 text-sm font-semibold px-4 py-2 rounded-md" onClick={getUserLocation}>Get User Location</button>
        <button className="border border-slate-300 text-sm font-semibold px-4 py-2 rounded-md" onClick={watchUserLocation}>Start Watching User Location</button>
        <button className="border border-slate-300 text-sm font-semibold px-4 py-2 rounded-md" onClick={stopWatchUserLocation}>Stop Watching User Location</button>
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

      <h2>Current Video</h2>
      <div className="grid grid-cols-4 gap-2">
        {geofenceAreas.map((area) => (
          <YouTube
            key={area.videoId}
            videoId={area.videoId}
            onReady={onReady}
            opts={{ height: "400", width: "400", controls: 0, autoplay: 0 }} // Autoplaying the video if inside geofence and video playing
            />
          ))}
        </div>
      </>
    );
  };
  
  export default TestGeolocation;
  
