import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>

      <p className='text-4xl'>geomusic</p>
      <div className='grid grid-cols-2 gap-10'>

        <div className='flex flex-col gap-2 overflow-hidden bg-red-500'>
        <p>VIDEO1</p>
          <iframe height='400px' width='400px' src="https://www.youtube.com/embed/lP26UCnoH9s" title="Coffee Shop Radio ☕ - 24/7 lofi jazzy hip-hop beats" allowFullScreen></iframe>
        </div>
       
        <div className='flex flex-col gap-2 overflow-hidden bg-red-500'>
        <p>VIDEO2</p>
        <iframe height='400px' width='400px'  src="https://www.youtube.com/embed/NVXgPsK_eTw" title="Top 100 NoCopyRightSounds | Best of NCS | Most Viewed Songs | The Best of All Time | 2022 | 6H" allowFullScreen></iframe>
        </div>
       
        <div className='flex flex-col gap-2 overflow-hidden bg-red-500'>
        <p>VIDEO3</p>
        <iframe height='400px' width='400px' src="https://www.youtube.com/embed/XnUNOaxw6bs" title="Pop Rock Radio [ 24/7 LIVE ] Best of Pop Rock Songs! Best Rock Music Hits Mix"  allowFullScreen></iframe>
        </div>
       
        <div className='flex flex-col gap-2 overflow-hidden bg-red-500'>
        <p>VIDEO4</p>
        <iframe height='400px' width='400px' src="https://www.youtube.com/embed/Dx5qFachd3A" title="Relaxing Jazz Piano Radio - Slow Jazz Music - 24/7 Live Stream - Music For WorkStudy" ></iframe>
        </div>
       
      </div>
    </div>
  )
}

export default page