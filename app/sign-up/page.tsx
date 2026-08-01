import React from 'react'
import Link from 'next/link'
import BankRegistrationForm from '../components/BankRegistrationForm'
import Carousel from '../components/Carousel'
import ChatWidgett from '@/app/components/ChatWidgett'



const page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))


  return (
    <div className="p-6 h-cover w-full flex bg-gradient-br from-blue-200 to-cyan-200
   items-center justify-around h-cover">
      <BankRegistrationForm />
      <Carousel />
      <ChatWidgett />
    </div>
  )
}

export default page
