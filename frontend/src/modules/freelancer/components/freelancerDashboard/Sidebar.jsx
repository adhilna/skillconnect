import React from 'react';
import { X, Plus } from 'lucide-react';

const text = "Skill+Connect";
const letters = text.split("").map((letter, i) => (
  <span
    key={i}
    style={{
      fontWeight: 900 - (i * (900 - 400) / (text.length - 1)),
      display: "inline-block",
      transition: "font-weight 0.5s ease-in-out",
    }}
  >
    {letter}
  </span>
));
const Sidebar = ({ sidebarOpen, setSidebarOpen, navigationItems, activeSection, setActiveSection }) => (
    <div className={`fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                {/* Logo with icon */}
                <div className="flex items-center space-x-2">
                    {/* Icon (lightning bolt example) */}
                    <svg
                        className="h-6 w-6 text-purple-400 animate-pulse" // Adjust size as needed
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                    {/* Gradient Text */}
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {letters}
                    </h1>
                </div>
                {/* Close button */}
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
