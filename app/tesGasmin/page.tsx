"use client"

import React, { useRef } from 'react';
import YouTube from 'react-youtube';

const CustomYouTubePlayer = () => {
  const playerRef = useRef<any>(null); // Menyimpan referensi ke player YouTube

  // Fungsi untuk memainkan video secara otomatis
  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.playVideo(); // Memanggil fungsi playVideo() dari objek player
    }
  };

  // Opsi untuk player YouTube
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // Atur ke 1 untuk autoplay
    },
  };

  return (
    <div>
      {/* Komponen YouTube */}
      <YouTube
        videoId="DOOrIxw5xOw" // ID video YouTube yang ingin diputar
        opts={opts} // Opsi player
        onReady={(event) => {
          playerRef.current = event.target; // Setelah player siap, simpan referensi ke player
        }}
      />
      {/* Tombol untuk memainkan video */}
      <button onClick={playVideo}>Play</button>
    </div>
  );
};

export default CustomYouTubePlayer;
