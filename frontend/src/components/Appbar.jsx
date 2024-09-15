import React from 'react';
import { GiWallet } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";
import { BsFire } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Profile from '../pages/Profile';

function Appbar({ user }) {
  const displayUser = user || 'User';
  const navigate = useNavigate() ; 

  return (
    <div className='flex py-4 px-8 justify-between shadow items-center'>
      <div className='text-black font-extrabold text-xl sm:text-3xl flex items-center gap-2'>
      <BsFire />
        <div>FirePay</div>
        </div>
      <div className='flex gap-2 sm:gap-4 items-center'>
        <div className='text-black text-lg sm:text-xl font-bold'>Hello, {displayUser}</div>
        <button className='bg-gray-300 rounded-full py-2 px-4 hover:bg-black hover:text-white'>{displayUser[0]?.toUpperCase()}</button>
      </div>
    </div>
  );
}

export default Appbar;
