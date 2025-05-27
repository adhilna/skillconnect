import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Eye, EyeOff, ArrowLeft, CheckCircle, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// --- Helper: Password strength ---
function getPasswordStrength(password) {
    if (!password) return 0;
    if (password.length < 8) return 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 3;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 2;
    return 1;
}
const strengthLabel = ["", "Weak", "Medium", "Strong"];
const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"];

export default function ForgotPasswordPage() {
    const [formStep, setFormStep] = useState(0);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [otpTimer, setOtpTimer] = useState(300);
    const [resendCooldown, setResendCooldown] = useState(0);

    const passwordRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (formStep === 1 && otpTimer > 0) {
            const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [formStep, otpTimer]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const cooldown = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
            return () => clearInterval(cooldown);
        }
    }, [resendCooldown]);

    useEffect(() => {
        if (formStep === 2 && passwordRef.current) {
            passwordRef.current.focus();
        }
    }, [formStep]);

    const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

    const handleSendOtp = async () => {
        setErrors({});
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "Enter a valid email address" });
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/v1/auth/users/forgot-password/request/", { email });
            setSuccess("OTP sent to your email!");
            setFormStep(1);
            setOtpTimer(300);
        } catch (err) {
            setErrors(err.response?.data || { email: "Failed to send OTP." });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setErrors({});
        if (!otp || otp.length !== 6) {
            setErrors({ otp: "Enter a valid 6-digit OTP" });
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/v1/auth/users/forgot-password/verify/", { email, otp });
            setSuccess("OTP verified!");
            setFormStep(2);
        } catch (err) {
            setErrors(err.response?.data || { otp: "Invalid or expired OTP." });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setErrors({});
        if (newPassword.length < 8) {
            setErrors({ newPassword: "Password must be at least 8 characters" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/v1/auth/users/forgot-password/reset/", {
                email,
                otp,
                new_password: newPassword,
            });
            setSuccess("Password reset successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setErrors(err.response?.data || { general: "Failed to reset password." });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setSuccess("");
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/v1/auth/users/forgot-password/request/", { email });
            setOtpTimer(300);
            setResendCooldown(60);
            setSuccess("OTP resent successfully!");
        } catch {
            setErrors({ general: "Failed to resend OTP." });
        } finally {
            setLoading(false);
        }
    };

    const Stepper = ({ step }) => (
        <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${i <= step ? "bg-blue-500 text-white" : "bg-white/20 text-white/50"
                            }`}
                    >
                        {i + 1}
                    </div>
                    {i < 2 && <div className="w-6 h-0.5 bg-white/30" />}
                </div>
            ))}
        </div>
    );

    Stepper.propTypes = {
        step: PropTypes.number.isRequired,
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-900 px-4 py-12">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl">
                <Stepper step={formStep} />
                {success && (
                    <div className="bg-green-500/10 text-green-300 px-4 py-2 rounded mb-4 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> {success}
                    </div>
                )}
                {errors.general && (
                    <div className="bg-red-500/10 text-red-300 px-4 py-2 rounded mb-4 text-sm">
                        {errors.general}
                    </div>
                )}

                {/* Step 0 - Email */}
                {formStep === 0 && (
                    <div className="space-y-4">
                        <h2 className="text-white text-xl font-bold text-center mb-2">Forgot Password</h2>
                        <p className="text-white/70 text-sm text-center mb-4">
                            Enter your email address and we will send an OTP to reset your password.
                        </p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring focus:border-blue-400"
                        />
                        {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm text-white/70 mt-2 hover:underline flex items-center gap-1 justify-center"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </button>
                    </div>
                )}

                {/* Step 1 - OTP */}
                {formStep === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-white text-xl font-bold text-center mb-2">Enter OTP</h2>
                        <p className="text-white/70 text-sm text-center">
                            We have sent a 6-digit OTP to <span className="text-white font-medium">{email}</span>
                        </p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="Enter OTP"
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white text-center text-lg tracking-widest focus:outline-none"
                        />
                        {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}

                        <div className="flex justify-between items-center text-sm text-white/70">
                            <span>Expires in: {formatTime(otpTimer)}</span>
                            <button
                                disabled={resendCooldown > 0}
                                onClick={handleResendOtp}
                                className="text-blue-300 hover:underline disabled:opacity-50"
                            >
                                Resend OTP {resendCooldown > 0 && `(${resendCooldown}s)`}
                            </button>
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                {/* Step 2 - Reset Password */}
                {formStep === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-white text-xl font-bold text-center mb-2">Reset Password</h2>
                        <div className="relative">
                            <input
                                ref={passwordRef}
                                type={isPasswordVisible ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none pr-10"
                            />
                            <div
                                onClick={() => setIsPasswordVisible((v) => !v)}
                                className="absolute right-3 top-3 text-white/60 cursor-pointer"
                            >
                                {isPasswordVisible ? <EyeOff /> : <Eye />}
                            </div>
                            {errors.newPassword && <p className="text-red-400 text-sm">{errors.newPassword}</p>}
                        </div>

                        <div className="relative">
                            <input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none pr-10"
                            />
                            <div
                                onClick={() => setIsConfirmPasswordVisible((v) => !v)}
                                className="absolute right-3 top-3 text-white/60 cursor-pointer"
                            >
                                {isConfirmPasswordVisible ? <EyeOff /> : <Eye />}
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                        </div>

                        <div className="w-full h-2 rounded bg-white/20 mt-2">
                            <div
                                className={`h-full ${strengthColor[getPasswordStrength(newPassword)]} rounded transition-all`}
                                style={{ width: `${(getPasswordStrength(newPassword) / 3) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-white/70">
                            Strength:{" "}
                            <span className={`font-semibold ${strengthColor[getPasswordStrength(newPassword)]}`}>
                                {strengthLabel[getPasswordStrength(newPassword)]}
                            </span>
                        </p>

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
