import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, getCurrentUser } from '../../firebase/firebase';

const ContactsList = ({ setSelectedChat, handleBackToHome }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser) {
        try {
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.email !== currentUser.email);
          setUsers(usersList);
          setFilteredUsers(usersList.slice(0, 5)); // Set top 5 users by default
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = users.filter(user =>
      user.firstname.toLowerCase().includes(searchTerm) || 
      user.lastname.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered.slice(0, 5)); // Show top 5 filtered users
  };

  return (
    <div className='flex flex-col w-full h-screen'>
      <div className='flex items-center p-4'>
        <button
          className='p-2 rounded-lg mr-2'
          onClick={handleBackToHome}
        >
          <i className="ti ti-chevron-left text-gray-300 text-2xl"></i>
        </button>
        <div className='ml-2 flex-grow'>
          <h3 className='smallLogoHead'>Unigram</h3>
        </div>
        <button className='ml-auto p-2'>
          <i className="ti ti-users-group text-gray-300 text-2xl"></i>
        </button>
      </div>
      <div className='p-4'>
        <input
          type='text'
          className='w-full p-2 bg-[#1B1B1B] border border-gray-300 rounded-lg text-white mt-4'
          placeholder='Search...'
          onChange={handleSearch}
        />
      </div>
      <div className='flex-grow overflow-y-auto'>
        <h4 className='text-lg p-4 text-white'>Messages</h4>
        <ul>
          {filteredUsers.map(user => (
            <li
              key={user.id}
              className='flex items-center p-4 cursor-pointer hover:bg-gray-700 hover:bg-opacity-50'
              onClick={() => setSelectedChat(user)}
            >
              <div>
                <h5 className='text-md text-white'>{user.firstname}</h5>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactsList;