import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Star, MapPin, Clock,
    ChevronDown, ChevronLeft, ChevronRight, X, Eye
} from 'lucide-react';

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
        alert(`Viewing profile for ${freelancer.name} (ID: ${freelancer.id})`);
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














// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Star, MapPin, Clock, ChevronDown, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
// import api from '../../../../api/api';

// const FreelancerCard = ({ freelancer, onViewProfile }) => {
//     const getInitials = (name) => {
//         return name.split(' ').map(word => word[0]).join('').toUpperCase();
//     };

//     const getAvailabilityColor = (availability) => {
//         switch (availability) {
//             case 'Available': return 'text-emerald-400';
//             case 'Busy': return 'text-amber-400';
//             default: return 'text-gray-400';
//         }
//     };

//     const getAvailabilityDot = (availability) => {
//         switch (availability) {
//             case 'Available': return 'bg-emerald-400';
//             case 'Busy': return 'bg-amber-400';
//             default: return 'bg-gray-400';
//         }
//     };

//     return (
//         <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8 cursor-pointer hover:bg-white/10 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
//             <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
//                 <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
//                     <div className="relative flex-shrink-0">
//                         {freelancer.profile_picture ? (
//                             <img
//                                 src={freelancer.profile_picture}
//                                 alt={freelancer.name}
//                                 className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-lg"
//                             />
//                         ) : (
//                             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
//                                 {getInitials(freelancer.name)}
//                             </div>
//                         )}

//                         <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${getAvailabilityDot(freelancer.availability)} rounded-full border-2 border-gray-900`}></div>
//                     </div>
//                     <div className="flex-grow min-w-0">
//                         <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 truncate">{freelancer.name}</h3>
//                         <p className="text-white/60 font-medium text-sm sm:text-base">{freelancer.title}</p>
//                     </div>
//                 </div>

//                 {/* View Profile Button - Now in the hourly rate position */}
//                 <div className="flex flex-col items-end space-y-2 w-full sm:w-auto">
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             onViewProfile(freelancer);
//                         }}
//                         className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg flex items-center space-x-2 text-sm w-full sm:w-auto justify-center"
//                     >
//                         <Eye size={14} />
//                         <span>View Profile</span>
//                     </button>
//                     <div className={`text-sm flex items-center ${getAvailabilityColor(freelancer.availability)}`}>
//                         <Clock size={14} className="mr-1.5" />
//                         {freelancer.availability}
//                     </div>
//                 </div>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
//                 <div className="flex items-center">
//                     <Star size={16} className="text-yellow-400 fill-current mr-2" />
//                     <span className="text-white font-semibold text-base sm:text-lg">{freelancer.rating ?? 0}</span>
//                     <span className="text-white/50 ml-2 text-sm sm:text-base">({freelancer.reviewCount ?? 0} reviews)</span>
//                 </div>
//                 <div className="flex items-center text-white/60 text-sm sm:text-base">
//                     <MapPin size={14} className="mr-1.5 flex-shrink-0" />
//                     <span className="truncate">{freelancer.location}</span>
//                 </div>
//             </div>

//             <p className="text-white/70 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{freelancer.bio}</p>

//             {/* Skills display */}
//             <div className="flex flex-wrap gap-2">
//                 {(freelancer.skills || []).slice(0, 4).map((skill, index) => (
//                     <span
//                         key={index}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-lg font-medium border border-blue-500/20"
//                     >
//                         {skill.name}
//                     </span>
//                 ))}

//                 {/* Now safely check length */}
//                 {Array.isArray(freelancer.skills) && freelancer.skills.length > 4 && (
//                     <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-white/50 text-xs sm:text-sm font-medium">
//                         +{freelancer.skills.length - 4} more
//                     </span>
//                 )}
//             </div>

//         </div>
//     );
// };

// const BrowseTalentSection = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortOption, setSortOption] = useState('rating');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [showFilters, setShowFilters] = useState(false);
//     const [freelancers, setFreelancers] = useState([]);
//     const [totalResults, setTotalResults] = useState(0);
//     const [loading, setLoading] = useState(false);

//     // Filter states (removed hourly rate filters)
//     const [filters, setFilters] = useState({
//         skills: '',
//         minRating: '',
//         location: ''
//     });

//     const itemsPerPage = 6;
//     const start = (currentPage - 1) * itemsPerPage + 1;
//     const end = Array.isArray(freelancers) ? start + freelancers.length - 1 : 0;
//     const totalPages = Math.ceil((totalResults ?? 0) / itemsPerPage);
//     const currentFreelancers = freelancers;


