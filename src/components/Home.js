import React from 'react'
import { doSignOut } from '../firebase/auth'
import { useAuth } from '../contexts/authContexts'
import { Navigate } from 'react-router-dom'

const Home = () => {
  const { userLoggedIn } = useAuth();

  const handleSignOut=async()=>{
    try{
      await doSignOut();
    }catch(error){
      console.log('Error signing out',error);
    }
  }
  if (!userLoggedIn) return <Navigate to='/login' replace />;
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#1B1B1B] text-white'>
        <h1 className='logoHead'>UniGram</h1>
        <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default Home