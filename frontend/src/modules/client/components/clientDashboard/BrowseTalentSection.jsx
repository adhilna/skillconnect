import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Star, MapPin, Clock,
    ChevronDown, ChevronLeft, ChevronRight, X, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FreelancerCard = ({ freelancer, onViewProfile }) => {
    const getInitials = (name) =>
        name?.split(' ').map(word => word[0]).join('').toUpperCase();

    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'Available': return 'text-emerald-400';
            case 'Busy': return 'text-amber-400';
            default: return 'text-gray-400';
        }
    };

    const getAvailabilityDot = (availability) => {
        switch (availability) {
            case 'Available': return 'bg-emerald-400';
            case 'Busy': return 'bg-amber-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 hover:bg-white/10 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="relative flex-shrink-0">
                        {freelancer.profile_picture ? (
                            <img
                                src={freelancer.profile_picture}
                                alt={freelancer.name}
                                className="w-16 h-16 rounded-xl object-cover shadow-lg ring-2 ring-white/10"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/10">
                                {getInitials(freelancer.name)}
                            </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityDot(freelancer.availability)} rounded-full border-2 border-gray-900 shadow-lg`} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-white mb-1 truncate">{freelancer.name}</h3>
                        <p className="text-white/60 text-sm truncate">{freelancer.title}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-2 w-full sm:w-auto">
                    <button
                        onClick={() => onViewProfile(freelancer)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm justify-center group-hover:scale-105"
                    >
                        <Eye size={14} />
                        <span>View Profile</span>
                    </button>
                    <div className={`text-sm flex items-center font-medium ${getAvailabilityColor(freelancer.availability)}`}>
                        <Clock size={14} className="mr-1.5" />
                        {freelancer.availability}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current mr-2" />
                    <span className="text-white font-semibold text-lg">{freelancer.rating ?? 0}</span>
                    <span className="text-white/50 ml-2 text-sm">({freelancer.reviewCount ?? 0} reviews)</span>
                </div>
                <div className="flex items-center text-white/60 text-sm">
                    <MapPin size={14} className="mr-1.5" />
                    <span className="truncate">{freelancer.location}</span>
                </div>
            </div>

            <p className="text-white/70 mb-4 text-sm line-clamp-2">{freelancer.bio}</p>

            <div className="flex flex-wrap gap-2">
                {(freelancer.skills || []).slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-lg font-medium border border-blue-500/20 hover:bg-blue-500/30 transition-colors">
                        {skill.name}
                    </span>
                ))}
                {freelancer.skills?.length > 4 && (
                    <span className="px-3 py-1.5 text-white/50 text-xs sm:text-sm font-medium bg-white/5 rounded-lg border border-white/10">
                        +{freelancer.skills.length - 4} more
                    </span>
                )}
            </div>
        </div>
    );
};

const BrowseTalentSection = ({ preloadedFreelancers = [], loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('rating');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [filters, setFilters] = useState({
        skills: '',
        minRating: '',
        location: ''
    });

    const navigate = useNavigate();

    const filteredFreelancers = useMemo(() => {
        return preloadedFreelancers.filter(f => {
            const name = f.name?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                name.includes(search) ||
                f.skills?.some(skill => skill.name.toLowerCase().includes(search));

            const matchesSkill = filters.skills
                ? f.skills?.some(skill => skill.name.toLowerCase().includes(filters.skills.toLowerCase()))
                : true;

            const matchesLocation = filters.location
                ? f.location?.toLowerCase().includes(filters.location.toLowerCase())
                : true;

            const matchesRating = filters.minRating
                ? parseFloat(f.rating || 0) >= parseFloat(filters.minRating)
                : true;

            return matchesSearch && matchesSkill && matchesLocation && matchesRating;
        });
    }, [preloadedFreelancers, searchTerm, filters]);

    const sortedFreelancers = useMemo(() => {
        const sorted = [...filteredFreelancers];
        if (sortOption === 'rating') {
            return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        } else if (sortOption === 'reviews') {
            return sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        } else {
            return sorted;
        }
    }, [filteredFreelancers, sortOption]);

    const totalPages = Math.ceil(sortedFreelancers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFreelancers = sortedFreelancers.slice(startIndex, startIndex + itemsPerPage);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({ skills: '', minRating: '', location: '' });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewProfile = (freelancer) => {
        navigate(`/freelancers/${freelancer.id}/view`, {
            state: {
                freelancerProfileData: freelancer,
                from: 'browse'
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-white">
                    Discover{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                        Exceptional
                    </span>{' '}
                    Talent
                </h1>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                    Browse pre-vetted freelancers tailored to your business success
                </p>
            </div>

            {/* Search and filters */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or skill..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-white/10 text-white py-3 px-4 pr-10 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="rating">Highest Rated</option>
                            <option value="reviews">Most Reviewed</option>
                            <option value="newest">Newest Profiles</option>
                        </select>
                    </div>

                    {/* Filters */}
                    <div className="mt-4 grid sm:grid-cols-3 gap-4">
                        <input
                            type="text"
                            value={filters.skills}
                            onChange={(e) => handleFilterChange('skills', e.target.value)}
                            placeholder="Filter by skills"
                            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                        />
                        <input
                            type="text"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            placeholder="Filter by location"
                            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                        />
                        <select
                            value={filters.minRating}
                            onChange={(e) => handleFilterChange('minRating', e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="">Any Rating</option>
                            <option value="4.8">4.8+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="4.0">4.0+ Stars</option>
                        </select>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={clearAllFilters}
                            className="text-white/70 hover:text-white underline text-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Result summary */}
            <div className="text-right text-white/60 text-sm">
                Showing {startIndex + 1}–{startIndex + paginatedFreelancers.length} of {sortedFreelancers.length} freelancers
            </div>

            {/* Cards */}
            {loading ? (
                <div className="text-center text-white">Loading...</div>
            ) : paginatedFreelancers.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {paginatedFreelancers.map((freelancer) => (
                        <FreelancerCard
                            key={freelancer.id}
                            freelancer={freelancer}
                            onViewProfile={handleViewProfile}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-white/60">No freelancers found.</div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 rounded-lg ${i + 1 === currentPage
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                : 'text-white bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrowseTalentSection;
