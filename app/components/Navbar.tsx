"use client";

import Link from 'next/link';
import React from 'react';
import { useGlobalContext } from '../context/store';

const routes = [
  {
    href: "/artwork",
    label: "artwork",
  },
  {
    href: "/artist",
    label: "artist",
  },

];

const Navbar = () => {
  const { language, toggleLanguage } = useGlobalContext();

  return (
    <div>
      <div className='w-full bg-purple text-white'>
        <ul className='py-6 px-10 text-white text-sm font-semibold uppercase flex gap-4 justify-between exo'>
          {routes.map((item, index) => (
            <Link href={item.href} key={index}>{item.label}</Link>
          ))}
          <button onClick={toggleLanguage}>
            {language === 'en' ? 'EN/ID' : 'EN/ID'}
          </button>
          <Link href={'/'}>EXPERIENCE</Link>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