//     const handleViewProfile = (freelancer) => {
//         console.log('Navigate to freelancer profile:', freelancer.id);
//         // TODO: Navigate to /freelancer/[id] or similar route
//         // For now, just log the action
//         alert(`Viewing profile for ${freelancer.name} (ID: ${freelancer.id})`);
//     };

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handleFilterChange = (filterName, value) => {
//         setFilters(prev => ({
//             ...prev,
//             [filterName]: value
//         }));
//         setCurrentPage(1); // Reset to first page when filters change
//     };

//     const clearAllFilters = () => {
//         setSearchTerm('');
//         setFilters({
//             skills: '',
//             minRating: '',
//             location: ''
//         });
//         setSortOption('rating');
//         setCurrentPage(1);
//     };

//     const applyFilters = () => {
//         setShowFilters(false);
//         setCurrentPage(1);
//         // Filters are already applied via useMemo, this just closes the panel
//     };

//     const sortOptions = [
//         { value: 'rating', label: 'Highest Rated' },
//         { value: 'reviews', label: 'Most Reviews' },
//         { value: 'newest', label: 'Newest Profiles' }
//     ];

//     useEffect(() => {
//         const fetchFreelancers = async () => {
//             setLoading(true);
//             try {
//                 const res = await api.get('/api/v1/profiles/freelancers/browse/', {
//                     params: {
//                         page: currentPage,
//                         search: searchTerm || undefined,
//                         skills__name: filters.skills || undefined,
//                         location: filters.location || undefined,
//                         is_available: filters.availability === 'Available' ? true :
//                             filters.availability === 'Busy' ? false : undefined,
//                         ordering: sortOption === 'newest' ? '-created_at' : undefined,
//                     }
//                 });

//                 // Use results array and count from paginated response
//                 const results = Array.isArray(res.data.results) ? res.data.results : [];
//                 const transformedResults = results.map(freelancer => ({
//                     ...freelancer,
//                     reviewCount: freelancer.review_count ?? 0,
//                     bio: freelancer.about ?? '',
//                     availability: freelancer.is_available ? 'Available' : 'Busy',
//                     skills: freelancer.skills || []
//                 }));

//                 setFreelancers(transformedResults);
//                 setTotalResults(res.data.count ?? transformedResults.length);

//             } catch (error) {
//                 console.error('Error fetching freelancers:', error);
//                 setFreelancers([]);
//                 setTotalResults(0);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchFreelancers();
//     }, [currentPage, filters, searchTerm, sortOption]);


//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
//             {/* Elegant Page Header */}
//             <div className="text-center space-y-4">
//                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
//                     Discover <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Exceptional</span> Talent
//                 </h1>
//                 <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed px-4">
//                     Connect with world-class freelancers who bring your vision to life
//                 </p>
//             </div>

//             {/* Refined Search Section */}
//             <div className="max-w-4xl mx-auto">
//                 <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl">
//                     <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
//                         <div className="flex-grow relative">
//                             <Search size={20} className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
//                             <input
//                                 type="text"
//                                 placeholder="Search by name, skills, or expertise..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-200"
//                             />
//                         </div>

//                         <div className="flex gap-3 sm:gap-4">
//                             <button
//                                 onClick={() => setShowFilters(!showFilters)}
//                                 className="bg-white/10 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium hover:bg-white/20 transition-all duration-200 flex items-center space-x-2 sm:space-x-3 border border-white/20 hover:border-white/30 flex-1 sm:flex-none justify-center"
//                             >
//                                 <Filter size={16} sm:size={18} />
//                                 <span className="text-sm sm:text-base">Filters</span>
//                             </button>

//                             <div className="relative flex-1 sm:flex-none">
//                                 <select
//                                     value={sortOption}
//                                     onChange={(e) => setSortOption(e.target.value)}
//                                     className="appearance-none bg-white/10 text-white px-4 sm:px-6 py-3 sm:py-4 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl font-medium border border-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-200 text-sm sm:text-lg w-full"
//                                 >
//                                     {sortOptions.map(option => (
//                                         <option key={option.value} value={option.value} className="bg-gray-800">
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown size={16} className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Collapsible Filters Panel */}
//             {showFilters && (
//                 <div className="max-w-4xl mx-auto">
//                     <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8">
//                         <div className="flex items-center justify-between mb-4 sm:mb-6">
//                             <h3 className="text-xl sm:text-2xl font-semibold text-white">Refine Your Search</h3>
//                             <button
//                                 onClick={() => setShowFilters(false)}
//                                 className="text-white/60 hover:text-white transition-colors p-1"
//                             >
//                                 <X size={20} sm:size={24} />
//                             </button>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                             <div>
//                                 <label className="block text-white/80 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Skills</label>
//                                 <input
//                                     type="text"
//                                     placeholder="e.g. React, Design, Python"
//                                     value={filters.skills}
//                                     onChange={(e) => handleFilterChange('skills', e.target.value)}
//                                     className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 text-sm sm:text-base"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-white/80 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Minimum Rating</label>
//                                 <select
//                                     value={filters.minRating}
//                                     onChange={(e) => handleFilterChange('minRating', e.target.value)}
//                                     className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-blue-400/50 text-sm sm:text-base"
//                                 >
//                                     <option value="" className="bg-gray-800">Any Rating</option>
//                                     <option value="4.8" className="bg-gray-800">4.8+ Stars</option>
//                                     <option value="4.5" className="bg-gray-800">4.5+ Stars</option>
//                                     <option value="4.0" className="bg-gray-800">4.0+ Stars</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-white/80 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Location</label>
//                                 <input
//                                     type="text"
//                                     placeholder="City, Country or Remote"
//                                     value={filters.location}
//                                     onChange={(e) => handleFilterChange('location', e.target.value)}
//                                     className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 text-sm sm:text-base"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-4 sm:space-y-0">
//                             <button
//                                 onClick={clearAllFilters}
//                                 className="text-white/70 hover:text-white transition-colors font-medium text-sm sm:text-base"
//                             >
//                                 Clear All Filters
//                             </button>
//                             <button
//                                 onClick={applyFilters}
//                                 className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg text-sm sm:text-base w-full sm:w-auto"
//                             >
//                                 Apply Filters
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Results Summary */}
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
//                     <p className="text-white/70 text-base sm:text-lg">
//                         {loading
//                             ? "Loading freelancers..."
//                             : `Showing ${start}-${end} of ${totalResults} talented freelancers`}
//                     </p>

