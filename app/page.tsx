"use client"

// Import necessary React modules
import React, { useEffect, useState } from 'react';

// Define the functional component
const Page: React.FC = () => {
  // Define state variables to store user location data
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 0,
    longitude: 0,
  });

  // Define a function to get the user's location
  const getUserLocation = () => {
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

  // useEffect to run the getUserLocation initially and set up the interval
  useEffect(() => {
    getUserLocation(); // Get user location initially

    const intervalId = setInterval(() => {
      getUserLocation(); // Get user location every 3 seconds
    }, 3000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Return the JSX structure
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <div className='flex flex-col gap-4'>
        <p>Your Location:</p>
        <p>Latitude: <span className='font-semibold'>{userLocation.latitude}</span></p>
        <p>Longitude: <span className='font-semibold'>{userLocation.longitude}</span></p>
      </div>

      {/* Button is not needed anymore, as we are updating location automatically */}
    </div>
  );
};

// Export the component as the default export
export default Page;
