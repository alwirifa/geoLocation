"use client"

import React, { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface PositionInfo {
  position: Location | null;
  altitude: number | null;
  speed: number | null;
  accuracy: number | null;
  heading: number | null;
  timestamp: number | null;
}

const GeoLocationExample: React.FC = () => {
  const [positionInfo, setPositionInfo] = useState<PositionInfo>({
    position: null,
    altitude: null,
    speed: null,
    accuracy: null,
    heading: null,
    timestamp: null,
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isPositionChanging, setIsPositionChanging] = useState<boolean>(false);

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPositionInfo({
            position: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error('Error getting current position:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const watchPosition = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setIsPositionChanging(true);
          setPositionInfo({
            position: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            timestamp: position.timestamp,
          });

          console.log(
            `Position updated: Latitude ${position.coords.latitude}, Longitude ${position.coords.longitude}`
          );
          
        },
        (error) => {
          console.error('Error watching position:', error.message);
        }
      );
      setWatchId(id);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const stopWatchingPosition = () => {
    if (navigator.geolocation && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsPositionChanging(false);
    }
  };

  useEffect(() => {
    return () => {
      stopWatchingPosition();
    };
  }, [stopWatchingPosition]);

  return (
    <div>
      <h2>Geolocation Example</h2>
      <p>
        Information
        <br />
        Your position is {positionInfo.position ? `${positionInfo.position.latitude}° latitude, ${positionInfo.position.longitude}° longitude (with an accuracy of ${positionInfo.accuracy} meters)` : 'unavailable'}
        <br />
        Your altitude is {positionInfo.altitude !== null ? `${positionInfo.altitude} meters (with an accuracy of ${positionInfo.accuracy} meters)` : 'unavailable'}
        <br />
        You're {positionInfo.heading !== null ? `${positionInfo.heading}° from the True north` : 'unavailable'}
        <br />
        You're moving at a speed of {positionInfo.speed !== null ? `${positionInfo.speed} meters/second` : 'unavailable'}
        <br />
        Data updated at {positionInfo.timestamp !== null ? new Date(positionInfo.timestamp).toLocaleTimeString() : 'unavailable'}
      </p>

      <div className='flex gap-4'>
        <button
          className={`border px-4 py-2 font-semibold text-sm ${
            isPositionChanging ? 'bg-green-500 text-white animate-pulse' : 'bg-sky-500 text-white'
          }`}
          onClick={getCurrentPosition}
        >
          Get current position
        </button>
        <button
          className={`border px-4 py-2 font-semibold text-sm ${
            isPositionChanging ? 'bg-green-500 text-white animate-pulse' : 'bg-sky-500 text-white'
          }`}
          onClick={watchPosition}
        >
          Watch position
        </button>
        <button
          className={`border px-4 py-2 font-semibold text-sm ${
            isPositionChanging ? 'bg-green-500 text-white animate-pulse' : 'bg-sky-500 text-white'
          }`}
          onClick={stopWatchingPosition}
        >
          Stop watching position
        </button>
      </div>
    </div>
  );
};

export default GeoLocationExample;
