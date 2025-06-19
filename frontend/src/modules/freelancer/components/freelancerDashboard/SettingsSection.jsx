import React from 'react';
import { Settings, Filter, User, Bell, Lock, EyeOff } from 'lucide-react';

const SettingsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-white">Settings</h3>
      <div className="flex items-center space-x-2">
        <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </div>
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <User size={18} className="text-white" />
            <span className="text-white/80">Account</span>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Edit</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <Bell size={18} className="text-white" />
            <span className="text-white/80">Notifications</span>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Edit</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <Lock size={18} className="text-white" />
            <span className="text-white/80">Security</span>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Edit</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <EyeOff size={18} className="text-white" />
            <span className="text-white/80">Privacy</span>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Edit</button>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsSection;
