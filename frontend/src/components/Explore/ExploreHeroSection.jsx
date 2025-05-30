import React from 'react';
import { Search } from 'lucide-react';

export const ExploreHeroSection = ({ searchInput, setSearchInput, selectedCategory, setSelectedCategory }) => {
    const categories = [
        'All', 'Design', 'Development', 'Marketing', 'Writing', 'Video', 'Music', 'Business', 'Translation', 'AI Services'
    ];

    return (
        <div className="relative z-10 px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Explore Amazing Services
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Discover thousands of talented freelancers ready to bring your vision to life
            </p>

            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-2">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search for services..."
                            className="w-full pl-12 pr-4 py-3 bg-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:bg-white/30 transition-all"
                        />
                    </div>
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 bg-white/20 rounded-xl text-white focus:outline-none focus:bg-white/30 transition-all"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-indigo-900">{cat}</option>
                        ))}
                    </select>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};
