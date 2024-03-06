"use client"

import { useState, useEffect } from 'react';

const GeofenceApp: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Membuat fungsi untuk meminta lokasi pengguna
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

    // Meminta lokasi pengguna setiap 5 detik
    const locationInterval = setInterval(requestLocation, 5000);

    return () => clearInterval(locationInterval); // Membersihkan interval saat komponen tidak lagi digunakan
  }, []); // useEffect hanya dijalankan pada mounting komponen

  useEffect(() => {
    // Cek apakah user berada dalam geofence
    if (
      userLocation &&
      isInsideGeofence(userLocation.latitude, userLocation.longitude)
    ) {
      // Jika dalam geofence, tampilkan notifikasi
      showNotification('You are inside the geofence!');
    }
  }, [userLocation]); // useEffect akan dijalankan setiap kali userLocation berubah

  // Fungsi untuk menentukan apakah lokasi berada dalam geofence
  const isInsideGeofence = (latitude: number, longitude: number) => {
    const geofenceLatitude = -6.925526250146626;
    const geofenceLongitude = 107.66500627780277;
    const radius = 10; // 10 meter radius

    // Menghitung jarak antara dua titik koordinat menggunakan rumus Haversine
    const distance = haversine(latitude, longitude, geofenceLatitude, geofenceLongitude);

    // Mengecek apakah jarak kurang dari radius geofence
    return distance <= radius;
  };

  // Fungsi untuk menampilkan notifikasi
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

  // Fungsi Haversine untuk menghitung jarak antara dua titik koordinat
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
