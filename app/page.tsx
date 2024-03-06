"use client"

import { useEffect, useState } from 'react';

const GeofenceApp: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting location:', error.message);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const locationInterval = setInterval(requestLocation, 5000);

    return () => clearInterval(locationInterval);
  }, []); // useEffect hanya dijalankan pada mounting komponen

  useEffect(() => {
    if (userLocation && isInsideGeofence(userLocation.latitude, userLocation.longitude)) {
      showNotification('You are inside the geofence!');
    }
  }, [userLocation]);

  const isInsideGeofence = (latitude: number, longitude: number) => {
    const geofenceLatitude = -6.925526250146626;
    const geofenceLongitude = 107.66500627780277;
    const radius = 10; // 10 meter radius

    const distance = haversine(latitude, longitude, geofenceLatitude, geofenceLongitude);

    return distance <= radius;
  };

  const showNotification = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    }
  };

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (angle: number) => (angle * Math.PI) / 180;

    const R = 6371; // Radius bumi dalam kilometer
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c * 1000; // Mengonversi ke meter
    return distance;
  };

  return (
    <div>
      <p>Your Location:</p>
      {userLocation && (
        <div>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default GeofenceApp;
