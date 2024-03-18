"use client"

import React from 'react';
import Navbar from '../components/Navbar';
import { enData, idData } from '../data';
import { useGlobalContext } from '../context/store';

type Props = {};



const Page = (props: Props) => {
  const { language, toggleLanguage } = useGlobalContext();
  const data = language === 'en' ? enData : idData;
  return (
    <div className='h-[100svh] w-full relative overflow-scroll'>


      <div className='flex flex-col'>

        <div className='h-[400px] bg-cover bg-photo bg-center w-full  flex justify-between'>
          <div className='absolute top-0 flex justify-between w-full p-8'>
            <div>
              <img src="/images/ttd.png" alt="" className='w-auto h-8' />
            </div>
            <div className='flex gap-4 items-center'>
              <img src="/images/jakartaLogo.png" alt="" className='w-auto h-4' />
              <img src="/images/forteLogo.png" alt="" className='w-auto h-4' />
            </div>
          </div>

        </div>
        <div className='bg-background bg-cover h-full w-full p-8 '>

          <p className='text-justify'>
            {data.artist1}
            <br /><br />

            {data.artist2}
            <br /><br />
            {data.artist3}

          </p>

          <div className='flex flex-col my-10 gap-1'>
            <a href="#" className='underline text-purple font-bold'>WEBSITE</a>
            <a href="#" className='underline text-purple font-bold'>INSTAGRAM</a>
            <a href="#" className='underline text-purple font-bold'>CONTACT</a>

          </div>
        </div>


        <Navbar />

      </div>
    </div>
  );
};

export default Page;
