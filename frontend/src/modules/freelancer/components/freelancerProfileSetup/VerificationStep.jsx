import React from "react";
import { Video, FileText, Phone, BadgeCheck, Mail } from 'lucide-react';

export default function VerificationStep({
    freelancerData,
    handleVerificationChange,
    fieldErrors,
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h4 className="text-lg font-medium flex items-center text-white">
                    <BadgeCheck className="mr-2" />
                    Account Verification
                </h4>
                <p className="text-white/70">Build trust with verified credentials</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between py-3 border-b border-green-500/50 text-white">
                    <div className="flex items-center">
                        <Mail className="mr-3" />
                        <span>Email Verification</span>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            handleVerificationChange('email_verified', !freelancerData.verification.email_verified)
                        }
                        className={`px-4 py-1 rounded-full text-sm transition-colors ${freelancerData.verification.email_verified
                            ? 'bg-green-500/20 text-green-500 border border-green-500'
                            : 'bg-transparent text-white border border-white/30 hover:bg-green-500/10 hover:text-green-400'
                            }`}
                    >
                        {freelancerData.verification.email_verified ? 'Verified' : 'Verify'}
                    </button>

                </div>

                <div className="flex items-center justify-between py-3 border-b border-green-500/50 text-white">
                    <div className="flex items-center">
                        <Phone className="mr-3" />
                        <span>Phone Verification</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleVerificationChange('phone_verified', !freelancerData.verification.phone_verified)}
                        className={`px-4 py-1 rounded-full text-sm transition-colors ${freelancerData.verification.phone_verified
                            ? 'bg-green-500/20 text-green-500 border border-green-500'
                            : 'bg-transparent text-white border border-white/30 hover:bg-green-500/10 hover:text-green-400'
                            }`}
                    >
                        {freelancerData.verification.phone_verified ? 'Verified' : 'Verify'}
                    </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-green-500/50 text-white">
                    <div className="flex items-center">
                        <FileText className="mr-3" />
                        <span>ID Verification</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleVerificationChange('id_verified', !freelancerData.verification.id_verified)}
                        className={`px-4 py-1 rounded-full text-sm ${freelancerData.verification.id_verified
                            ? 'bg-green-500/20 text-green-500 border border-green-500'
                            : 'bg-transparent text-white border border-white/30 hover:bg-green-500/10 hover:text-green-400'
                            }`}
                    >
                        {freelancerData.verification.id_verified ? 'Verified' : 'Verify'}
                    </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-green-500/50 text-white">
                    <div className="flex items-center">
                        <Video className="mr-3" />
                        <span>Video Verification</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleVerificationChange('video_verified', !freelancerData.verification.video_verified)}
                        className={`px-4 py-1 rounded-full text-sm ${freelancerData.verification.video_verified
                            ? 'bg-green-500/20 text-green-500 border border-green-500'
                            : 'bg-transparent text-white border border-white/30 hover:bg-green-500/10 hover:text-green-400'
                            }`}
                    >
                        {freelancerData.verification.video_verified ? 'Verified' : 'Verify'}
                    </button>
                </div>
            </div>

            {fieldErrors.verification && <p className="text-red-500 text-sm">{fieldErrors.verification}</p>}
        </div>
    );
};