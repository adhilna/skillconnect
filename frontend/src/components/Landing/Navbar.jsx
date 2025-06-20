import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div onClick={() => window.location.href = '/'} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Skill+Connect
        </div>
        <div className="hidden md:flex space-x-6">
            <a href="/explore" className="hover:text-purple-300 transition-colors text-white">Explore</a>
            <a href="/how-it-works" className="hover:text-purple-300 transition-colors text-white">How it Works</a>
            <a href="/enterprise" className="hover:text-purple-300 transition-colors text-white">Enterprise</a>
        </div>
        <div className="space-x-4">
            <Link to="/login">
                <button className="hidden md:inline-block px-4 py-2 rounded-lg text-white hover:text-purple-300 transition-colors">
                    Log In
                </button>
            </Link>
            <Link to="/register">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all transform hover:scale-105">
                    Join Now
                </button>
            </Link>
        </div>
    </nav>
);