import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const SearchBar = ({ category, setCategory }) => {
    const [searchInput, setSearchInput] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const categories = ['Design', 'Development', 'Marketing', 'Writing', 'Video', 'Music', 'Business'];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`Searching for "${searchInput}" in ${category}`);
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setIsDropdownOpen(false);
    };

    return (
        <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl mt-12 bg-white rounded-full shadow-xl overflow-hidden flex items-center p-1.5">
            <div className="flex items-center border-r border-gray-300 px-4 py-2 relative">
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                    <span>{category}</span>
                    <ChevronDown size={16} className={`ml-2 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-full">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategorySelect(cat)}
                                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${cat === category ? 'bg-blue-50 text-blue-700' : ''
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for any service..."
                className="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
            />
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full flex items-center font-medium">
                <Search size={18} className="mr-2" />
                Search
            </button>
        </form>
    );
}