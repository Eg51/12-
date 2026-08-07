import { div } from 'framer-motion/client'
import React from 'react'
import Set from '@/app/components/Set'
import Iconpack from '@/app/components/Iconpack';
import ChatWidgett from '../components/ChatWidgett';
import DesktopNav from '@/app/components/DesktopNav';

const page = () => {
  return (   
    <>
      <DesktopNav/>
      <Set/>
      <ChatWidgett/>
      <Iconpack/>
    </>
  )
}

export default page
