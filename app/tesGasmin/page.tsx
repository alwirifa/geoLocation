"use client"

import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';

const CustomYouTubePlayer = () => {
  const [player, setPlayer] = useState<any>(null); // State untuk menyimpan referensi ke player YouTube

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  // Fungsi untuk memainkan video secara otomatis
 // Fungsi untuk memainkan video secara otomatis
const playVideo = () => {
  if (player) {
    player.playVideo(); // Memanggil fungsi playVideo() dari objek player
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
        onReady={onReady}
      />
      {/* Tombol untuk memainkan video */}
      <button onClick={playVideo}>Play</button>
    </div>
  );
};

export default CustomYouTubePlayer;
