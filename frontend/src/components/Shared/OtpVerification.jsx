import React from 'react';
import { Key, Loader2 } from 'lucide-react';

export default function OtpVerification({
    otp,
    errors,
    loading,
    otpTimer,
    resendCooldown,
    onOtpChange,
    onVerifyOtp,
    onResendOtp,
    success,
    verified,
    onNext,
}) {
    const minutes = Math.floor(otpTimer / 60);
    const seconds = otpTimer % 60;

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-6">Verify your email</h2>
            <div className="mb-4">
                <label className="block text-white mb-1">Enter OTP</label>
                <div className="relative">
                    <Key className="absolute left-3 top-3 text-purple-300" size={18} />
                    <input
                        type="text"
                        value={otp}
                        onChange={onOtpChange}
                        maxLength={6}
                        className="pl-10 pr-3 py-2 rounded-xl bg-white/20 text-white w-full outline-none"
                        disabled={loading || verified}
                    />
                </div>
                {errors.otp && (
                    <div className="text-red-400 text-xs mt-1">{errors.otp}</div>
                )}
            </div>
            <div className="flex justify-center items-center mb-4">
                {verified ? (
                    <button
                        type="button"
                        onClick={onNext}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onVerifyOtp}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                        Verify OTP
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center">
                <span className="text-purple-200 text-xs">
                    {otpTimer > 0
                        ? `OTP expires in ${minutes}:${seconds.toString().padStart(2, '0')}`
                        : 'OTP expired'}
                </span>
                <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={resendCooldown > 0 || loading || verified}
                    className="text-purple-400 hover:underline text-xs"
                >
                    {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend OTP'}
                </button>
            </div>
            {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg mt-4">
                    {success}
                </div>
            )}
        </div>
    );
}