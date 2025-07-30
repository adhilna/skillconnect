import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import useNotificationsWebSocket from './useNotificationsWebSocket';

const NotificationDropdown = ({ onNotificationClick }) => {
    const notifications = useNotificationsWebSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [viewedNotifications, setViewedNotifications] = useState(new Set());
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Mark notifications as viewed when dropdown opens
    useEffect(() => {
        if (isOpen) {
            const newViewedIds = new Set([...viewedNotifications, ...notifications.map(n => n.id)]);
            setViewedNotifications(newViewedIds);
        }
    }, [isOpen, notifications]);

    // Format created_at date nicely
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const unviewedCount = notifications.filter(n => !viewedNotifications.has(n.id)).length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group p-3 text-white/80 hover:text-white rounded-xl 
                          backdrop-blur-md bg-white/10 hover:bg-white/20 
                          border border-white/20 hover:border-white/30
                          transition-all duration-300 ease-out
                          shadow-lg hover:shadow-xl
                          transform hover:scale-105 active:scale-95"
                aria-label="Toggle notifications"
            >
                <Bell size={20} className="transition-transform duration-200 group-hover:rotate-12" />

                {/* Notification Badge with Pulse Animation */}
                {unviewedCount > 0 && (
                    <div className="absolute -top-2 -right-2 flex items-center justify-center">
                        <span className="relative inline-flex">
                            <span className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 
                                           rounded-full flex items-center justify-center text-xs font-bold text-white
                                           shadow-lg border-2 border-white/30">
                                {unviewedCount > 99 ? '99+' : unviewedCount}
                            </span>
                            {/* Pulsing Ring Animation */}
                            <span className="absolute top-0 left-0 w-6 h-6 bg-red-400/50 rounded-full 
                                           animate-ping opacity-75"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[32rem] 
                               backdrop-blur-xl bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-indigo-900/95
                               border border-blue-400/30 rounded-2xl 
                               shadow-2xl shadow-purple-900/50
                               z-50 overflow-hidden
                               animate-in slide-in-from-top-2 duration-200">

                    {/* Glass Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-blue-300/5 to-transparent 
                                   pointer-events-none rounded-2xl"></div>

                    {/* Header */}
                    <div className="relative flex justify-between items-center px-6 py-4 
                                   border-b border-purple-400/30 bg-purple-800/40">
                        <h3 className="text-white font-semibold text-lg tracking-wide drop-shadow-sm">
                            Notifications
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close notifications"
                            className="text-white/60 hover:text-white transition-all duration-200
                                     p-1.5 hover:bg-white/10 rounded-lg transform hover:scale-110"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="relative overflow-y-auto max-h-80 scrollbar-thin scrollbar-track-transparent 
                                   scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-white/60 mb-2">
                                    <Bell size={32} className="mx-auto opacity-70" />
                                </div>
                                <p className="text-white/80 text-sm font-medium">No new notifications</p>
                            </div>
                        ) : (
                            <ul className="py-2">
                                {notifications.map((notif) => {
                                    const isNew = !viewedNotifications.has(notif.id);
                                    return (
                                        <li
                                            key={notif.id}
                                            className="relative mx-2 mb-2 px-4 py-3 
                                                     backdrop-blur-md bg-white/10 hover:bg-white/20
                                                     border border-white/20 hover:border-white/40
                                                     rounded-xl cursor-pointer 
                                                     transition-all duration-300 ease-out
                                                     transform hover:translate-x-1 hover:shadow-lg
                                                     group shadow-lg"
                                            onClick={() => {
                                                if (onNotificationClick) onNotificationClick(notif);
                                                setIsOpen(false); // close dropdown after click
                                            }}
                                        >
                                            {/* Glass effect overlay for message box */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 
                                                           rounded-xl pointer-events-none opacity-80"></div>

                                            {/* New Notification Indicator */}
                                            {isNew && (
                                                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2
                                                               w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 
                                                               rounded-full shadow-lg animate-pulse z-10"></div>
                                            )}

                                            {/* Content */}
                                            <div className="relative space-y-1 z-10">
                                                <p className="text-white font-medium text-sm leading-tight line-clamp-2
                                                             group-hover:text-white transition-colors drop-shadow-sm">
                                                    {notif.title || notif.text || 'Notification'}
                                                </p>

                                                {(notif.client || notif.status) && (
                                                    <p className="text-white/90 text-xs leading-relaxed line-clamp-1">
                                                        {notif.client && (
                                                            <span className="inline-flex items-center px-2 py-0.5 
                                                                           bg-white/25 backdrop-blur-sm text-white rounded-md mr-2 font-medium
                                                                           border border-white/20">
                                                                {notif.client}
                                                            </span>
                                                        )}
                                                        {notif.status && (
                                                            <span className={`inline-flex items-center px-2 py-0.5 
                                                                           rounded-md text-xs font-medium capitalize backdrop-blur-sm
                                                                           ${notif.status === 'completed' ? 'bg-green-500/40 text-green-100 border border-green-400/40' :
                                                                    notif.status === 'pending' ? 'bg-yellow-500/40 text-yellow-100 border border-yellow-400/40' :
                                                                        notif.status === 'failed' ? 'bg-red-500/40 text-red-100 border border-red-400/40' :
                                                                            'bg-blue-500/40 text-blue-100 border border-blue-400/40'}`}>
                                                                {notif.status}
                                                            </span>
                                                        )}
                                                    </p>
                                                )}

                                                <p className="text-white/80 text-xs font-medium">
                                                    {formatDate(notif.created_at)}
                                                </p>
                                            </div>

                                            {/* Hover Glow Effect */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r 
                                                           from-purple-500/10 via-pink-500/10 to-cyan-500/10 
                                                           opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                                           pointer-events-none"></div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Footer Gradient */}
                    {notifications.length > 0 && (
                        <div className="h-4 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;