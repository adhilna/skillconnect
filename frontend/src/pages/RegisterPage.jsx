import { useState, useEffect, useContext } from 'react';
import { CheckCircle, Eye, EyeOff, ArrowRight, Mail, Lock, User } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

export default function RegistrationPage() {
    const { login } = useContext(AuthContext);
    const [formStep, setFormStep] = useState(0);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        phone: '',
        role: 'CLIENT',
        agreeTerms: false
    });

    // Animation effect
    useEffect(() => {
        setAnimateIn(true);
        const timer = setTimeout(() => {
            setAnimateIn(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [formStep]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when user starts typing in a field with an error
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const nextStep = () => {
        setAnimateIn(false);
        setTimeout(() => {
            setFormStep(formStep + 1);
        }, 300);
    };

    const prevStep = () => {
        setAnimateIn(false);
        setTimeout(() => {
            setFormStep(formStep - 1);
        }, 300);
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formValues.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formValues.password) {
            newErrors.password = 'Password is required';
        } else if (formValues.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Terms validation
        if (!formValues.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Map the account type to the role format expected by the backend
            const payload = {
                email: formValues.email,
                password: formValues.password,
                role: formValues.role,
            };

            // Add phone only if provided
            if (formValues.phone) {
                payload.phone = formValues.phone;
            }

            // Call the registration API
            await axios.post('http://localhost:8000/api/v1/auth/register/', payload);

            // Optionally auto-login the user after successful registration
            try {
                await login(formValues.email, formValues.password);
            } catch (loginError) {
                // Continue to success page even if auto-login fails
                console.error('Auto-login failed:', loginError);
            }

            // Show success step
            nextStep();
        } catch (error) {
            // Handle API errors
            if (error.response && error.response.data) {
                const serverErrors = error.response.data;
                const formattedErrors = {};

                // Format backend errors to match our form fields
                Object.keys(serverErrors).forEach(key => {
                    formattedErrors[key] = Array.isArray(serverErrors[key])
                        ? serverErrors[key][0]
                        : serverErrors[key];
                });

                setErrors(formattedErrors);
            } else {
                setErrors({
                    general: 'Registration failed. Please try again later.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl bottom-1/4 -right-20 animate-pulse"></div>
                <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skill+Connect</h1>
                    <p className="text-purple-200 mt-2">Create your account to get started</p>
                </div>

                {/* Registration card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Progress indicator */}
                    <div className="flex justify-between items-center mb-8">
                        {[0, 1, 2].map((step) => (
                            <div key={step} className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step < formStep
                                        ? 'bg-green-500 text-white'
                                        : step === formStep
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/20 text-purple-200'
                                        }`}
                                >
                                    {step < formStep ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        <span>{step + 1}</span>
                                    )}
                                </div>
                                <span className="text-xs text-purple-200 mt-2">
                                    {step === 0 ? 'Account' : step === 1 ? 'Details' : 'Complete'}
                                </span>
                            </div>
                        ))}

                        {/* Progress line */}
                        <div className="absolute h-1 bg-white/20 left-0 right-0 top-14 -z-10 translate-y-1">
                            <div
                                className="h-full bg-purple-600 transition-all"
                                style={{ width: `${(formStep / 2) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* General error message */}
                    {errors.general && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">
                            {errors.general}
                        </div>
                    )}

                    {/* Step 1: Account Type */}
                    {formStep === 0 && (
                        <div className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                            <h2 className="text-xl font-bold text-white mb-6">Choose your account type</h2>

                            <div className="space-y-4 mb-8">
                                <div
                                    className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${formValues.role === 'CLIENT'
                                        ? 'border-purple-500 bg-purple-500/20'
                                        : 'border-white/20 hover:border-purple-300'
                                        }`}
                                    onClick={() => handleInputChange({ target: { name: 'role', value: 'CLIENT' } })}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formValues.role === 'CLIENT' ? 'border-purple-500' : 'border-white/60'
                                            }`}>
                                            {formValues.role === 'CLIENT' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-white">I'm a client</h3>
                                            <p className="text-sm text-purple-200">Looking to hire talented professionals</p>
                                        </div>
                                        <User className="ml-auto text-purple-300" size={24} />
                                    </div>
                                </div>

                                <div
                                    className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${formValues.role === 'FREELANCER'
                                        ? 'border-purple-500 bg-purple-500/20'
                                        : 'border-white/20 hover:border-purple-300'
                                        }`}
                                    onClick={() => handleInputChange({ target: { name: 'role', value: 'FREELANCER' } })}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formValues.role === 'FREELANCER' ? 'border-purple-500' : 'border-white/60'
                                            }`}>
                                            {formValues.role === 'FREELANCER' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-white">I'm a freelancer</h3>
                                            <p className="text-sm text-purple-200">Looking for work and projects</p>
                                        </div>
                                        <User className="ml-auto text-purple-300" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={nextStep}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center font-medium transition-all transform hover:scale-105"
                                >
                                    Continue <ArrowRight className="ml-2" size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Account Details */}
                    {formStep === 1 && (
                        <div className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                            <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

                            <div className="space-y-4 mb-8">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-purple-300" size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className={`w-full py-3 pl-10 pr-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.email ? 'border-red-500' : 'border-white/20'
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-purple-300" size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number (optional)"
                                        className={`w-full py-3 pl-10 pr-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.phone ? 'border-red-500' : 'border-white/20'
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="text-purple-300" size={18} />
                                    </div>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        name="password"
                                        value={formValues.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className={`w-full py-3 pl-10 pr-10 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.password ? 'border-red-500' : 'border-white/20'
                                            }`}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="text-purple-300 hover:text-white focus:outline-none"
                                        >
                                            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="agreeTerms"
                                            name="agreeTerms"
                                            checked={formValues.agreeTerms}
                                            onChange={handleInputChange}
                                            className={`h-4 w-4 rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-500 ${errors.agreeTerms ? 'border-red-500' : ''
                                                }`}
                                        />
                                    </div>
                                    <label htmlFor="agreeTerms" className="ml-2 block text-sm text-purple-200">
                                        I agree to the <a href="#" className="text-purple-400 hover:text-white">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-white">Privacy Policy</a>
                                    </label>
                                </div>
                                {errors.agreeTerms && (
                                    <p className="text-red-400 text-sm">{errors.agreeTerms}</p>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="text-purple-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Back
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center font-medium transition-all transform hover:scale-105 ${loading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:from-blue-600 hover:to-purple-700'
                                        }`}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight className="ml-2" size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Completed */}
                    {formStep === 2 && (
                        <div className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                            <div className="text-center py-6">
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                                <p className="text-purple-200 mb-8">Your account has been successfully created.</p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => window.location.href = '/dashboard'}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
                                    >
                                        Go to Dashboard
                                    </button>

                                    <button
                                        onClick={() => window.location.href = '/profile'}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                                    >
                                        Complete Your Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    {formStep !== 2 && (
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-purple-200 mb-4">Or sign up with</p>
                            <div className="flex justify-center space-x-4">
                                <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                        <path d="M9 18c-4.51 2-5-2-7-2" />
                                    </svg>
                                </button>
                                <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sign in link */}
                {formStep !== 2 && (
                    <div className="text-center mt-6">
                        <p className="text-purple-200">
                            Already have an account? <a href="/login" className="text-purple-400 hover:text-white font-medium">Sign in</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}