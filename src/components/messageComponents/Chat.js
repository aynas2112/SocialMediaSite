import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
// import {useDispatch} from "react-redux";
import { getChats } from '../../actions/chats';

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // const dispatch = useDispatch();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        console.log("Current user:", user);
        setCurrentUser(user);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        const contactsCollection = collection(db, 'contacts');
        const contactsSnapshot = await getDocs(contactsCollection);
        const contactsList = contactsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(contact => contact.email !== currentUser.email); // Filter out current user
        console.log("Fetched contacts:", contactsList);
        setContacts(contactsList);
      }
    };

    fetchContacts();
  }, [currentUser]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'w-full'} h-screen`}>
      {/* Left Sidebar */}
      <div className={`flex flex-col h-full border-r border-gray-300 overflow-hidden ${isMobile ? 'w-full' : 'w-1/4'}`}>
        <div className='flex items-center p-4'>
          <div className='ml-4'>
            <h3 className='text-xl'>UserName</h3>
          </div>
        </div>
        <hr className='border-gray-300' />
        <div className='p-4'>
          <input
            type='text'
            className='w-full p-2 bg-gray-100 border border-gray-300 rounded-lg'
            placeholder='Search...'
          />
        </div>
        <hr className='border-gray-300' />
        <div className='flex-grow overflow-y-auto'>
          <h4 className='text-lg p-4'>Messages</h4>
          <ul>
            {contacts.map(contact => (
              <li
                key={contact.id}
                className='flex items-center p-4 hover:bg-gray-200 cursor-pointer'
                onClick={() => setSelectedChat(contact)}
              >
                <div>
                  <h5 className='text-black text-md'>{contact.name}</h5>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Main Chat Area */}
      {!isMobile && selectedChat && (
        <div className='flex-grow h-full flex flex-col'>
          <div className='flex justify-between items-center p-4 border-b border-gray-300'>
            <h2 className='text-xl'>{selectedChat.name}</h2>
          </div>
          <div className='flex-grow overflow-y-auto p-4'>
            {/* Chat messages will go here */}
          </div>
          <div className='p-4 border-t border-gray-300'>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded-lg'
              placeholder='Type a message...'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
