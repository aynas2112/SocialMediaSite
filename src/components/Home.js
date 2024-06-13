import React from 'react';
import { doSignOut } from '../firebase/auth';
import { useAuth } from '../contexts/authContexts';
import { Navigate, Link } from 'react-router-dom';

const Home = () => {
  const { userLoggedIn } = useAuth();

  const handleSignOut = async () => {
    try {
      await doSignOut();
    } catch (error) {
      console.log('Error signing out', error);
    }
  };

  if (!userLoggedIn) return <Navigate to='/login' replace />;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#1B1B1B] text-white'>
      <h1 className='logoHead mb-4'>UniGram</h1>
      <div className='flex flex-wrap'>
        <Link to='/messages'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded mr-2'>Message</button>
        </Link>
        <Link to='/uploads'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded mr-2'>Post</button>
        </Link>
        <Link to='/profile'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded mr-2'>Profile</button>
        </Link>
        <Link to='/feed'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded mr-2'>Feed</button>
        </Link>
        <Link to='/create-post'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded'>Create Post</button>
        </Link>
        <button onClick={handleSignOut} className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded ml-2'>Sign Out</button>
      </div>
    </div>
  );
};

export default Home;