import Link from 'next/link';
import React from 'react';
import Navbar from './components/Navbar';

type Props = {};

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

        <div className='flex flex-col items-center justify-center w-full pt-[16svh]'>

          <div className='flex flex-col justify-center items-center gap-1'>
            <p className='text-lg text-purple font-semibold'>HERE, NOWHERE HEAR</p>
            <p className='text-sm'>Tomy Herseta, 2024.</p>
          </div>

          <p className='text-justify p-8 mt-6 font-medium'>
            Instalasi ini merupakan sebuah pengalaman mendengar yang membutuhkan partisipasi aktif dari pengunjung. <br /><br />

            Silakan gunakan earphone Anda untuk pengalaman yang lebih optimal.
          </p>

          <div className='absolute bottom-[18svh] flex flex-col gap-4 justify-center items-center'>
            <img src="/images/headphones.png" alt="" className='h-24 w-24' />
            <Link href={'/geolocation'} className='border border-purple text-purple font-semibold px-6 py-2 rounded-full max-w-max'>MULAI PENGALAMAN</Link>

          </div>

        </div>


        <div className='absolute bottom-0 w-full'>
          <Navbar />
        </div>

      </div>
    </div>
  );
};

export default Page;
