"use client"

import React, { useState, useEffect } from "react";

export default function TestGeolocation() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number | null;
  } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const getUserLocation = () => {
    console.log("getuserlocation")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });
          console.log("get position", latitude, longitude)
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
          console.log("Position update:", position);
        },
        (error) => {
          console.error("Error watching user location: ", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0, // Force a new location update
          timeout: 5000, // 5 seconds timeout
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
    console.log("stop watch")
  };

  useEffect(() => {
    return () => {
      // Clear watch position when the component is unmounted
      stopWatchUserLocation();
    };
  }, []);

  return (
    <>
      <h1>Geolocation App</h1>
      <button onClick={getUserLocation}>Get User Location</button>
      <button onClick={watchUserLocation}>Start Watching User Location</button>
      <button onClick={stopWatchUserLocation}>Stop Watching User Location</button>
      {userLocation && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
          <p>Accuracy: {userLocation.accuracy} meters</p>
          <p>Speed: {userLocation.speed} meters/second</p>
        </div>
      )}
    </>
  );
}
