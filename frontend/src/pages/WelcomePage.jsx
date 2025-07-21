import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { AuthContext } from "../context/AuthContext"; // <-- Import AuthContext

const WelcomePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext); // <-- Use AuthContext for logout

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Read token from localStorage (or use AuthContext.token if you prefer)
                const token = localStorage.getItem('access');
                if (!token) {
                    setError('No access token found. Please log in.');
                    navigate('/login');
                    return;
                }
                const response = await api.get(
                    '/api/v1/auth/users/profile/',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUserData(response.data);

                // If not first login, redirect immediately based on role
                if (!response.data.first_login) {
                    const role = response.data.role?.toUpperCase();
                    if (role === 'CLIENT') {
                        navigate('/client/profile');
                    } else if (role === 'FREELANCER') {
                        navigate('/freelancer/profile');
                    } else {
                        setError('Unknown user role. Please contact support.');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error.response?.data || error.message);
                // On 401, clear token and redirect to login
                if (error.response?.status === 401) {
                    logout(); // <-- Use AuthContext logout to clear token and state
                    navigate('/login');
                } else {
                    setError('Failed to load profile. Please log in again.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate, logout]); // <-- Add logout to dependency array

    useEffect(() => {
        if (userData && userData.first_login) {
            const timer = setTimeout(async () => {
                try {
                    const token = localStorage.getItem('access');
                    if (!token) {
                        throw new Error('No access token found');
                    }
                    // PATCH request to update first_login to false
                    const response = await api.patch(
                        '/api/v1/auth/users/update/',
                        { first_login: false },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('User role:', response.data.role);
                    console.log('PATCH response:', response.data);

                    // Redirect based on role
                    const redirectPath = userData.role === 'CLIENT'
                        ? '/client/profile'
                        : '/freelancer/profile';
                    navigate(redirectPath);
                } catch (error) {
                    console.error('Error updating first_login:', error);
                    // On 401, clear token and redirect to login
                    if (error.response?.status === 401) {
                        logout(); // <-- Use AuthContext logout
                        navigate('/login');
                    } else {
                        setError('Failed to update profile. Please log in again.');
                    }
                }
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [userData, navigate, logout]); // <-- Add logout to dependency array

    // Show loading spinner while loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <SyncLoader color="#a855f7" size={15} />
                <p className="ml-4 text-purple-300">Loading your profile...</p>
            </div>
        );
    }

    // Show error message if there is an error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    // Only render welcome message if userData exists and first_login is true
    // IMPORTANT: Check if userData exists before accessing its properties
    if (!userData || !userData.first_login) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
            <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-6">Welcome, {userData.email}!</h1>
                <p className="text-xl text-purple-200 mb-8">
                    Welcome to SkillConnect! Discover top talent for your projects.
                </p>
                <SyncLoader color="#a855f7" size={15} />
                <p className="mt-4 text-purple-200">Preparing your profile page setup...</p>
            </div>
        </div>
    );
};

export default WelcomePage;
