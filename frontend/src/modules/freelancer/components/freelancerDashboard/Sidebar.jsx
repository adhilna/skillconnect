import React from 'react';
import { X, Plus } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, navigationItems, activeSection, setActiveSection }) => (
    <div className={`fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FreelanceHub</h1>
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
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeSection === item.id
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg border border-purple-500/30'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Icon size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{item.label}</span>
                            {item.id === 'messages' && (
                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                            )}
                            {item.id === 'orders' && (
                                <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                            )}
                        </button>
                    );
                })}
            </nav>
            <div className="mt-8 pt-6 border-t border-white/10">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
                    <Plus size={18} />
                    <span>Create New Gig</span>
                </button>
            </div>
        </div>
    </div>
);

export default Sidebar;
