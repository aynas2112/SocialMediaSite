// ProfilePicture.js
import React, { useState } from 'react';

const ProfilePicture = ({ setProfileImageUrl, nextStep }) => {
    const [profileImageUrl, setProfileImageUrlLocal] = useState('');

    const handleNext = () => {
        setProfileImageUrl(profileImageUrl);
        nextStep();
    };

    return (
        <div>
            <h2>Upload your profile picture</h2>
            <input
                type="text"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrlLocal(e.target.value)}
                placeholder="Profile Image URL"
            />
            <button onClick={handleNext}>Next</button>
            <button onClick={nextStep}>Skip</button>
        </div>
    );
};

export default ProfilePicture;
