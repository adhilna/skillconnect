import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Shared/Stepper.jsx';
import RoleSelection from '../components/Shared/RoleSelection.jsx';
import AccountForm from '../components/Shared/AccountForm.jsx';
import OtpVerification from '../components/Shared/OtpVerification.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api/api.js';

export default function Register() {
    const { login, /*user*/ } = useContext(AuthContext);
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
            const response = await api.post('/api/v1/auth/users/register/', formValues);
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
            const response = await api.post('/api/v1/auth/users/verify-otp/', {
                email: formValues.email,
                otp,
            });

            const { access, refresh, user } = response.data;

            // Store tokens
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            // Update global auth state (via context, etc.)
            await login({ email: formValues.email, role: user.role }, access);

            setSuccess('Email verified successfully!');
            navigate('/welcome')
            setVerified(true); // Show Next or continue to dashboard
        } catch (error) {
            setErrors({ otp: error.response?.data.error || 'Invalid or expired OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await api.post('/api/v1/auth/users/resend-otp/', { email: formValues.email });
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
                    // onNext={handleNextAfterVerification} // Pass Next handler
                    />
                )}
            </div>
        </div>

    );
}
