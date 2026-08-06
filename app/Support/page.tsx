import React from 'react'
import Link from 'next/link'
import ChatWidgett from '@/app/components/ChatWidgett'
import DashboardHero from '@/app/components/DashboardHero'
import Iconpack from '../components/Iconpack'
import DashboardContent from '../components/DashboardContent'

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="h-20 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-32 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
        <div className="h-32 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
        <div className="h-32 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
        <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
        <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
        <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
      </div>
    </div>
  </div>
);
const page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))


  return (
    <section className="flex flex-col not-last-of-type:p-9
        min-h-screen bg-cover w-auto overflow-y-hidden md:m-0 md:p-0
        bg-linear-to-br from-blue-200 via-cyan-100 to-gray-300 p-auto">


      <div className="flex p-auto">
        <div className="flex sticky bg-transparent overflow-x-hidden">
          <DashboardHero />
        </div>
        <div className="flex  left-0 top-0 right-0 w-screen flex-col
           scrollbar-track-transparent scrollbar-thin scrollbar-thumb-cyan-900
            overflow-y-scroll overflow-x-hidden h-auto p-auto md:p-4 m-0">
          <DashboardContent />
        </div>
      </div>

      <ChatWidgett />
      <div className="flex bg-cyan-200/6 place-items-baseline justify-baseline"><Iconpack /></div>
    </section>
  )
}

export default page
// 