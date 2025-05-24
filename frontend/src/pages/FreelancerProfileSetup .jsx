import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; // adjust path
import axios from 'axios';

const steps = [
    'BasicInfo',
    'Location',
    'Skills',
    'Education',
    'Experience',
    'Certifications',
    'Languages',
    'Portfolio',
    'Review',
];

// Simple animation classes for Tailwind transitions
const stepTransition = "transition-transform duration-500 ease-in-out";

export default function FreelancerProfileSetupPage() {
    const { token, _user } = useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(0);

    // Form state for each step (only key fields for demo)
    const [formData, setFormData] = useState({
        full_name: '',
        about: '',
        profile_picture: null,
        location_name: '',
        latitude: '',
        longitude: '',
        skills: [], // you can extend this as needed
        educations: [],
        experiences: [],
        certifications: [],
        languages: [],
        portfolios: [],
    });

    // Handle input changes (example for text inputs)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file inputs (profile picture, certifications)
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, profile_picture: e.target.files[0] }));
    };

    // Basic validation for step 0 (basic info)
    const validateStep = () => {
        if (currentStep === 0) {
            if (!formData.full_name.trim()) {
                alert("Full name is required.");
                return false;
            }
        }
        return true;
    };

    // Move to next step
    const nextStep = () => {
        if (!validateStep()) return;
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    // Move to previous step
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Skip current step (except step 0)
    const skipStep = () => {
        if (currentStep === 0) return; // no skip for mandatory step
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    // Submit form data to backend (final step)
    const handleSubmit = async () => {
        try {
            // Prepare form data, including files
            const data = new FormData();
            for (const key in formData) {
                if (key === 'profile_picture' && formData[key]) {
                    data.append(key, formData[key]);
                } else if (Array.isArray(formData[key])) {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const _res = await axios.post(
                'http://localhost:8000/api/v1/profiles/freelancer/profile/',
                data,
                config
            );
            alert("Profile setup completed!");
            // Optionally redirect or update UI here
        } catch (error) {
            console.error(error);
            alert("Error submitting profile.");
        }
    };

    // Render step content
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <label className="block">
                            Full Name *
                            <input
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded"
                                required
                            />
                        </label>
                        <label className="block">
                            About
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block">
                            Profile Picture
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1"
                            />
                        </label>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-4">
                        <label className="block">
                            Location Name
                            <input
                                name="location_name"
                                value={formData.location_name}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block">
                            Latitude
                            <input
                                name="latitude"
                                type="number"
                                step="0.000001"
                                value={formData.latitude}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block">
                            Longitude
                            <input
                                name="longitude"
                                type="number"
                                step="0.000001"
                                value={formData.longitude}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded"
                            />
                        </label>
                    </div>
                );
            // Add other steps like Skills, Education, etc. here similarly

            case steps.length - 1:
                return (
                    <div>
                        <h3 className="font-bold mb-4">Review your details</h3>
                        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                            {JSON.stringify(formData, null, 2)}
                        </pre>
                    </div>
                );

            default:
                return <div>Step content here...</div>;
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
            <h2 className="text-2xl font-semibold mb-6">
                Freelancer Profile Setup ({currentStep + 1} / {steps.length})
            </h2>
            <div className={`overflow-hidden ${stepTransition}`}>
                {renderStep()}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Back
                </button>

                {currentStep !== 0 && currentStep < steps.length - 1 && (
                    <button
                        onClick={skipStep}
                        className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                        Skip
                    </button>
                )}

                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
}
