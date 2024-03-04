"use client"

import React, { useState, useEffect } from "react";

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const Home: React.FC = () => {
  const [location, setLocation] = useState<Position | null>(null);

  const successCallback = (position: Position) => {
    console.log(position);
    setLocation(position);
  };

  const errorCallback = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    const locationWatcher = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback
    );

    return () => {
      navigator.geolocation.clearWatch(locationWatcher);
    };
  }, []); 

  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center">
      <button
        className="text-sm font-semibold px-4 py-2 rounded-md bg-zinc-950 text-white"
        onClick={() => navigator.geolocation.getCurrentPosition(successCallback, errorCallback)}
      >
        Get Your Location
      </button>

      {location && (
        <div>
          <p>Latitude: {location.coords.latitude}, {location.coords.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
