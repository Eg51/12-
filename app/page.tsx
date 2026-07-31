import React from 'react'
import AshTrustHero from '@/app/components/AshTrustHero'
import ChatWidgett from './components/ChatWidgett'


const page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return (
    <>
      <AshTrustHero />
      <ChatWidgett />
    </>
  )
}

export default page
