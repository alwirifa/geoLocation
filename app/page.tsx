"use client";

import React, { useState, useEffect } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
}

export default function TestGeolocation() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  interface GeofenceArea {
    latitude: number;
    longitude: number;
    radius: number;
  }

  const geofenceAreas: GeofenceArea[] = [
 
    {latitude: -6.925644862223442, longitude: 107.66499022775501, radius: 1},
    {latitude:-6.92567826074911, longitude:107.66500503111955, radius: 1}

  ];

  const getUserLocation = () => {
    console.log("getuserlocation");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });
          console.log("get position", latitude, longitude);
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
          geofenceAreas.forEach((area) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              alert(`You are in geofence area ${geofenceAreas.indexOf(area) + 1}`);
            }
          });

          console.log("Position update:", position);
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
    console.log("stop watch");
  };

  useEffect(() => {
    return () => {
      // Clear watch position when the component is unmounted
      stopWatchUserLocation();
    };
  }, []);

  // Function to calculate distance between two coordinates using Haversine formula
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

  // Function to convert degrees to radians
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
    </>
  );
}
