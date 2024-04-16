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
    <div className='h-[100svh] w-full relative'>

      <div className='flex flex-col h-full overflow-scroll relative'>

        <div className='absolute top-0  flex justify-between w-full p-8'>
          <div>
            <img src="/images/ttd.png" alt="" className='w-auto h-8' />
          </div>
          <div className='flex gap-4 items-center'>
            <img src="/images/jakartaLogo.png" alt="" className='w-auto h-4' />
            <img src="/images/forteLogo.png" alt="" className='w-auto h-4' />
          </div>
        </div>

        <img src="/images/photo.png" alt="" className='h-[420px] bg-cover bg-center ' />
        <div className='bg-backgroundTall bg-cover max-h-max w-full p-8 '>

          <p className='text-justify font-medium'>
            {data.artist1}
            <br /><br />

            {data.artist2}
            <br /><br />
            {data.artist3}

          </p>

          <div className='flex flex-col my-10 gap-1'>
            <a href="https://tomyhrst.wixsite.com/tomyherseta/about" target='_blank' className='underline text-purple font-bold exo'>WEBSITE</a>
            <a href="https://www.instagram.com/tomyherseta/?hl=en"   target='_blank' className='underline text-purple font-bold exo'>INSTAGRAM</a>
            <a href="mailto:tomyhrst@gmail.com?subject=Hello!"       target='_blank' className='underline text-purple font-bold exo'>CONTACT</a>
            <p className='text-transparent'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p>
          </div>

        </div>
      </div>

      <div className='fixed bottom-0 w-full'>
        <Navbar />
      </div>

    </div>
  );
};

export default Page;
