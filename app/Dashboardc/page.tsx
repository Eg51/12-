import React from 'react'
import Link from 'next/link'
import ChatWidgett from '@/app/components/ChatWidgett'
import DashboardHero from '@/app/components/DashboardHero'
import Iconpack from '../components/Iconpack'
import DashboardContent from '../components/DashboardContent'


const page = async () => { 
  await new Promise((resolve) => setTimeout(resolve, 2000))


  return (
    <section className="flex flex-col not-last-of-type:p-9 min-h-screen bg-cover w-full overflow-y-hidden
        bg-linear-to-br from-blue-200 via-cyan-100 to-gray-300">


        <div className="flex p-6">
          <div className="flex sticky bg-transparent overflow-x-hidden">
            <DashboardHero/>
          </div> 
          <div className="flex flex-col scrollbar-track-transparent 
            scrollbar-thin scrollbar-thumb-cyan-900 overflow-y-scroll
             overflow-x-hidden h-auto w-full m-0">
            <DashboardContent/>
          </div>
        </div>

      <ChatWidgett/>
      <div className="flex place-items-baseline justify-baseline"><Iconpack/></div> 
    </section>
  )
}

export default page
// 