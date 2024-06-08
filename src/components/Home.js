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
    <div className='flex items-center justify-center min-h-screen bg-[#1B1B1B] text-white'>
      <div className='absolute top-0 right-0 m-4'>
        <Link to='/messages'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded'>Message</button>
        </Link>
        <Link to='/uploads'>
          <button className='bg-[#8E44AD] text-[#F1C40F] p-2 rounded'>Post</button>
        </Link>
        <button onClick={handleSignOut} className='ml-4 bg-[#8E44AD] text-[#F1C40F] p-2 rounded'>Sign Out</button>
      </div>
      <h1 className='logoHead'>UniGram</h1>
    </div>
  );
};

export default Home;
