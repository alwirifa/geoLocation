"use client"

import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [totalDistance, setTotalDistance] = useState<number>(0);

  useEffect(() => {
    // Meminta izin lokasi dari pengguna
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          // Memanggil fungsi untuk menghitung jarak
          calculateDistance(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fungsi untuk menghitung jarak menggunakan formula Haversine
  const calculateDistance = (lat2: number, lon2: number) => {
    const R = 6371000; // Radius bumi dalam meter

    const lat1 = 0; // Latitudine default (misalnya, lokasi awal)
    const lon1 = 0; // Longitudine default

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Jarak dalam meter

    // Contoh sederhana: menambahkan jarak setiap kali fungsi dipanggil
    setTotalDistance((prevDistance) => prevDistance + distance);

    // Memeriksa apakah notifikasi perlu ditampilkan
    if (totalDistance >= 6) {
      showNotification(totalDistance);
      setTotalDistance(0); // Reset jarak setelah notifikasi ditampilkan
    }
  };

  // Menampilkan notifikasi
  const showNotification = (distance: number) => {
    if (Notification.permission === 'granted') {
      new Notification('Info Pergerakan', {
        body: `Anda telah berjalan sejauh ${distance.toFixed(2)} meter.`,
      });
    }
  };

  return (
    <div>
      <h1>My Location App</h1>
      <p>Jarak yang telah ditempuh: {totalDistance.toFixed(2)} meter</p>
    </div>
  );
};

export default Home;