//                     <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg text-sm sm:text-base w-full sm:w-auto">
//                         Post Project
//                     </button>
//                 </div>
//             </div>


//             {/* Spacious Freelancer Cards Grid */}
//             {loading ? (
//                 <div className="flex justify-center items-center h-64 sm:h-96">
//                     <div className="relative">
//                         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-500"></div>
//                         <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 sm:h-16 sm:w-16 border border-blue-400 opacity-20"></div>
//                     </div>
//                 </div>
//             ) : Array.isArray(currentFreelancers) && currentFreelancers.length > 0 ? (
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
//                     {currentFreelancers.map(freelancer => (
//                         <FreelancerCard
//                             key={freelancer.id}
//                             freelancer={freelancer}
//                             onViewProfile={handleViewProfile}
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <div className="max-w-2xl mx-auto">
//                     <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/10 p-8 sm:p-12 lg:p-16 text-center">
//                         <Search size={48} className="text-white/30 mx-auto mb-4 sm:mb-6 sm:w-16 sm:h-16" />
//                         <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">No freelancers found</h3>
//                         <p className="text-white/70 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
//                             We couldn&apos;t find any freelancers matching your criteria. Try adjusting your search or filters.
//                         </p>
//                         <button
//                             onClick={clearAllFilters}
//                             className="bg-blue-500 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg text-sm sm:text-base w-full sm:w-auto"
//                         >
//                             Clear All Filters
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Elegant Pagination */}
//             {totalPages > 1 && (
//                 <div className="flex justify-center items-center space-x-2 sm:space-x-4 pt-6 sm:pt-8">
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="p-2 sm:p-3 bg-white/10 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
//                     >
//                         <ChevronLeft size={18} sm:size={20} />
//                     </button>

//                     <div className="flex space-x-1 sm:space-x-2 overflow-x-auto max-w-xs sm:max-w-none">
//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                             <button
//                                 key={page}
//                                 onClick={() => handlePageChange(page)}
//                                 className={`px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base flex-shrink-0 ${page === currentPage
//                                     ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
//                                     : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
//                                     }`}
//                             >
//                                 {page}
//                             </button>
//                         ))}
//                     </div>

//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 sm:p-3 bg-white/10 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
//                     >
//                         <ChevronRight size={18} sm:size={20} />
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BrowseTalentSection;