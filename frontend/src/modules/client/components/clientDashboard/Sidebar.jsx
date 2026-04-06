import React from 'react';
import { X, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
const Sidebar = ({ sidebarOpen, setSidebarOpen, navigationItems }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine if a route is active
    const isActive = (itemId) => {
        const currentPath = location.pathname;
        // Dashboard is the index route
        if (itemId === 'dashboard') {
            return currentPath === '/client/dashboard' || currentPath === '/client/dashboard/';
        }
        return currentPath.includes(`/client/dashboard/${itemId}`);
    };

    const handleNavigation = (itemId) => {
        // Navigate to the correct route
        const path = itemId === 'dashboard' ? '' : itemId;
        navigate(`/client/dashboard/${path}`);

        // Always close sidebar on mobile after clicking
        setSidebarOpen(false);
    };

    return (
        <div className={`fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ClientHub
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.id);

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg border border-blue-500/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <button
                        onClick={() => handleNavigation('proposals')}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                    >
                        <Plus size={18} />
                        <span>Post New Project</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;