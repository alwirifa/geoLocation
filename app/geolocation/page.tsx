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
  const [mapPosition, setMapPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const geofenceAreas: GeofenceArea[] = [
    //  artha
    { latitude: -6.925646303061493, longitude: 107.66497786550748, radius: 4, videoId: "DOOrIxw5xOw" },
    { latitude: -6.925384033131933, longitude: 107.66488734095772, radius: 4, videoId: "36YnV9STBqc" },

    // gasmin
    // { latitude: -6.9166349, longitude: 107.6615918, radius: 4, videoId: "DOOrIxw5xOw" },
    // { latitude: -6.9167522, longitude: 107.6614443, radius: 4, videoId: "36YnV9STBqc" },
    { latitude: -6.9165868, longitude: 107.6613089, radius: 4, videoId: "lP26UCnoH9s" },
    { latitude: -6.9164866, longitude: 107.6614578, radius: 4, videoId: "bk8WKwHDUNk" },
    
    // error
    // { latitude: -6.9158979, longitude: 107.6785185, radius: 4, videoId: "qoZXtRddtek" },
  ];

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });
          updateMapPosition(latitude, longitude);
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
          updateMapPosition(latitude, longitude);

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

  useEffect(() => {
    if (userLocation) {
      updateMapPosition(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  useEffect(() => {
    if (player && currentVideoId) {
      player.loadVideoById(currentVideoId);
      if (isPlaying) {
        player.playVideo();
      }
    }
  }, [player, currentVideoId, isPlaying]);

  const updateMapPosition = (latitude: number, longitude: number) => {
    // Calculate relative position of map based on user's location
    const top = (latitude - geofenceAreas[0].latitude) * 100; // Assuming 1 latitude degree equals 100 pixels
    const left = (longitude - geofenceAreas[0].longitude) * 100; // Assuming 1 longitude degree equals 100 pixels
    setMapPosition({ top, left });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
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
        {userLocation && (
          <div
            className="bg-red-500 h-4 w-4 rounded-full absolute"
            style={{
              top: `${mapPosition.top}px`,
              left: `${mapPosition.left}px`,
            }}
          ></div>
        )}
      </div>
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
            opts={{ height: "300", width: "300", controls: 0, autoplay: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default TestGeolocation;

