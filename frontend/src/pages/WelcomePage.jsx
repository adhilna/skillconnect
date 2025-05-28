import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const WelcomePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('access');
                const response = await axios.get('http://localhost:8000/api/v1/profiles/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Profile response:', response.data); // Debug
                setUserData(response.data);

                // If not first login, redirect immediately
                if (!response.data.first_login) {
                    const redirectPath = response.data.role === 'CLIENT'
                        ? '/client/profile'
                        : '/freelancer/profile';
                    navigate(redirectPath);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.response?.data || error.message);
                setError('Failed to load profile. Please log in again.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (userData && userData.first_login) {
            const timer = setTimeout(async () => {
                try {
                    const token = localStorage.getItem('access');
                    if (!token) {
                        throw new Error('No access token found');
                    }
                    // PATCH request to update first_login to false
                    await axios.patch('http://localhost:8000/api/v1/profiles/update/', {
                        first_login: false,
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // Redirect based on role
                    const redirectPath = userData.role === 'CLIENT'
                        ? '/client/profile'
                        : '/freelancer/profile';
                    navigate(redirectPath);
                } catch (error) {
                    console.error('Error updating first_login:', error);
                    setError('Failed to update profile. Please log in again.');
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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!userData.first_login) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
            <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-6">Welcome, {userData.email}!</h1>
                <p className="text-xl text-purple-200 mb-8">
                    Welcome to SkillConnect! Discover top talent for your projects.
                </p>
                <SyncLoader color="#a855f7" size={15} />
                <p className="mt-4 text-purple-200">Preparing your experience...</p>
            </div>
        </div>
    );
};

export default WelcomePage;
