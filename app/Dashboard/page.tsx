import React from 'react'
import Dash from "@/app/components/Dash"
import DesktopNav from '@/app/components/DesktopNav';
import Iconpack from "../components/Iconpack";
import ChatWidgett from '@/app/components/ChatWidgett';

const page = () => {
  return (
    <>
      <DesktopNav/>
      <Dash/>
      <ChatWidgett />
      <Iconpack />
    </>
  )
}

export default page
