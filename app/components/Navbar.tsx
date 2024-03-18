"use client"

import Link from 'next/link';
import React from 'react'
import { useGlobalContext } from '../context/store';
import { enData, idData } from '../data';

const routes = [
  {
    href: "/artwork",
    label: "artwork",
  },
  {
    href: "/artist",
    label: "artist",
  },
  {
    href: "/credits",
    label: "credits",
  },
];

const navbar = () => {
  const { language, toggleLanguage } = useGlobalContext();
  const data = language === 'en' ? enData : idData;


  return (
    <div>
      <div className='w-full bg-purple text-white'>
        <ul className='p-6 text-white text-sm font-semibold uppercase flex gap-8 justify-center'>
          {routes.map((item, index) => (
            <Link href={item.href} key={index}>{item.label}</Link>
          ))}
          <button onClick={toggleLanguage}>
            {language === 'en' ? 'IND/ENG' : 'IND/ENG'}
          </button>
        </ul>

      </div>
    </div>
  )
}

export default navbar