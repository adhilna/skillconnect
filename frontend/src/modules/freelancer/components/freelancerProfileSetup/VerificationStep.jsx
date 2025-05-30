import React from "react";
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerificationStep({
    freelancerData,
    setFreelancerData
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Verification</h2>
                <p className="text-white/70">Build trust with verified credentials</p>
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">Email Verification</h3>
                            <p className="text-white/60 text-sm">Verify your email address</p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={freelancerData.emailVerified}
                                onChange={(e) => setFreelancerData(prev => ({ ...prev, emailVerified: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">Phone Verification</h3>
                            <p className="text-white/60 text-sm">Verify your phone number</p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={freelancerData.phoneVerified}
                                onChange={(e) => setFreelancerData(prev => ({ ...prev, phoneVerified: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">ID Verification</h3>
                            <p className="text-white/60 text-sm">Upload government ID</p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={freelancerData.idVerified}
                                onChange={(e) => setFreelancerData(prev => ({ ...prev, idVerified: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">Video Verification</h3>
                            <p className="text-white/60 text-sm">Record a verification video</p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={freelancerData.videoVerified}
                                onChange={(e) => setFreelancerData(prev => ({ ...prev, videoVerified: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}