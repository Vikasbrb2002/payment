import React from 'react'
import { useNavigate } from 'react-router-dom';

function OtherUser({User}) {
   const navigate = useNavigate() ; 
    // Extracting individual properties from the User object
    const { lastname , firstname} = User;

    // Get the first letter of the user's first name
    const UserInitial = firstname.charAt(0).toUpperCase();
  
  return (
    <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <button className='bg-gray-300 rounded-full py-2 px-4 hover:bg-black hover:text-white'>{UserInitial}</button>
          <div className='text-black font-bold text-sm sm:text-xl'>{firstname} {lastname}</div>
        </div>
        <div>
          <button onClick={

            (e)=>{
              navigate("/send?id="+User._id+"&name="+User.firstname) ; 
            }
          } className='bg-black hover:bg-green-600 text-white w-full py-2 sm:py-4 px-4 sm:px-8 mt-2 border-black rounded-lg   text-sm sm:text-md font-bold'>Send Money</button>
        </div>
      </div>
  )
}

export default OtherUser  