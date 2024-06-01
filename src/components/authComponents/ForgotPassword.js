import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doPasswordReset } from '../../firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsResetting(true);
        try {
            await doPasswordReset(email);
            setResetSuccess(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
        setIsResetting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1B1B1B] text-white">
            <div className="w-full max-w-md p-8">
                <h1 className="logoHead text-center mb-8 text-[#8E44AD]">UniGram</h1>
                {resetSuccess ? (
                    <div className="success-message text-green-500 mb-4">Password reset email sent successfully!</div>
                ) : (
                    <>
                        <h2 className="text-center mb-4">Forgot Password</h2>
                        {errorMessage && <div className="error-message text-red-500 mb-4">{errorMessage}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <button
                                type="submit"
                                disabled={isResetting}
                                className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded"
                            >
                                Reset Password
                            </button>
                        </form>
                    </>
                )}
                <div className="links mt-4 text-center">
                    <Link to="/login" className="text-[#F1C40F]">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
