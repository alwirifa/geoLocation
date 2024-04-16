"use client"

import React from 'react';
import Navbar from '../components/Navbar';
import { enData, idData } from '../data';
import { useGlobalContext } from '../context/store';

type Props = {};

const credits = [
  {
    label: 'Technology & Production Support',
    text: 'iForte'
  },
  {
    label: 'Spatial Construction',
    text: 'ThisPlay'
  },
  {
    label: 'Multimedia Programming',
    text: 'Arthatronic Studio'
  },
  {
    label: 'Lighting Programming & Arthandling',
    text: 'Indra Fardiansyah'
  },
  {
    label: 'Prodution Assistant',
    text: 'Alexandra Ronodipuro'
  },
  {
    label: 'Prodution Support',
    text: 'Maulana Ahmad'
  },
];

const Page = (props: Props) => {
  const { language, toggleLanguage } = useGlobalContext();
  const data = language === 'en' ? enData : idData;
  return (
    <div className='h-[100svh] w-full relative'>
      <div className='flex flex-col h-full overflow-scroll relative'>

        <div className=' bg-center w-full  flex justify-between'>
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


        <div className='bg-backgroundTall bg-cover max-h-max w-full flex flex-col items-center   px-8 pt-8'>

          <img src="/images/artwork.png" alt="" className=' ' />

          <div className='flex flex-col gap-8 pb-8'>

            <p className='text-justify font-medium'>
              {data.artwork1}
            </p>

            <img src="/images/flow.png" alt="" className=' h-32 w-auto sm:w-64' />

            <p className='text-justify font-medium'>
              {data.artwork2}
            </p>

            <p className='text-purple font-bold text-justify exo'>
              THIS INSTALLATION IS FULLY SUPPORTED BY IFORTE FOR ART JAKARTA GARDEN 2024.
            </p>


            <div className='flex flex-col gap-4 mt-4'>
              <p className=' font-bold'>CREDITS</p>
              {credits.map((credit, index) => (
                <div key={index} className='grid gap-[2px]'>
                  <p className='text-sm font-medium'>{credit.label}</p>
                  <p className=' font-bold'>{credit.text}</p>
                </div>
              ))}
            </div>


            <p className='text-transparent'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. M</p>

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
