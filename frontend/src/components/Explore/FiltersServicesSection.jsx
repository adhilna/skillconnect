import { Filter, Grid, List } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export const ServicesSection = ({ 
    filteredServices, 
    favorites, 
    toggleFavorite, 
    priceRange, 
    setPriceRange, 
    sortBy, 
    setSortBy, 
    viewMode, 
    setViewMode 
}) => {
    const priceRanges = [
        { value: 'all', label: 'All Prices' },
        { value: '5-25', label: '$5 - $25' },
        { value: '25-100', label: '$25 - $100' },
        { value: '100-500', label: '$100 - $500' },
        { value: '500+', label: '$500+' }
    ];

    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'newest', label: 'Newest' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' }
    ];

    return (
        <div className="relative z-10 px-6 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Filter Bar */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                <Filter size={16} className="mr-2" />
                                Filters
                            </button>
                            
                            <select 
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="px-4 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:bg-white/30"
                            >
                                {priceRanges.map(range => (
                                    <option key={range.value} value={range.value} className="bg-indigo-900">
                                        {range.label}
                                    </option>
                                ))}
                            </select>
                            
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:bg-white/30"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value} className="bg-indigo-900">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-purple-300">{filteredServices.length} services found</span>
                            <div className="flex bg-white/20 rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500' : 'hover:bg-white/30'} transition-colors`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-500' : 'hover:bg-white/30'} transition-colors`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid/List */}
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
                    {filteredServices.map(service => (
                        <ServiceCard 
                            key={service.id} 
                            service={service} 
                            isGridView={viewMode === 'grid'}
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                        Load More Services
                    </button>
                </div>
            </div>
        </div>
    );
};
