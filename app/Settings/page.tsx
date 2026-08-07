import { div } from 'framer-motion/client'
import React from 'react'
import Set from '@/app/components/Set'
import Iconpack from '@/app/components/Iconpack';
import ChatWidgett from '../components/ChatWidgett';

const page = () => {
  return (   
    <>
      <Set/>
      <ChatWidgett/>
      <Iconpack/>
    </>
  )
}

export default page
