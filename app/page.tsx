"use client"

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
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

const Page = () => {
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);

  const geofenceAreas: GeofenceArea[] = [

    // { latitude: -6.925368719382597, longitude: 107.6648914323083, radius: 6, videoId: "lP26UCnoH9s" },
    // { latitude: -6.925635929284283, longitude: 107.66496699177638, radius: 6, videoId: "DOOrIxw5xOw" },
    // { latitude: -6.925464304205161, longitude: 107.6645636305663, radius: 6, videoId: "bk8WKwHDUNk" },
    // { latitude: -6.925770034941376, longitude: 107.66466558186403, radius: 6, videoId: "36YnV9STBqc" },


    // // gasmin
    { latitude: -6.9167175, longitude: 107.661395, radius: 4, videoId: "DOOrIxw5xOw" },

    { latitude: -6.9165822, longitude: 107.6615319, radius: 4, videoId: "6fF9zjaCDFBwm9_I" },

    { latitude: -6.9167204, longitude: 107.6616406, radius: 4, videoId: "36YnV9STBqc" },

    { latitude: -6.9167987, longitude: 107.6614773, radius: 4, videoId: "lP26UCnoH9s" },
  ]



  const watchUserLocation = () => {

    setExperienceStarted(true);

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });

          let isInsideAnyGeofence = false;
          let areaIndex: number || null = null;

          geofenceAreas.forEach((area, index) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              isInsideAnyGeofence = true;
              areaIndex = index;
              if (currentVideoId !== area.videoId) {
                setCurrentVideoId(area.videoId);
              }
            }
          });

          if (isInsideAnyGeofence) {
            setIsPlaying(true);
            setCurrentAreaIndex(areaIndex);
          } else {
            setIsPlaying(false);
            setCurrentAreaIndex(null);
          }
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

    setExperienceStarted(false)
  };

  useEffect(() => {
    return () => {
      stopWatchUserLocation();
    };
  }, []);


  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  useEffect(() => {
    if (player && currentVideoId) {
      player.loadVideoById(currentVideoId);
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [player, currentVideoId, isPlaying]);



  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;  // in km
    return distance * 1000; // Convert to meters
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className='h-[100svh] w-full relative '>
      <div className='bg-background h-[100svh] w-full bg-cover bg-center'>

        <div className='absolute top-0 flex justify-between w-full p-8'>
          <div>
            <img src="/images/ttd.png" alt="" className='w-auto h-8' />
          </div>
          <div className='flex gap-4 items-center'>
            <img src="/images/jakartaLogo.png" alt="" className='w-auto h-4' />
            <img src="/images/forteLogo.png" alt="" className='w-auto h-4' />
          </div>
        </div>

        {!experienceStarted ? (
          <div className={`flex flex-col items-center justify-center w-full pt-[16svh]`}>

            <div className='flex flex-col justify-center items-center gap-1'>
              <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
              <p className='text-sm'>Tomy Herseta, 2024.</p>
            </div>

            <p className='text-justify p-8 mt-6 font-medium'>
              Instalasi ini merupakan sebuah pengalaman mendengar yang membutuhkan partisipasi aktif dari pengunjung. <br /><br />

              Silakan gunakan earphone Anda untuk pengalaman yang lebih optimal.
            </p>
          </div>
        ) : (

          <div className="flex flex-col gap-4 items-center  pt-[16svh]">
            <div className="relative h-[250px] w-[250px] border-2 border-black">
              <div className='absolute top-0 left-0 p-4 border-2 border-green-500 flex justify-center items-center'>
                <p>Area 1</p>
                <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 0 ? 'visible' : 'hidden'}`} />
              </div>
              <div className='absolute top-0 right-0 p-4 border-2 border-green-500 flex justify-center items-center'>
                <p>Area 2</p>
                <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 1 ? 'visible' : 'hidden'}`} />
              </div>
              <div className='absolute bottom-0 left-0 p-4 border-2 border-green-500 flex justify-center items-center'>
                <p>Area 4</p>
                <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 2 ? 'visible' : 'hidden'}`} />
              </div>
              <div className='absolute bottom-0 right-0 p-4 border-2 border-green-500 flex justify-center items-center'>
                <p>Area 3</p>
                <div className={`bg-red-500 h-4 w-4 rounded-full animate-ping absolute ${currentAreaIndex === 3? 'visible' : 'hidden'}`} />
              </div>
            </div>

            {currentAreaIndex !== null ? (
              <p className="mt-4 font-semibold">You are currently inside geofence area {currentAreaIndex + 1}</p>
            ) : (
              <p className="mt-4 font-semibold">You are not inside any geofence area</p>
            )}

            <div className='hidden'>
              {userLocation && (
                <div>
                  <p>Latitude: {userLocation.latitude}</p>
                  <p>Longitude: {userLocation.longitude}</p>
                  <p>Accuracy: {userLocation.accuracy} meters</p>
                  <p>Speed: {userLocation.speed} meters/second</p>
                </div>
              )}

            </div>
            <div className="hidden">
              {geofenceAreas.map((area) => (
                <YouTube
                  key={area.videoId}
                  videoId={area.videoId}
                  onReady={onReady}
                  opts={{ height: "100", width: "100", controls: 0, autoplay: 0 }}
                />
              ))}
            </div>
          </div>

        )
        }

        {experienceStarted ? (

          <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
            <img src="/images/headphones.png" alt="" className='h-24 w-24' />

            <button className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max' onClick={stopWatchUserLocation}>
              BERHENTI MENDENGARKAN
            </button>
          </div>
        ) : (
          <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
            <img src="/images/headphones.png" alt="" className='h-24 w-24' />

            <button className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max' onClick={watchUserLocation}>
              MULAI PENGALAMAN
            </button>
          </div>
        )}

        <div className='absolute bottom-0 w-full'>
          <Navbar />
        </div>

      </div>
    </div>
  );
};

export default Page;