"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode;
}

const Layout = ({children} : Props) => {
  const router = useRouter()
  const [isloading, setIsLoading] = useState(true)

  useEffect(() => {

    if ( isloading ) {
   
      router.push('/');
      setTimeout(() => {
        
        setIsLoading(false)
      }, 100)
    } 

  }, []);
  
  if (isloading) {
    return (
      <div>Loading..</div>
    )
  }

  return (
    <div>{children}</div>
  )
}

export default Layout