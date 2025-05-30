import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function CompletionStep({
    clientData,
    onRestart,
    onDashboard
}) {
    return (
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500">
                    <CheckCircle size={40} className="text-green-500" />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Profile Setup Complete!</h2>
                <p className="text-white/70 text-lg">Your client profile has been successfully created</p>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-left max-w-md mx-auto">
                <h3 className="text-white font-semibold mb-4">Profile Summary:</h3>
                <div className="space-y-2 text-sm text-white/70">
                    <p><span className="text-white">Account Type:</span> {clientData.accountType}</p>
                    <p><span className="text-white">Name:</span> {clientData.firstName} {clientData.lastName}</p>
                    {clientData.companyName && <p><span className="text-white">Company:</span> {clientData.companyName}</p>}
                    <p><span className="text-white">Location:</span> {clientData.location}</p>
                    <p><span className="text-white">Budget Range:</span> {clientData.budgetRange}</p>
                    <p><span className="text-white">Project Types:</span> {clientData.projectTypes.slice(0, 2).join(', ')}{clientData.projectTypes.length > 2 ? ` +${clientData.projectTypes.length - 2} more` : ''}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onRestart}
                    className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                    Create Another Profile
                </button>
                <button
                    onClick={onDashboard}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}
