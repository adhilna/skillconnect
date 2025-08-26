import React from 'react';
import { Menu, Calendar, Bell, User } from 'lucide-react';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Header = ({ activeSection, setSidebarOpen, profileData, firstLetter, onNotificationClick }) => (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-white/70 hover:text-white transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h2 className="text-xl font-semibold text-white capitalize">
                        {activeSection === 'dashboard' ? 'Dashboard Overview' : activeSection.replace(/([A-Z])/g, ' $1')}
                    </h2>
                    <p className="text-white/60 text-sm">Welcome back, {profileData?.first_name}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                    <Calendar size={16} className="text-white/70" />
                    <span className="text-white/70 text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <NotificationDropdown onNotificationClick={onNotificationClick} />
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full shadow-lg overflow-hidden from-blue-400 to-cyan-400 flex items-center justify-center">
                        {profileData?.profile_picture ? (
                            <img
                                src={profileData.profile_picture}
                                alt={`${profileData.first_name} profile`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-lg select-none">
                                {firstLetter}
                            </span>
                        )}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-white font-medium">
                            {profileData?.first_name} {profileData?.last_name}
                        </p>
                        <p className="text-white/60 text-xs">
                            Client
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
