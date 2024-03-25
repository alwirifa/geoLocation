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
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [fixedUserX, setFixedUserX] = useState<number | null>(null);
  const [fixedUserY, setFixedUserY] = useState<number | null>(null);

  const geofenceAreas: GeofenceArea[] = [
    //  artha
   

{ latitude: -6.9166349, longitude: 107.6615918, radius: 4, videoId: "DOOrIxw5xOw" },
  { latitude: -6.9167522, longitude: 107.6614443, radius: 4, videoId: "36YnV9STBqc" },
  { latitude: -6.9165868, longitude: 107.6613089, radius: 4, videoId: "lP26UCnoH9s" },
  { latitude: -6.9164866, longitude: 107.6614578, radius: 4, videoId: "bk8WKwHDUNk" },
  ];

  // gasmin
  // { latitude: -6.9166349, longitude: 107.6615918, radius: 4, videoId: "DOOrIxw5xOw" },
  // { latitude: -6.9167522, longitude: 107.6614443, radius: 4, videoId: "36YnV9STBqc" },
  // { latitude: -6.9165868, longitude: 107.6613089, radius: 4, videoId: "lP26UCnoH9s" },
  // { latitude: -6.9164866, longitude: 107.6614578, radius: 4, videoId: "bk8WKwHDUNk" },

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });

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
          userTracker(latitude, longitude);

          let isInsideAnyGeofence = false;
          let areaIndex: number | null = null;

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

  useEffect(() => {
    // Panggil fungsi userTracker ketika mendapatkan lokasi pengguna
    if (userLocation) {
      userTracker(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);


  const userTracker = (latitude: number, longtitude: number) => {

    const x1 = 0;
    const y1 = 0;
    const x2 = 100;
    const y2 = 100;


    const fixedUserX = (((x2 - x1) * (longtitude - geofenceAreas[0].longitude)) / (geofenceAreas[3].longitude - geofenceAreas[0].longitude)) + x1;
    const fixedUserY = (((y2 - y1) * (latitude - geofenceAreas[0].latitude)) / (geofenceAreas[3].latitude - geofenceAreas[0].latitude)) + y1;

    setFixedUserX(fixedUserX);
    setFixedUserY(fixedUserY);

  }

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
    <div className="h-screen w-full flex flex-col gap-8 items-center p-24">
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

      <div className="relative h-96 w-96 border">
        {/* {userLocation && fixedUserX !== null && fixedUserY !== null && fixedUserX >= 0 && fixedUserX <= 100 && fixedUserY >= 0 && fixedUserY <= 100 && (
          <div
            className="bg-red-500 h-4 w-4 rounded-full absolute animate-ping"
            style={{
              top: `${fixedUserX}%`,
              left: `${fixedUserY}%`,
            }}
          ></div>
        )} */}

        {/* && fixedUserX !== null && fixedUserY !== null && fixedUserX >= 0 && fixedUserX <= 100 && fixedUserY >= 0 && fixedUserY <= 100  */}

        {userLocation && (
          <div
            className="bg-red-500 h-4 w-4 rounded-full absolute animate-ping"
            style={{
              top: `${fixedUserX}%`,
              left: `${fixedUserY}%`,
            }}
          ></div>
        )}
      </div>


      <p>User Location (Fixed): {fixedUserX}, {fixedUserY}</p>
      {currentAreaIndex !== null ? (
        <p className="mt-4">You are currently inside geofence area {currentAreaIndex}</p>
      ) : (
        <p className="mt-4">You are not inside any geofence area</p>
      )}
      <div className="flex">
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
  );
};

export default TestGeolocation;

