import React, { useEffect, useState } from 'react'
import OtherUser from './OtherUser'
import axios from 'axios';

function UserSection() {

  const [ users , setUsers ] = useState([]) ; 
  const [filter , setFilter] = useState("") ; 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/user/bulk?filter="+filter);
        setUsers(response.data.user);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchData();
  }, [filter]); 

  return (
    <div className='py-6 px-8'>
      <div className='text-black font-extrabold text-2xl'>Users</div>
      <input onChange={e=>{
        setFilter(e.target.value)
      }} className='w-full border-gray-200 border-2 rounded-lg p-2 my-4' type="text" placeholder='Search Users..'/>
      <div className='flex flex-col'>
    {users.map(user=><OtherUser key={user._id} User={user}/>)}
      
      </div>
    </div>
  )
}

export default UserSection