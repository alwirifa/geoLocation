"use client"

import { useEffect, useState } from "react";
import axios from "axios";

interface Location {
  latitude?: number;
  longitude?: number;
  city?: string;
}

const Page: React.FC = () => {
  const [currLocation, setCurrLocation] = useState<Location>({});
  const [currLocationJs, setCurrLocationJs] = useState<Location>({});

  useEffect(() => {
    getLocation();
    getLocationJs();

    const intervalId = setInterval(() => {
      getLocation();
      getLocationJs();
    }, 4000); // Ambil lokasi setiap 5 detik

    return () => clearInterval(intervalId); // Membersihkan interval pada unmount
  }, []);

  const getLocation = async () => {
    try {
      const location = await axios.get("https://ipapi.co/json");
      setCurrLocation(location.data);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const getLocationJs = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        setCurrLocationJs({ latitude, longitude });
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 h-screen w-full justify-center items-center">
      <div>

        <h1>Current Location API</h1>
        <p>Latitude: {currLocation.latitude}</p>
        <p>Longitude: {currLocation.longitude}</p>
        <p>City: {currLocation.city}</p>
      </div>
      <div>

        <h1>Current Location JS</h1>
        <p>Latitude: {currLocationJs.latitude}</p>
        <p>Longitude: {currLocationJs.longitude}</p>
      </div>
    </div>
  );
};

export default Page;
