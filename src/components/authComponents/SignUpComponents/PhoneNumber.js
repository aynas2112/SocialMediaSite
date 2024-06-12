// PhoneNumber.js
import React, { useState } from 'react';

const PhoneNumber = ({ setPhoneNumber, nextStep }) => {
    const [phoneNumber, setPhoneNumberLocal] = useState('');

    const handleNext = () => {
        setPhoneNumber(phoneNumber);
        nextStep();
    };

    return (
        <div>
            <h2 className="text-center mb-8 text-[#8E44AD]">Enter your phone number</h2>
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumberLocal(e.target.value)}
                placeholder="Phone Number"
                className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
            />
            <button onClick={handleNext} className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded">Next</button>
        </div>
    );
};

export default PhoneNumber;
