import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContexts';
import { Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Username from './SignUpComponents/Username';
import Email from './SignUpComponents/Email';
import FullName from './SignUpComponents/FullName';
import PhoneNumber from './SignUpComponents/PhoneNumber';
import ProfilePicture from './SignUpComponents/ProfilePicture';

const Signup = () => {
    const { userLoggedIn } = useAuth();
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState({});
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);

    const nextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const previousStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character');
            return;
        }

        setIsSigningUp(true);

        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                fullname,
                phoneNumber,
                profileImageUrl,
            });

            setIsSigningUp(false);
            <Navigate to="/" />;
        } catch (error) {
            setErrorMessage(error.message);
            setIsSigningUp(false);
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#121212]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#2C2C2C] border border-[#8E44AD] rounded">
                {step === 1 && <Username setUsername={setUsername} nextStep={nextStep} />}
                {step === 2 && <Email setEmail={setEmail} nextStep={nextStep} />}
                {step === 3 && <FullName setFullName={setFullname} nextStep={nextStep} />}
                {step === 4 && <PhoneNumber setPhoneNumber={setPhoneNumber} nextStep={nextStep} />}
                {step === 5 && <ProfilePicture setProfileImageUrl={setProfileImageUrl} nextStep={nextStep} />}

                {step === 6 && (
                    <div>
                        <h2 className="text-center mb-8 text-[#8E44AD]">Set your password</h2>
                        {errorMessage && <p className="error-message text-red-500 mb-4">{errorMessage}</p>}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom mb-4"
                        />
                        <button onClick={handleSignUp} className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded">
                            {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <button onClick={previousStep} className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded mt-2">
                            Previous
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
