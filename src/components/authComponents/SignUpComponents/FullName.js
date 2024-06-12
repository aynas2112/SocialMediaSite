// FullName.js
import React, { useState } from 'react';

const FullName = ({ setFullName, nextStep }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const handleNext = () => {
        setFullName({ firstname, lastname });
        nextStep();
    };

    return (
        <div>
            <h2 className="text-center mb-8 text-[#8E44AD]">Enter your full name</h2>
            <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
                className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
            />
            <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name"
                className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
            />
            <button onClick={handleNext} className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded">Next</button>
        </div>
    );
};

export default FullName;
