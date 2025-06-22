import React from 'react';
import { Settings } from 'lucide-react';

const SettingsSection = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">Settings</h3>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
            <Settings size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Account Settings</h4>
            <p className="text-white/70 mb-6">Manage notifications, billing preferences, and security settings</p>
            <div className="text-white/50 text-sm">Settings panel coming soon...</div>
        </div>
    </div>
);

export default SettingsSection;