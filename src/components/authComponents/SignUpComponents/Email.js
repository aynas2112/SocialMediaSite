import React, { useState } from 'react';
import { db } from '../../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Email = ({ setEmail, nextStep }) => {
    const [email, setEmailLocal] = useState('');
    const [error, setError] = useState('');

    const checkEmail = async () => {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setEmail(email);
            nextStep();
        } else {
            setError('Email is already in use');
        }
    };

    return (
        <div>
            <h2 className="text-center mb-8 text-[#8E44AD]">Enter your email</h2>
            {error && <p>{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => {
                    setEmailLocal(e.target.value);
                    setError(''); // Clear the error when user starts typing
                }}
                placeholder="Email"
                className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
            />
            <button onClick={checkEmail} className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded">Next</button>
        </div>
    );
};

export default Email;
