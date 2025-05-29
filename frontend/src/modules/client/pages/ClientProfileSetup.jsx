import React, { useState } from 'react';
import { Building2, MapPin, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ClientProfileSetup() {
    const [formValues, setFormValues] = useState({
        companyName: '',
        location: '',
        bio: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.companyName) newErrors.companyName = 'Company name is required';
        if (!formValues.location) newErrors.location = 'Location is required';
        if (!formValues.bio) newErrors.bio = 'Bio is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            await axios.post(
                'http://localhost:8000/api/v1/profiles/client/profile/',
                formValues,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access')}`,
                    },
                }
            );
            setSuccess(true);
            setTimeout(() => navigate('/client/dashboard'), 1500); // or your desired route
        } catch (error) {
            setErrors({
                general: error.response?.data?.detail || 'Failed to save profile. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4 text-white">
                <CheckCircle size={64} className="text-green-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Profile Setup Complete!</h2>
                <p className="mb-4">Your client profile has been saved successfully.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4">
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Set up your Client Profile</h2>
                {errors.general && (
                    <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">
                        {errors.general}
                    </div>
                )}
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="text-purple-300" size={18} />
                        </div>
                        <input
                            type="text"
                            name="companyName"
                            value={formValues.companyName}
                            onChange={handleInputChange}
                            placeholder="Company Name"
                            className={`w-full py-3 pl-10 pr-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.companyName ? 'border-red-500' : 'border-white/20'}`}
                        />
                        {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="text-purple-300" size={18} />
                        </div>
                        <input
                            type="text"
                            name="location"
                            value={formValues.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            className={`w-full py-3 pl-10 pr-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.location ? 'border-red-500' : 'border-white/20'}`}
                        />
                        {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                    </div>
                    <div>
                        <textarea
                            name="bio"
                            value={formValues.bio}
                            onChange={handleInputChange}
                            placeholder="Brief bio or description"
                            rows={4}
                            className={`w-full py-3 px-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 resize-none ${errors.bio ? 'border-red-500' : 'border-white/20'}`}
                        />
                        {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio}</p>}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}
