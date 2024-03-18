import Link from 'next/link';
import React from 'react';
import Navbar from '../components/Navbar';

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
    label: 'Documentation',
    text: 'Alexandra Ronodipuro'
  }
];


const Page = (props: Props) => {
  return (
    <div className='h-[100svh] w-full relative '>
      <div className='bg-background h-[100svh] w-full bg-cover bg-center'>


        <div className='absolute top-0 flex justify-between w-full p-8'>
          <div>
            <img src="/images/ttd.png" alt="" className='w-auto h-8' />
          </div>
          <div className='flex gap-4 items-center'>
            <img src="/images/jakartaLogo.png" alt="" className='w-auto h-4' />
            <img src="/images/forteLogo.png" alt="" className='w-auto h-4' />
          </div>
        </div>

        <div className='flex flex-col  p-8 w-full pt-[16svh]'>
          <p className='text-lg font-bold'>CREDITS</p>

          <div className='flex flex-col gap-4 mt-8'>
            {credits.map((credit, index) => (
              <div key={index} className='grid gap-[2px]'>
                <p className='text-sm font-medium'>{credit.label}</p>
                <p className=' font-bold'>{credit.text}</p>
              </div>
            ))}
          </div>

        </div>


        <div className='absolute bottom-0 w-full'>
          <div className='flex flex-col gap-4'>

          <p className='px-8 text-sm'>TOMY HERSETA  © 2024</p>
          <Navbar />
        </div>
          </div>

      </div>
    </div>
  );
};

export default Page;
