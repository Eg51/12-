import Link from 'next/link'
import Image from 'next/images'
import { IoIosNotifications } from "react-icons/io";




const DashboardContent = () => {
  return (
    <div className='sticky m-0 w-full p-auto h-20
    item-center justify-evenly flex flex-col scrollbar-track-transparent  
    scrollbar-thin scrollbar-thumb-transparent overflow-y-auto'>
      <div className="md:hidden fixed items-center flex-row justify-between
        left-0 right-0 top-0 flex">
        <IoIosNotifications className=' font-bold text-[1.43em] text-cyan-900' />
        <div className="flex h-auto p-4 w-auto rounded-[100%] bg-cyan-900"></div>
      </div>
      {/* <div className="hidden md:flex"><p>New Transfer</p></div> */}

      <div className="p-0 gap-3 w-full md:absolute md:top-0
        item-center justify-evenly flex flex-col">
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
        <div className="flex h-47 p-10 m-1 w-auto rounded-2xl shadow-xl bg-gradient-br from-blue-200 to-cyan-200"></div>
      </div>



      <div className="flex">
        <div className=""></div>
      </div>

    </div>
  )
}

export default DashboardContent

