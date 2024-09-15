import React from 'react';
import { FaRupeeSign } from "react-icons/fa";

function Balance({ Balance }) {
  // Ensure the Balance prop is a number and round it to two decimal places
  const formattedBalance = parseFloat(Balance).toFixed(2);

  return (
    <div className='font-extrabold text-lg sm:text-2xl py-6 px-8 flex items-center gap-2 text-green-500'>
      <div className='text-black'>Your Balance :</div>
      <FaRupeeSign className='text-green-500' /> {formattedBalance}
    </div>
  );
}

export default Balance;
