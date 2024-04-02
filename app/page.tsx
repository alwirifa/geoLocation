"use client"

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import YouTube from "react-youtube";

import { enData, idData } from './data';
import { useGlobalContext } from './context/store';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
}

const Page = () => {
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("yNKvkPJl-tg"); // Set the default video ID here
  const { language } = useGlobalContext();
  const data = language === 'en' ? enData : idData;

  useEffect(() => {
    setExperienceStarted(false);
  }, []);

  return (
    <div className='h-screen w-full relative'>
      <div className='bg-background h-full w-full bg-cover bg-center'>

        <div className='absolute top-0 flex justify-between w-full p-8'>
          <div>
            <img src="/images/ttd.png" alt="" className='w-auto h-8' />
          </div>
          <div className='flex gap-4 items-center'>
            <img src="/images/jakartaLogo.png" alt="" className='w-auto h-4' />
            <img src="/images/forteLogo.png" alt="" className='w-auto h-4' />
          </div>
        </div>

        {!experienceStarted ? (
          <div className='flex flex-col items-center justify-center w-full pt-[16svh]'>

            <div className='flex flex-col justify-center items-center gap-1'>
              <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
              <p className='text-xs'>Tomy Herseta, 2024.</p>
            </div>

            <div className='flex flex-col gap-4 p-8 mt-6 '>
              <p className='text-justify font-medium'>
                {data.home1}
              </p>
              <p className='text-justify font-medium'>
                {data.home2}
              </p>
            </div>
          </div>
        ) : (

          <div className="flex flex-col gap-4 items-center  pt-[16svh]">

            <div className='flex flex-col justify-center items-center gap-1'>
              <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
              <p className='text-xs'>Tomy Herseta, 2024.</p>
            </div>
            <div className='relative'>
              <div className='bg-purple  flex justify-end items-center px-3 py-1 absolute top-0 w-full'>
                <img src="/images/close.png" className='h-[30px] w-[30px]' alt="" onClick={() => { setExperienceStarted(false) }} />
              </div>
              <img src="/images/map.png" alt="" className='h-auto w-[300px]' />
              <div className='bg-purple  flex justify-between items-center p-2 px-4 absolute bottom-0 w-full'>
                <p className="text-white font-semibold">OUT OF AREA</p>
                <div>
                  <img src="/images/audio.png" alt="" className='h-6 w-6' />
                </div>
              </div>
            </div>
          </div>

        )
        }

        {experienceStarted ? (

          <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
          </div>
        ) : (
          <div className='absolute w-full bottom-[14svh] flex flex-col gap-4 justify-center items-center'>
            <img src="/images/headphones.png" alt="" className='h-24 w-24' />
            <button className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max' onClick={() => setExperienceStarted(true)}>
              {data.button}
            </button>
          </div>
        )}

        <div className='absolute bottom-0 w-full'>
          <Navbar />
        </div>

      </div>
      <YouTube
        videoId={currentVideoId}
        opts={{ height: "100", width: "100", controls: 0, autoplay: 1 }}
      />
    </div>
  );
};

export default Page;
