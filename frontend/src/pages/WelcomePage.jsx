import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners"

const WelcomePage = () => {
    const [userData, setUserData] = useState({ email: '', role: '', first_login: true });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // fetch user data
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/v1/auth/profile/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);

                // If not first login, redirect immediately
                if (!response.data.first_login) {
                    const redirectPath = response.data.role === 'CLIENT'
                        ? 'http://localhost:8000/api/v1/auth/profiles/client/dashboard/'
                        : 'http://localhost:8000/api/v1/auth/profiles/freelancer/profile/setup/';
                    navigate(redirectPath)
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        // Start 5-second timer
        if (userData.first_login) {
            const timer = setTimeout(async () => {
                try {
                    // Update first_login to false
                    const token = localStorage.getItem('token');
                    await axios.get('http://localhost:8000/api/v1/auth/update/',
                        { first_login: false },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // Redirect based on role
                    const redirectPath = userData.role === 'CLIENT'
                        ? 'http://localhost:8000/api/v1/auth/profiles/client/dashboard/'
                        : 'http://localhost:8000/api/v1/auth/profiles/freelancer/profile/setup/';
                    navigate(redirectPath)
                } catch (error) {
                    console.error('Error updating first_login:', error);
                    navigate('/login');
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [userData, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <SyncLoader color="#a855f7" size={15} />
                <p className="ml-4 text-purple-300">Loading your profile...</p>
            </div>
        );
    }

    // Avoid rendering if redirecting
    if (!userData.first_login) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
            <div className="text-center text-white">
                <h1 className="text `text-4xl font-bold mb-6">Welcome, {userData.email}!</h1>
                <p className="text-xl text-purple-200 mb-8">
                    Welcome to SkillConnect! Discover top talent for your projects.
                </p>
                <SyncLoader color="#a855f7" size={15} />
                <p className="mt-4 text-purple-200">Preparing your experience...</p>
            </div>
        </div>
    );
};

export default WelcomePage