"use client"

import React, { useState } from "react";

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function Home() {
  const [location, setLocation] = useState<Position | null>(null);

  const successCallback = (position: Position) => {
    console.log(position);
    setLocation(position);
  };

  const errorCallback = (error: GeolocationPositionError) => {
    console.log(error);
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <button
        className="text-sm font-semibold px-4 py-2 rounded-md bg-zinc-950 text-white"
        onClick={handleGetLocation}
      >
        Get Your Location
      </button>

      {location && (
        <div>
          <p>Latitude: {location.coords.latitude}</p>
          <p>Longitude: {location.coords.longitude}</p>
        </div>
      )}
    </div>
  );
}
