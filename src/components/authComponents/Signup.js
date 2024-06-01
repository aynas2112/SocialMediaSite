import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContexts';
import { Link, Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!isSigningUp) {
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                return;
            }
            setIsSigningUp(true);
            try {
                const userCredential = await doCreateUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Store additional user information in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    firstname,
                    lastname,
                    username,
                    email,
                    profileImageUrl,
                    createdAt: new Date()
                });

                // Optionally, navigate to another page after signup

            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningUp(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1B1B1B] text-white">
            {userLoggedIn && <Navigate to="/home" replace />}
            <div className="w-full max-w-md p-8">
                <h1 className="logoHead text-center mb-8">UniGram</h1>
                <h2 className="text-center mb-8">Signup</h2>
                {errorMessage && <div className="error-message mb-4">{errorMessage}</div>}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="form-group">
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="Last Name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="Username"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            value={profileImageUrl}
                            onChange={(e) => setProfileImageUrl(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="Profile Image URL"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
                            placeholder="Confirm Password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSigningUp}
                        className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="links mt-4 text-center">
                    <Link to="/login" className="text-[#F1C40F]">Already have an account? Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
