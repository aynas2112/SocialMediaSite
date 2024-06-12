import React, { useState } from 'react';
import { db } from '../../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Username = ({ setUsername, nextStep }) => {
    const [username, setUsernameLocal] = useState('');
    const [error, setError] = useState('');

    const checkUsername = async () => {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setUsername(username);
            nextStep();
        } else {
            setError('Username is already taken');
        }
    };

    return (
        <div>
            <h2 className="text-center mb-8 text-[#8E44AD]">Enter your username</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                value={username}
                onChange={(e) => {
                    setUsernameLocal(e.target.value);
                    setError(''); // Clear the error when the user starts typing
                }}
                placeholder="Username"
                className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
            />
            <button onClick={checkUsername} className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded">Next</button>
        </div>
    );
};

export default Username;
