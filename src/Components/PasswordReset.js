import React, { useState } from 'react';
import axios from 'axios';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleResetPassword = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/resetPassword', {
                email,
                oldPassword,
                newPassword
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Password Reset</h2>
                <div>
                    <label htmlFor="email" className="block mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-400"
                    />

                    <label htmlFor="oldPassword" className="block mb-1">Old Password:</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="oldPassword"
                            placeholder="Enter your old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-400"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <label htmlFor="newPassword" className="block mb-1">New Password:</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:border-blue-400"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <button
                        onClick={handleResetPassword}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Reset Password
                    </button>
                    {message && <div className="text-red-500 mt-2">{message}</div>}
                </div>
            </div>
        </div>
    );
}
