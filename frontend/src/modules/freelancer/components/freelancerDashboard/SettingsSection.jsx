import React, { useState, useContext } from 'react';
import { Settings, Filter, User, Bell, Lock, EyeOff, LogOut } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsSection = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
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
          {/* Logout Section */}
          <div
            className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <div className="flex items-center space-x-3">
              <LogOut size={18} className="text-red-400" />
              <span className="text-red-400/90">Logout</span>
            </div>
            <button
              className="text-red-400 hover:text-red-300 text-sm font-medium"
              onClick={(e) => { e.stopPropagation(); setShowLogoutConfirm(true); }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="bg-gray-900/90 backdrop-blur-lg p-6 rounded-2xl border border-white/10 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
            <p className="text-white/80 mb-6">Do you really want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700/80 text-white hover:bg-gray-600/80 transition-colors"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                onClick={() => {
                  logout();
                  navigate('/login');
                  setShowLogoutConfirm(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
