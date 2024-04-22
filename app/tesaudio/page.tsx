"use client"
import React, { useEffect, useState } from 'react';
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
    { latitude: -6.2220146, longitude: 106.8068591, radius: 40, videoId: "b4g_5vkdVm4" },
    { latitude: -6.2222365, longitude: 106.8071025, radius: 40, videoId: "XKueVSGTk2o" },
    { latitude: -6.22178, longitude: 106.8067372, radius: 40, videoId: "YDfiTGGPYCk" },
    { latitude: -6.2217714, longitude: 106.8064705, radius: 40, videoId: "gCNeDWCI0vo" },
    { latitude: -6.2219972, longitude: 106.8061736, radius: 40, videoId: "jfKfPfyJRdk" },
    { latitude: -6.2222127, longitude: 106.8061864, radius: 40, videoId: "DOOrIxw5xOw" },
  ];

  const watchUserLocation = () => {
    setExperienceStarted(true);

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setUserLocation({ latitude, longitude, accuracy, speed });

          let isInsideAnyGeofence = false;
          let areaIndex = null;
          let videoToPlay = "yNKvkPJl-tg"; // Default video to play if not in any geofence area

          geofenceAreas.forEach((area, index) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance <= area.radius) {
              isInsideAnyGeofence = true;
              areaIndex = index;
              videoToPlay = area.videoId; // Set the video to play if inside a geofence area
            }
          });

          setIsPlaying(true); // Assume video should play by default

          if (currentVideoId !== videoToPlay) {
            setCurrentVideoId(videoToPlay); // Set the video to play if it's different from the current one
          }

          setCurrentAreaIndex(isInsideAnyGeofence ? areaIndex : null); // Set the current area index

          // Pause the specified video if it's currently playing and not in any geofence area
          if (!isInsideAnyGeofence && currentVideoId === "yNKvkPJl-tg") {
            setIsPlaying(false);
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

  const opts = {
    height: '100',
    width: '100',
    playerVars: {
      autoplay: 0,
      playsinline: 1
    },
  };

    return (
      <div className='h-[100svh] w-full relative '>
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
  
  
            <div className='absolute top-0  '>
              {geofenceAreas.map((area, index) => (
                <YouTube
                  key={index}
                  videoId={area.videoId}
                  onReady={onReady}
                  opts={opts}
                />
              ))}
            </div>
  
         
  
            {experienceStarted ? (
              <div className="flex flex-col gap-4 items-center  pt-[16svh] z-20">
  
                <div className='flex flex-col justify-center items-center gap-1'>
                  <p className='text-lg text-purple font-bold exo'>HERE, NOWHERE HEAR</p>
                  <p className='text-xs'>Tomy Herseta, 2024.</p>
                </div>
                <div className='relative'>
                  <div className='bg-purple  flex justify-end items-center px-3 py-1 absolute top-0 w-full'>
                    <img src="/images/close.png" className='h-[30px] w-[30px]' alt="" onClick={stopWatchUserLocation} />
                  </div>
  
                  <img src="/images/map.png" alt="" className='h-auto w-[300px]' />
                  <div className='bg-purple  flex justify-between items-center p-2 px-4 absolute bottom-0 w-full'>
                    {currentAreaIndex !== null ? (
                      <p className="text-white font-bold exo">AUDIO {currentAreaIndex + 1}</p>
                    ) : (
                      <p className="text-white font-bold exo">OUT OF AREA</p>
                    )}
  
                    <div>
                      <img src="/images/audio.png" alt="" className='h-6 w-6' />
                    </div>
                  </div>
                </div>
              </div>
  
            ) : (
              <div>
  
                <div className={`flex flex-col items-center justify-center w-full pt-[16svh]`}>
  
                  <div className='flex flex-col justify-center items-center gap-1'>
                    <p className='text-lg text-purple font-bold exo'>HERE, NOWHERE HEAR</p>
                    <p className='text-xs'>Tomy Herseta, 2024.</p>
                  </div>
  
                  <div className='flex flex-col gap-4 px-10 mt-4 '>
                    <p className='text-justify font-medium text-sm'>
                    b
                    </p>
                    <p className='text-justify font-medium text-sm'>
                    a
                    </p>
                  </div>
                </div>
                <div className='absolute w-full bottom-[12svh] flex flex-col gap-4 justify-center items-center'>
                  <p className='uppercase text-base text-purple font-bold exo text-center px-16'>yes</p>
                  <img src='/images/headphones.png' alt='' className='h-20 w-20' />
                  <button
                    className='border-2 border-purple text-purple font-bold text-lg px-6 py-2 rounded-full max-w-max exo'
                    onClick={watchUserLocation}
                  ><p className='exo'>
  
                      START EXPERIENCE
                    </p>
                  </button>
                </div>
              </div>
            )}
  
          </div>
        </div>
      
  
      </div>
    );
  };
  
  export default Page;