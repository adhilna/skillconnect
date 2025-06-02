import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function CompletionStep({ freelancerData, onDashboard }) {
    return (
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500">
                    <CheckCircle size={40} className="text-blue-500" />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Profile Setup Complete!</h2>
                <p className="text-white/70 text-lg">Your freelancer profile has been successfully created</p>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-left max-w-md mx-auto">
                <h3 className="text-white font-semibold mb-4">Profile Summary:</h3>
                <div className="space-y-2 text-sm text-white/70">
                    <p>
                        <span className="text-white">Name:</span>{" "}
                        {freelancerData.first_name && freelancerData.last_name
                            ? `${freelancerData.first_name} ${freelancerData.last_name}`
                            : freelancerData.fullName || "—"}
                    </p>
                    <p><span className="text-white">Location:</span> {freelancerData.location}</p>
                    <p><span className="text-white">Skills:</span> {freelancerData.skills.slice(0, 3).join(', ')}{freelancerData.skills.length > 3 ? ` +${freelancerData.skills.length - 3} more` : ''}</p>
                    <p><span className="text-white">Languages:</span> {freelancerData.languages.length}</p>
                    <p><span className="text-white">Portfolio Items:</span> {freelancerData.portfolio.length}</p>
                    <p><span className="text-white">Available:</span> {freelancerData.isAvailable ? 'Yes' : 'No'}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onDashboard}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}