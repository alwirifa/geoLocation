"use client"

import React, { useState, useEffect } from 'react';

type Props = {};

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
}

const Page = (props: Props) => {
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();

    // You can set up a timer to continuously update the location if needed
    // For example, update every 5 minutes:
    // const intervalId = setInterval(getLocation, 5 * 60 * 1000);

    // Clean up the interval when the component is unmounted
    // return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures the effect runs once after the initial render

  return (
    <div>
      <h1>User Location</h1>
      {userLocation.latitude !== null && userLocation.longitude !== null ? (
        <p>
          Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
        </p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default Page;
