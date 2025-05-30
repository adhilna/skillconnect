import React from 'react';
import { User, Building } from 'lucide-react';

export default function AccountTypeStep({ clientData, setClientData, errors }) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Choose Account Type</h2>
                <p className="text-white/70">Tell us about yourself to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    onClick={() => setClientData(prev => ({ ...prev, accountType: 'personal' }))}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${clientData.accountType === 'personal'
                        ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${clientData.accountType === 'personal' ? 'bg-green-500' : 'bg-white/10'
                            }`}>
                            <User size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Personal</h3>
                            <p className="text-white/70 text-sm">I&apos;m an individual looking to hire freelancers</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setClientData(prev => ({ ...prev, accountType: 'business' }))}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${clientData.accountType === 'business'
                        ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${clientData.accountType === 'business' ? 'bg-green-500' : 'bg-white/10'
                            }`}>
                            <Building size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Business</h3>
                            <p className="text-white/70 text-sm">I represent a company or organization</p>
                        </div>
                    </div>
                </div>
            </div>

            {errors.accountType && <p className="text-red-400 text-sm text-center">{errors.accountType}</p>}
        </div>
    )
}