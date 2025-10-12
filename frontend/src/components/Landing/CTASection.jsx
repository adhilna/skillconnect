import React from 'react';
import { Link } from 'react-router-dom';

export const CTASection = () => (
    <div className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-lg text-purple-200 mb-8">Join thousands of businesses finding the perfect talent for their projects</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                    <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all transform hover:scale-105 text-lg">
                        Sign Up For Free
                    </button>
                </Link>
                <Link to='/how-it-works'>
                <button className="px-8 py-3 rounded-lg border border-purple-400 hover:bg-white/10 font-medium transition-all text-lg">
                    Learn How It Works
                </button>
                </Link>
            </div>
        </div>
    </div>
);