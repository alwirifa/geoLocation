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



  const geofenceAreas: GeofenceArea[] = [
    { latitude: -6.925497850456106, longitude: 107.66499037922092, radius: 7, videoId: "DOOrIxw5xOw" },
    { latitude: -6.925383356966224, longitude: 107.66488711417902, radius: 7, videoId: "36YnV9STBqc" },
    { latitude: -6.9165868, longitude: 107.6613089, radius: 4, videoId: "lP26UCnoH9s" },
    { latitude: -6.9164866, longitude: 107.6614578, radius: 4, videoId: "bk8WKwHDUNk" },
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

          let isInsideAnyGeofence = false;

          geofenceAreas.forEach((area) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              // Jika pengguna berada dalam geofence area, set isInsideAnyGeofence menjadi true
              isInsideAnyGeofence = true;
              // Jika pengguna berada dalam geofence area yang berbeda dengan video yang sedang diputar, ubah video yang diputar
              if (currentVideoId !== area.videoId) {
                setCurrentVideoId(area.videoId);
              }
            }
          });

          // Jika pengguna berada di dalam setidaknya satu geofence area, tampilkan toggle play
          if (isInsideAnyGeofence) {
            setIsPlaying(true); // Jika diinginkan, Anda bisa menambahkan logika lain di sini untuk menentukan apakah video harus diputar otomatis saat masuk ke dalam geofence area
          } else {
            setIsPlaying(false); // Sembunyikan toggle play jika pengguna tidak berada di dalam geofence area
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
  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(prevState => !prevState);
    }
  };

  useEffect(() => {
    // Lakukan inisialisasi pemutaran video saat komponen pertama kali dimuat
    if (player && currentVideoId) {
      player.loadVideoById(currentVideoId);
      if (isPlaying) {
        player.playVideo();
      }
    }
  }, [player, currentVideoId, isPlaying]);

  const onReady = (event: any) => {
    setPlayer(event.target);
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
      <div className="grid grid-cols-4 gap-4">
        {geofenceAreas.map((area) => (
          <YouTube
            key={area.videoId}
            videoId={area.videoId}
            onReady={onReady}
            opts={{ height: "400", width: "400", controls: 0, autoplay: 0 }}
          />
        ))}
      </div>

      {isPlaying && (
        <div className='absolute bottom-[18svh] flex flex-col gap-4 justify-center items-center'>
          <img src="/images/headphones.png" alt="" className='h-24 w-24' />
          <button onClick={togglePlay} className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'>Listen The music</button>
        </div>
      )}
    </>
  );

}

export default TestGeolocation;
