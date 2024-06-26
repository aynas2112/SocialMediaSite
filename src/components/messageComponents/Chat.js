import React, { useEffect, useState, useRef } from 'react';
import { db, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ResizableBox } from 'react-resizable';
import Modal from 'react-modal';
import io from 'socket.io-client';
import 'react-resizable/css/styles.css';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

Modal.setAppElement('#root'); // Set the root element for accessibility

const socket = io('http://localhost:4000'); // Replace with your server's URL

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        socket.emit('join', { email: user.email, firstname: user.displayName || 'User' });
      }
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // useEffect(() => {
  //   socket.on('receiveMessage', (message) => {
  //     console.log('Received message:', message);
  //     const chatId = message.chatId;
  //     if (message.sender !== currentUser.email) {
  //       setMessages((prevMessages) => ({
  //         ...prevMessages,
  //         [chatId]: [...(prevMessages[chatId] || []), message]
  //       }));
  //     }
  //   });
        

  //   return () => {
  //     socket.off('receiveMessage');
  //   };
  // }, []);
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log('Received message:', message);
      const chatId = message.chatId;
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), message]
      }));
    };
  
    socket.on('receiveMessage', handleReceiveMessage);
  
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [currentUser]);
  

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (selectedChat) {
  //       socket.emit('joinChat', selectedChat.id); // Join the chat room
  //       try {
  //         const messagesCollection = collection(db, 'messages');
  //         const q = query(
  //           messagesCollection,
  //           where('chatId', '==', selectedChat.id),
  //           orderBy('timestamp', 'asc')
  //         );
  //         const messagesSnapshot = await getDocs(q);
  //         const messagesList = messagesSnapshot.docs.map(doc => doc.data());
  //         setMessages(prevMessages => ({
  //           ...prevMessages,
  //           [selectedChat.id]: [...(prevMessages[selectedChat.id] || []), messagesList]
  //         }));          
  //       } catch (error) {
  //         console.error("Error fetching messages:", error);
  //       }
  //     }
  //   };

  //   fetchMessages();
  // }, [selectedChat]);
  useEffect(() => {
    if (selectedChat) {
      socket.emit('joinChat', selectedChat.id); // Join the chat room
      const fetchMessages = async () => {
        try {
          const messagesCollection = collection(db, 'messages');
          const q = query(
            messagesCollection,
            where('chatId', '==', selectedChat.id),
            orderBy('timestamp', 'asc')
          );
          const messagesSnapshot = await getDocs(q);
          const messagesList = messagesSnapshot.docs.map(doc => doc.data());
          setMessages(prevMessages => ({
            ...prevMessages,
            [selectedChat.id]: messagesList
          }));
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
  
      fetchMessages();
    }
  }, [selectedChat]);
  

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const messagesCollection = collection(db, 'messages');
        const messagesSnapshot = await getDocs(messagesCollection);
        const allMessages = {};

        messagesSnapshot.forEach(doc => {
          const message = doc.data();
          const chatId = message.chatId;

          if (!allMessages[chatId]) {
            allMessages[chatId] = [];
          }

          allMessages[chatId].push(message);
        });

        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchAllMessages();
  }, []);

  const handleBackToContacts = () => {
    setSelectedChat(null);
  };

  const handleBackToHome = () => {
    navigate('/'); // Navigate to the home route
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = users.filter(user =>
      user.firstname.toLowerCase().includes(searchTerm) || 
      user.lastname.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered.slice(0, 5)); // Show top 5 filtered users
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration <= 120) {
          setSelectedMedia(file);
        } else {
          alert("Please select a video up to 2 minutes long.");
        }
      };
      video.src = URL.createObjectURL(file);
    } else {
      alert("Please select an image or a video.");
    }
  };
  

  const sendMessage = async () => {
    console.log('Sending message...');
    if (selectedChat && (newMessage.trim() || selectedMedia)) {
      let mediaUrl = '';
  
      if (selectedMedia) {
        // Upload media file if selected
        const storageRef = ref(storage, `media/${selectedMedia.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedMedia);
  
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Error uploading file:', error);
          },
          async () => {
            // Media upload completed, get download URL
            mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
            await sendMessageToFirestore(mediaUrl);
            console.log('Media uploaded and message sent.');
          }
        );
      } else {
        // No media file selected, send message without media
        await sendMessageToFirestore(mediaUrl);
        console.log('Message sent.');
      }
  
      if (newMessage.trim()) { // Check if the message is not empty
        // Append the sent message to the sender's chat window immediately
        const sentMessage = {
          chatId: selectedChat.id,
          sender: currentUser.email,
          receiver: selectedChat.email,
          text: newMessage,
          mediaUrl: mediaUrl,
          timestamp: new Date().toISOString()
        };
  
        setMessages(prevMessages => {
          const updatedMessages = {
            ...prevMessages,
            [selectedChat.id]: [...(prevMessages[selectedChat.id] || []), sentMessage]
          };
          return updatedMessages;
        });
      }
      
      setNewMessage('');
      setSelectedMedia(null);
    } else {
      console.log('No chat selected or message content empty.');
    }
  };
  
  
  
  

  // When sending a message
const sendMessageToFirestore = async (mediaUrl) => {
  const message = {
    chatId: selectedChat.id,
    sender: currentUser.email, // Set sender to current user's email
    receiver: selectedChat.email, // Set receiver to selected chat's email
    text: newMessage,
    mediaUrl: mediaUrl,
    timestamp: new Date().toISOString()
  };

  socket.emit('sendMessage', message);
  setNewMessage('');
  setSelectedMedia(null);

  try {
    await addDoc(collection(db, 'messages'), message);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

// When receiving a message
useEffect(() => {
  socket.on('receiveMessage', (message) => {
    console.log('Received message:', message);
    const chatId = message.chatId;
    if (message.sender !== currentUser.email) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), message]
      }));
    }
  });

  return () => {
    socket.off('receiveMessage');
  };
}, [currentUser]);

  

  const renderContactsList = () => (
    <div className={`flex flex-col ${isMobile ? 'w-full h-full' : 'w-full h-screen'}`}>
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

  const renderChatBox = () => (
    <div className='flex-grow h-full flex flex-col text-white'>
      {isMobile && (
        <button
          className='bg-blue-500 text-white p-2 rounded-lg m-2'
          onClick={handleBackToContacts}
        >
          Back to Contacts
        </button>
      )}
      <div className='flex justify-between items-center p-4 border-b border-gray-300'>
        <h2 className='text-xl text-white'>{selectedChat?.firstname}</h2>
        <div className='flex items-center'>
          <button className='ml-4 p-2'>
            <i className="ti ti-phone text-gray-300 text-2xl"></i>
          </button>
          <button className='ml-4 p-2'>
            <i className="ti ti-video text-gray-300 text-2xl"></i>
          </button>
        </div>
      </div>
      <div className='flex-grow overflow-y-auto p-4'>
        {messages[selectedChat.id] && messages[selectedChat.id].map((msg, index) => (
          <div key={index}>
            <div className={`relative flex mb-2 ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.sender === currentUser.email ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
                {msg.text}
                {msg.mediaUrl && (
                  msg.mediaUrl.includes('video') ? (
                    <video controls className='mt-2'>
                      <source src={msg.mediaUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={msg.mediaUrl} alt="media" className='mt-2' />
                  )
                )}
              </div>
            </div>
            <div className={`text-xs text-gray-400 ${msg.sender === currentUser.email ? 'text-right' : 'text-left'}`}>
              {formatMessageTime(msg.timestamp)}
            </div>
          </div>
        ))}
      </div>
      <div className='p-4 border-t border-gray-300 flex items-center'>
        <input
          type='text'
          className='flex-grow p-2 bg-[#1B1B1B] border border-gray-300 rounded-lg text-white'
          placeholder='Type a message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button className='ml-2 p-2' onClick={() => fileInputRef.current.click()}>
          <i className="ti ti-paperclip text-gray-300 text-2xl"></i>
        </button>
        <button className='ml-2 p-2 rotate-arrow' > 
        {/* onClick={sendMessage} */}
          <i className="ti ti-send text-gray-300 text-2xl"></i>
        </button>
      </div>
    </div>
  );  
  
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return ''; // Handle empty timestamp
  
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  

  const renderSendMessageButton = () => (
    <div className='flex items-center justify-center h-full'>
      <button
        className='bg-blue-500 text-white p-4 rounded-lg'
        onClick={openModal}
      >
        Send Message
      </button>
    </div>
  );

  const renderModal = () => (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Send Message"
      className="bg-[#1B1B1B] p-4 rounded-lg max-w-3xl mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl text-white'>Send Message</h2>
        <button
          className='text-white text-2xl'
          onClick={closeModal}
        >
          &times;
        </button>
      </div>
      <input
        type='text'
        className='w-full p-2 bg-[#2B2B2B] border border-gray-300 rounded-lg text-white mb-4'
        placeholder='Search...'
        onChange={handleSearch}
      />
      <ul>
        {filteredUsers.map(user => (
          <li
            key={user.id}
            className='flex items-center p-4 cursor-pointer hover:bg-gray-700 hover:bg-opacity-50'
            onClick={() => {
              setSelectedChat(user);
              closeModal();
            }}
          >
            <div>
              <h5 className='text-md text-white'>{user.firstname}</h5>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );

  return (
    <div className='h-screen bg-black'>
      {isMobile ? (
        selectedChat ? renderChatBox() : renderContactsList()
      ) : (
        <div className='flex h-full'>
          <ResizableBox
            width={300}
            height={Infinity}
            minConstraints={[200, Infinity]}
            maxConstraints={[500, Infinity]}
            axis="x"
            className='flex flex-col h-full border-r border-gray-300 resize-x overflow-hidden'
            resizeHandles={['e']}
            handleClasses={{ right: 'custom-handle' }}
          >
            {renderContactsList()}
          </ResizableBox>
          <div className="flex-grow flex items-center justify-center">
            {selectedChat ? renderChatBox() : renderSendMessageButton()}
          </div>
        </div>
      )}
      {renderModal()}
    </div>
  );
};

export default Chat;

// the issue is message instead of being visible to the receiver is visible to sender twice 
// this might be due to receiver and sender saath m likha hua h in event pipeline can u separate them both so that the message delivered to receiver is visible to receiver only and not to sender twice
