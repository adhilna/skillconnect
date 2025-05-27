import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Shared/Stepper.jsx';
import RoleSelection from '../components/Shared/RoleSelection.jsx';
import AccountForm from '../components/Shared/AccountForm.jsx';
import OtpVerification from '../components/Shared/OtpVerification.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

export default function Register() {
    const { login, user } = useContext(AuthContext);
    const [formStep, setFormStep] = useState(0);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState('');
    const [otpTimer, setOtpTimer] = useState(300);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [success, setSuccess] = useState('');
    const [verified, setVerified] = useState(false); // New state for verification status

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        role: '',
        agreeTerms: false,
    });

    const navigate = useNavigate()

    useEffect(() => {
        let timer;
        if (formStep === 2 && otpTimer > 0) {
            timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [formStep, otpTimer]);

    useEffect(() => {
        let cooldown;
        if (resendCooldown > 0) {
            cooldown = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(cooldown);
    }, [resendCooldown]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const nextStep = () => setFormStep((prev) => prev + 1);
    const prevStep = () => setFormStep((prev) => prev - 1);

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.email) newErrors.email = 'Email is required';
        if (!formValues.password) newErrors.password = 'Password is required';
        if (!formValues.agreeTerms) newErrors.agreeTerms = 'You must agree to terms';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtp = () => {
        const newErrors = {};
        if (!otp || otp.length !== 6) newErrors.otp = 'Enter valid 6-digit OTP';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/users/register/', formValues);
            console.log('Registration success:', response.data);
            nextStep();
            setOtpTimer(300);
        } catch (error) {
            setErrors(error.response?.data || {});
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!formValues.email) {
            setErrors({ email: 'Email is missing' });
            return;
        }
        if (!validateOtp()) return;

        setLoading(true);
        setErrors({});
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/users/verify-otp/', {
                email: formValues.email,
                otp,
            });

            const { access, refresh, user } = response.data;
            console.log('Tokens:', { access, refresh }); // Debug

            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Update global auth state (via context, etc.)
            await login({ email: formValues.email, role: user.role });
            console.log('User after login:', user); // Debug

            setSuccess('Email verified successfully!');
            setVerified(true); // Show Next or continue to dashboard
        } catch (error) {
            setErrors({ otp: error.response?.data.error || 'Invalid or expired OTP' });
        } finally {
            setLoading(false);
        }
    };


    const handleNextAfterVerification = () => {
        if (user) {
            navigate('/welcome');
        } else {
            console.error('User not authenticated, redirecting to login');
            navigate('/login');
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/v1/auth/users/resend-otp/', { email: formValues.email });
            setOtpTimer(300);
            setResendCooldown(60);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelect = (role) => {
        setFormValues((prev) => ({ ...prev, role }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 px-4 py-12">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl w-full max-w-md shadow-2xl">
                <Stepper formStep={formStep} />

                {formStep === 0 && (
                    <RoleSelection
                        selectedRole={formValues.role}
                        onSelect={handleRoleSelect}
                        onContinue={() => {
                            if (!formValues.role) {
                                setErrors({ role: 'Please select a role' });
                            } else {
                                nextStep();
                            }
                        }}
                    />
                )}

                {formStep === 1 && (
                    <AccountForm
                        formValues={formValues}
                        errors={errors}
                        loading={loading}
                        isPasswordVisible={isPasswordVisible}
                        onInputChange={handleInputChange}
                        onTogglePassword={() => setIsPasswordVisible((prev) => !prev)}
                        onSubmit={handleSubmit}
                        onBack={prevStep}
                    />
                )}

                {formStep === 2 && (
                    <OtpVerification
                        otp={otp}
                        errors={errors}
                        loading={loading}
                        otpTimer={otpTimer}
                        resendCooldown={resendCooldown}
                        onOtpChange={handleOtpChange}
                        onVerifyOtp={handleVerifyOtp}
                        onResendOtp={handleResendOtp}
                        onBack={prevStep}
                        success={success}
                        verified={verified} // Pass verified state
                        onNext={handleNextAfterVerification} // Pass Next handler
                    />
                )}
            </div>
        </div>
    );
}

// import { useState, useEffect, useContext } from 'react';
// import { CheckCircle, Eye, EyeOff, ArrowRight, Mail, Lock, User, Key, Loader2 } from 'lucide-react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext.jsx';

// export default function RegistrationPage() {
//     const { login } = useContext(AuthContext);
//     const [formStep, setFormStep] = useState(0);
//     const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//     const [animateIn, setAnimateIn] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [otp, setOtp] = useState('');
//     const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
//     const [resendCooldown, setResendCooldown] = useState(0);
//     const [success, setSuccess] = useState('');

//     const [formValues, setFormValues] = useState({
//         email: '',
//         password: '',
//         role: 'CLIENT',
//         agreeTerms: false,
//     });

//     // Animation effect
//     useEffect(() => {
//         setAnimateIn(false);
//         const timer = setTimeout(() => {
//             setAnimateIn(true);
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [formStep]);

//     // OTP countdown timer
//     useEffect(() => {
//         let timer;
//         if (formStep === 2 && otpTimer > 0) {
//             timer = setInterval(() => {
//                 setOtpTimer((prev) => prev - 1);
//             }, 1000);
//         } else if (otpTimer === 0) {
//             setErrors({ ...errors, otp: 'OTP has expired. Please resend.' });
//         }
//         return () => clearInterval(timer);
//     }, [formStep, otpTimer]);

//     // Resend cooldown timer
//     useEffect(() => {
//         let cooldownTimer;
//         if (resendCooldown > 0) {
//             cooldownTimer = setInterval(() => {
//                 setResendCooldown((prev) => prev - 1);
//             }, 1000);
//         }
//         return () => clearInterval(cooldownTimer);
//     }, [resendCooldown]);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormValues({
//             ...formValues,
//             [name]: type === 'checkbox' ? checked : value,
//         });

//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: '',
//             });
//         }
//     };

//     const handleOtpChange = (e) => {
//         const value = e.target.value.replace(/\D/g, ''); // Only digits
//         setOtp(value);
//         if (errors.otp) {
//             setErrors({ ...errors, otp: '' });
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setIsPasswordVisible(!isPasswordVisible);
//     };

//     const nextStep = () => {
//         setAnimateIn(false);
//         setTimeout(() => {
//             setFormStep(formStep + 1);
//         }, 300);
//     };

//     const prevStep = () => {
//         setAnimateIn(false);
//         setTimeout(() => {
//             setFormStep(formStep - 1);
//         }, 300);
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         const localPart = formValues.email.split('@')[0];
//         if (localPart.length < 5) {
//             newErrors.email = 'Email is too short';
//         }
//         const emailRegex = /^[a-zA-Z0-9](?!.*?[._]{2})[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9]@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

//         if (!formValues.email) {
//             newErrors.email = 'Email is required';
//         } else if (!emailRegex.test(formValues.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         if (!formValues.password) {
//             newErrors.password = 'Password is required';
//         } else if (formValues.password.length < 8) {
//             newErrors.password = 'Password must be at least 8 characters';
//         } else if (!/[A-Z]/.test(formValues.password)) {
//             newErrors.password = 'Password must contain at least one uppercase letter';
//         } else if (!/[a-z]/.test(formValues.password)) {
//             newErrors.password = 'Password must contain at least one lowercase letter';
//         } else if (!/[0-9]/.test(formValues.password)) {
//             newErrors.password = 'Password must contain at least one number';
//         } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formValues.password)) {
//             newErrors.password = 'Password must contain at least one special character';
//         } else if (/\s/.test(formValues.password)) {
//             newErrors.password = 'Password must not contain spaces';
//         }

//         if (!formValues.agreeTerms) {
//             newErrors.agreeTerms = 'You must agree to the terms';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const validateOtp = () => {
//         const newErrors = {};
//         if (!otp) {
//             newErrors.otp = 'OTP is required';
//         } else if (otp.length !== 6) {
//             newErrors.otp = 'OTP must be 6 digits';
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) {
//             return;
//         }

//         setLoading(true);

//         try {
//             const payload = {
//                 email: formValues.email,
//                 password: formValues.password,
//                 role: formValues.role,
//             };

//             await axios.post('http://localhost:8000/api/v1/auth/register/', payload);
//             nextStep(); // Move to OTP verification step
//         } catch (error) {
//             if (error.response && error.response.data) {
//                 const serverErrors = error.response.data;
//                 const formattedErrors = {};
//                 Object.keys(serverErrors).forEach((key) => {
//                     formattedErrors[key] = Array.isArray(serverErrors[key])
//                         ? serverErrors[key][0]
//                         : serverErrors[key];
//                 });
//                 if (serverErrors.detail === 'Rate limit exceeded') {
//                     formattedErrors.general = 'Too many registration attempts. Please try again later.';
//                 }
//                 setErrors(formattedErrors);
//             } else {
//                 setErrors({
//                     general: 'Registration failed due to a server error. Please try again later.',
//                 });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVerifyOtp = async () => {
//         if (!validateOtp()) {
//             return;
//         }
//         setLoading(true);
//         setErrors({});
//         setSuccess('');
//         try {
//             const response = await axios.post('http://localhost:8000/api/v1/auth/verify-otp/', {
//                 email: formValues.email,
//                 otp: otp,
//             });
//             const { access, refresh, user } = response.data;
//             await login(formValues.email, formValues.password, { access, refresh, user });
//             setSuccess('Email verified successfully! Redirecting...');
//             setTimeout(() => {
//                 window.location.href = '/welcome';
//             }, 1500);
//         } catch (error) {
//             if (error.response && error.response.data) {
//                 setErrors({ otp: error.response.data.error || 'Invalid or expired OTP' });
//             } else {
//                 setErrors({ otp: 'Verification failed. Please try again.' });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleResendOtp = async () => {
//         setLoading(true);
//         setErrors({});

//         try {
//             await axios.post('http://localhost:8000/api/v1/auth/resend-otp/', {
//                 email: formValues.email,
//             });
//             setOtpTimer(300);
//             setResendCooldown(30);
//             setOtp('');
//         } catch (error) {
//             if (error.response && error.response.data) {
//                 setErrors({ otp: error.response.data.error || 'Failed to resend OTP' });
//                 if (error.response.data.error === 'Rate limit exceeded') {
//                     setErrors({ otp: 'Too many resend attempts. Please wait a minute.' });
//                 }
//             } else {
//                 setErrors({ otp: 'Failed to resend OTP. Please try again.' });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4">
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
//                 <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl bottom-1/4 -right-20 animate-pulse"></div>
//                 <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
//             </div>

//             <div className="relative z-10 w-full max-w-md">
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skill+Connect</h1>
//                     <p className="text-purple-200 mt-2">Create your account to get started</p>
//                 </div>

//                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
//                     <div className="flex justify-between items-center mb-8">
//                         {[0, 1, 2].map((step) => (
//                             <div key={step} className="flex flex-col items-center">
//                                 <div
//                                     className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step < formStep
//                                         ? 'bg-green-500 text-white'
//                                         : step === formStep
//                                             ? 'bg-purple-600 text-white'
//                                             : 'bg-white/20 text-purple-200'
//                                         }`}
//                                 >
//                                     {step < formStep ? <CheckCircle size={20} /> : <span>{step + 1}</span>}
//                                 </div>
//                                 <span className="text-xs text-purple-200 mt-2">
//                                     {step === 0 ? 'Account' : step === 1 ? 'Details' : 'Verify'}
//                                 </span>
//                             </div>
//                         ))}
//                         <div className="absolute h-1 bg-white/20 left-0 right-0 top-14 -z-10 translate-y-1">
//                             <div
//                                 className="h-full bg-purple-600 transition-all"
//                                 style={{ width: `${(formStep / 2) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>

//                     {errors.general && (
//                         <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">{errors.general}</div>
//                     )}

//                     {formStep === 0 && (
//                         <div className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
//                             <h2 className="text-xl font-bold text-white mb-6">Choose your account type</h2>
//                             <div className="space-y-4 mb-8">
//                                 <div
//                                     className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${formValues.role === 'CLIENT' ? 'border-purple-500 bg-purple-500/20' : 'border-white/20 hover:border-purple-300'
//                                         }`}
//                                     onClick={() => handleInputChange({ target: { name: 'role', value: 'CLIENT' } })}
//                                 >
//                                     <div className="flex items-center">
//                                         <div
//                                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formValues.role === 'CLIENT' ? 'border-purple-500' : 'border-white/60'
//                                                 }`}
//                                         >
//                                             {formValues.role === 'CLIENT' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
//                                         </div>
//                                         <div className="ml-3">
//                                             <h3 className="font-medium text-white">I'm a client</h3>
//                                             <p className="text-sm text-purple-200">Looking to hire talented professionals</p>
//                                         </div>
//                                         <User className="ml-auto text-purple-300" size={24} />
//                                     </div>
//                                 </div>
//                                 <div
//                                     className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${formValues.role === 'FREELANCER' ? 'border-purple-500 bg-purple-500/20' : 'border-white/20 hover:border-purple-300'
//                                         }`}
//                                     onClick={() => handleInputChange({ target: { name: 'role', value: 'FREELANCER' } })}
//                                 >
//                                     <div className="flex items-center">
//                                         <div
//                                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formValues.role === 'FREELANCER' ? 'border-purple-500' : 'border-white/60'
//                                                 }`}
//                                         >
//                                             {formValues.role === 'FREELANCER' && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
//                                         </div>
//                                         <div className="ml-3">
//                                             <h3 className="font-medium text-white">I'm a freelancer</h3>
//                                             <p className="text-sm text-purple-200">Looking for work and projects</p>
//                                         </div>
//                                         <User className="ml-auto text-purple-300" size={24} />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex justify-end">
//                                 <button
//                                     onClick={nextStep}
//                                     className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center font-medium transition-all transform hover:scale-105"
//                                 >
//                                     Continue <ArrowRight className="ml-2" size={18} />
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {formStep === 1 && (
//                         <form
//                             onSubmit={handleSubmit}
//                             className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
//                         >
//                             <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>
//                             <div className="space-y-4 mb-8">
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Mail className="text-purple-300" size={18} />
//                                     </div>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formValues.email}
//                                         onChange={handleInputChange}
//                                         placeholder="Email Address"
//                                         autoComplete="email"
//                                         className={`w-full py-3 pl-10 pr-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.email ? 'border-red-500' : 'border-white/20'
//                                             }`}
//                                     />
//                                     {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
//                                 </div>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Lock className="text-purple-300" size={18} />
//                                     </div>
//                                     <input
//                                         type={isPasswordVisible ? 'text' : 'password'}
//                                         name="password"
//                                         value={formValues.password}
//                                         onChange={handleInputChange}
//                                         placeholder="Password"
//                                         autoComplete="new-password"
//                                         className={`w-full py-3 pl-10 pr-10 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.password ? 'border-red-500' : 'border-white/20'
//                                             }`}
//                                     />
//                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <button
//                                             type="button"
//                                             onClick={togglePasswordVisibility}
//                                             className="text-purple-300 hover:text-white focus:outline-none"
//                                         >
//                                             {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
//                                         </button>
//                                     </div>
//                                     {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex items-center h-5">
//                                         <input
//                                             type="checkbox"
//                                             id="agreeTerms"
//                                             name="agreeTerms"
//                                             checked={formValues.agreeTerms}
//                                             onChange={handleInputChange}
//                                             className={`h-4 w-4 rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-500 ${errors.agreeTerms ? 'border-red-500' : ''
//                                                 }`}
//                                         />
//                                     </div>
//                                     <label htmlFor="agreeTerms" className="ml-2 block text-sm text-purple-200">
//                                         I agree to the <a href="#" className="text-purple-400 hover:text-white">Terms of Service</a> and{' '}
//                                         <a href="#" className="text-purple-400 hover:text-white">Privacy Policy</a>
//                                     </label>
//                                 </div>
//                                 {errors.agreeTerms && <p className="text-red-400 text-sm">{errors.agreeTerms}</p>}
//                             </div>
//                             <div className="flex justify-between">
//                                 <button
//                                     type="button"
//                                     onClick={prevStep}
//                                     className="text-purple-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
//                                 >
//                                     Back
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center font-medium transition-all transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'
//                                         }`}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="animate-spin mr-2" size={18} /> Creating Account...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Create Account <ArrowRight className="ml-2" size={18} />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     )}

//                     {formStep === 2 && (
//                         <div className={`transition-all duration-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
//                             <h2 className="text-xl font-bold text-white mb-6">Verify Your Email</h2>
//                             <p className="text-purple-200 mb-4">Enter the 6-digit code sent to {formValues.email}</p>
//                             <p className="text-purple-300 mb-6">
//                                 Time remaining: {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
//                             </p>

//                             {/* Success message block */}
//                             {success && (
//                                 <div className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg mb-4">
//                                     {success}
//                                 </div>
//                             )}

//                             <div className="space-y-4 mb-8">
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Key className="text-purple-300" size={18} />
//                                     </div>
//                                     <input
//                                         type="text"
//                                         value={otp}
//                                         onChange={handleOtpChange}
//                                         placeholder="Enter OTP"
//                                         maxLength={6}
//                                         autoFocus
//                                         className={`w-full py-3 pl-10 pr-4 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 ${errors.otp ? 'border-red-500' : 'border-white/20'
//                                             }`}
//                                     />
//                                     {errors.otp && <p className="text-red-400 text-sm mt-1">{errors.otp}</p>}
//                                 </div>
//                                 <button
//                                     onClick={handleVerifyOtp}
//                                     disabled={loading}
//                                     className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center justify-center font-medium transition-all transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'
//                                         }`}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="animate-spin mr-2" size={18} /> Verifying...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Verify OTP <ArrowRight className="ml-2" size={18} />
//                                         </>
//                                     )}
//                                 </button>
//                                 <button
//                                     onClick={handleResendOtp}
//                                     disabled={loading || resendCooldown > 0}
//                                     className={`w-full text-purple-300 hover:text-white px-4 py-2 rounded-lg transition-colors ${loading || resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
//                                         }`}
//                                 >
//                                     {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
//                                 </button>
//                             </div>
//                             <div className="flex justify-start">
//                                 <button
//                                     onClick={prevStep}
//                                     className="text-purple-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
//                                 >
//                                     Back
//                                 </button>
//                             </div>
//                         </div>
//                     )}



//                     {formStep !== 2 && (
//                         <div className="mt-8 pt-6 border-t border-white/10 text-center">
//                             <p className="text-purple-200 mb-4">Or sign up with</p>
//                             <div className="flex justify-center space-x-4">
//                                 <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="text-white"
//                                         width="20"
//                                         height="20"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
//                                         <path d="M9 18c-4.51 2-5-2-7-2" />
//                                     </svg>
//                                 </button>
//                                 <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="text-white"
//                                         width="20"
//                                         height="20"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {formStep !== 2 && (
//                         <div className="text-center mt-6">
//                             <p className="text-purple-200">
//                                 Already have an account?{' '}
//                                 <a href="/login" className="text-purple-400 hover:text-white font-medium">
//                                     Sign in
//                                 </a>
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }