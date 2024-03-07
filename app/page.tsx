"use client"

// pages/index.tsx
import React, { useEffect, useState } from 'react';

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // radius of Earth in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // distance in meters
  return d;
};

const Home: React.FC = () => {
  const [distance, setDistance] = useState<number>(0);

  const resetDistance = () => {
    setDistance(0);
  };

  useEffect(() => {
    let watchId: number;

    const MAX_ALLOWED_TIME_DIFF = 30000; // 30 seconds
    const MAX_ALLOWED_DISTANCE = 10; // 10 meters

    const successCallback = (position: GeolocationPosition) => {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - position.timestamp;

      if (timeDifference < MAX_ALLOWED_TIME_DIFF) {
        const newYorkCoords = {
          latitude: 40.7128,
          longitude: -74.006,
        };

        const newDistance = calculateDistance(
          newYorkCoords.latitude,
          newYorkCoords.longitude,
          position.coords.latitude,
          position.coords.longitude
        );

        // Check if the new distance is reasonable
        if (newDistance < MAX_ALLOWED_DISTANCE) {
          setDistance((prevDistance) => prevDistance + newDistance);
        }
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error(error);
    };

    const options: PositionOptions = {
      enableHighAccuracy: false, // Adjust this based on your needs
      timeout: 5000,
      maximumAge: 0,
    };

    watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div>
      <h1>GPS Distance Tracker</h1>
      <p>Distance Traveled: {distance.toFixed(2)} meters</p>
      <button onClick={resetDistance}>Reset</button>
    </div>
  );
};

export default Home;
