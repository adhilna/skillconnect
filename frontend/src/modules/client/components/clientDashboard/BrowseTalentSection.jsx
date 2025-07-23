import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, MapPin, Clock, ChevronDown, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';

// Mock data for demonstration - Replace with API call later
const mockFreelancers = [
    {
        id: 1,
        name: "Sarah Chen",
        title: "Senior Full Stack Developer",
        avatar: null,
        rating: 4.9,
        reviewCount: 127,
        hourlyRate: 85,
        location: "San Francisco, CA",
        skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
        bio: "Experienced full stack developer with 8+ years building scalable web applications for startups and enterprises.",
        availability: "Available"
    },
    {
        id: 2,
        name: "Marcus Rodriguez",
        title: "UI/UX Designer",
        avatar: null,
        rating: 4.8,
        reviewCount: 89,
        hourlyRate: 65,
        location: "Remote",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
        bio: "Creative designer passionate about crafting intuitive user experiences that drive business results.",
        availability: "Available"
    },
    {
        id: 3,
        name: "Emily Thompson",
        title: "Digital Marketing Specialist",
        avatar: null,
        rating: 4.7,
        reviewCount: 156,
        hourlyRate: 45,
        location: "Austin, TX",
        skills: ["SEO", "Google Ads", "Content Marketing", "Analytics", "Social Media"],
        bio: "Results-driven marketer helping businesses grow their online presence and generate quality leads.",
        availability: "Busy"
    },
    {
        id: 4,
        name: "David Kumar",
        title: "Mobile App Developer",
        avatar: null,
        rating: 4.9,
        reviewCount: 203,
        hourlyRate: 75,
        location: "New York, NY",
        skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
        bio: "Mobile development expert with 6+ years creating high-performance apps for iOS and Android.",
        availability: "Available"
    },
    {
        id: 5,
        name: "Lisa Park",
        title: "Data Scientist",
        avatar: null,
        rating: 4.8,
        reviewCount: 94,
        hourlyRate: 95,
        location: "Seattle, WA",
        skills: ["Python", "Machine Learning", "SQL", "Tableau", "TensorFlow"],
        bio: "Data scientist specializing in predictive analytics and machine learning solutions for business growth.",
        availability: "Available"
    },
    {
        id: 6,
        name: "James Wilson",
        title: "Backend Engineer",
        avatar: null,
        rating: 4.6,
        reviewCount: 78,
        hourlyRate: 70,
        location: "Remote",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
        bio: "Backend specialist focused on building robust, scalable server-side applications and APIs.",
        availability: "Available"
    }
];

const FreelancerCard = ({ freelancer, onViewProfile }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

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
        <div
            className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 cursor-pointer hover:bg-white/10 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* View Profile Button - Shows on Hover */}
            <div className={`absolute top-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(freelancer);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg flex items-center space-x-2 text-sm"
                >
                    <Eye size={14} />
                    <span>View Profile</span>
                </button>
            </div>

            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {getInitials(freelancer.name)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityDot(freelancer.availability)} rounded-full border-2 border-gray-900`}></div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{freelancer.name}</h3>
                        <p className="text-white/60 font-medium">{freelancer.title}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1">${freelancer.hourlyRate}<span className="text-lg text-white/60 font-normal">/hr</span></div>
                    <div className={`text-sm flex items-center justify-end ${getAvailabilityColor(freelancer.availability)}`}>
                        <Clock size={14} className="mr-1.5" />
                        {freelancer.availability}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current mr-2" />
                    <span className="text-white font-semibold text-lg">{freelancer.rating}</span>
                    <span className="text-white/50 ml-2">({freelancer.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-white/60">
                    <MapPin size={14} className="mr-1.5" />
                    {freelancer.location}
                </div>
            </div>

            <p className="text-white/70 leading-relaxed mb-6">{freelancer.bio}</p>

            <div className="flex flex-wrap gap-2">
                {freelancer.skills.slice(0, 4).map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-sm rounded-lg font-medium border border-blue-500/20"
                    >
                        {skill}
                    </span>
                ))}
                {freelancer.skills.length > 4 && (
                    <span className="px-3 py-1.5 text-white/50 text-sm font-medium">
                        +{freelancer.skills.length - 4} more
                    </span>
                )}
            </div>
        </div>
    );
};

const BrowseFreelancersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('rating');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        minRate: '',
        maxRate: '',
        skills: '',
        minRating: '',
        location: ''
    });

    const itemsPerPage = 6;

    // Apply search and filters to freelancers
    const filteredAndSortedFreelancers = useMemo(() => {
        let filtered = mockFreelancers.filter(freelancer => {
            // Search filter
            const searchMatch = !searchTerm ||
                freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                freelancer.bio.toLowerCase().includes(searchTerm.toLowerCase());

            // Rate filters
            const rateMatch = (!filters.minRate || freelancer.hourlyRate >= parseInt(filters.minRate)) &&
                (!filters.maxRate || freelancer.hourlyRate <= parseInt(filters.maxRate));

            // Skills filter
            const skillsMatch = !filters.skills ||
                freelancer.skills.some(skill =>
                    skill.toLowerCase().includes(filters.skills.toLowerCase())
                );

            // Rating filter
            const ratingMatch = !filters.minRating || freelancer.rating >= parseFloat(filters.minRating);

            // Location filter
            const locationMatch = !filters.location ||
                freelancer.location.toLowerCase().includes(filters.location.toLowerCase());

            return searchMatch && rateMatch && skillsMatch && ratingMatch && locationMatch;
        });

        // Apply sorting
        switch (sortOption) {
            case 'rating':
                return filtered.sort((a, b) => b.rating - a.rating);
            case 'rate_low':
                return filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
            case 'rate_high':
                return filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
            case 'newest':
                return filtered.sort((a, b) => b.id - a.id); // Assuming higher ID = newer
            default:
                return filtered;
        }
    }, [searchTerm, sortOption, filters]);

    const totalPages = Math.ceil(filteredAndSortedFreelancers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFreelancers = filteredAndSortedFreelancers.slice(startIndex, startIndex + itemsPerPage);

    const handleViewProfile = (freelancer) => {
        console.log('Navigate to freelancer profile:', freelancer.id);
        // TODO: Navigate to /freelancer/[id] or similar route
        // For now, just log the action
        alert(`Viewing profile for ${freelancer.name} (ID: ${freelancer.id})`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({
            minRate: '',
            maxRate: '',
            skills: '',
            minRating: '',
            location: ''
        });
        setSortOption('rating');
        setCurrentPage(1);
    };

    const applyFilters = () => {
        setShowFilters(false);
        setCurrentPage(1);
        // Filters are already applied via useMemo, this just closes the panel
    };

    const sortOptions = [
        { value: 'rating', label: 'Highest Rated' },
        { value: 'rate_low', label: 'Lowest Rate' },
        { value: 'rate_high', label: 'Highest Rate' },
        { value: 'newest', label: 'Newest Profiles' }
    ];

    // TODO: Replace with actual API call
    // useEffect(() => {
    //     const fetchFreelancers = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await fetch(`/api/freelancers/browse?page=${currentPage}&search=${searchTerm}&sort=${sortOption}&minRate=${filters.minRate}&maxRate=${filters.maxRate}&skills=${filters.skills}&minRating=${filters.minRating}&location=${filters.location}`);
    //             const data = await response.json();
    //             setFreelancers(data.results);
    //             setTotalPages(Math.ceil(data.count / itemsPerPage));
    //         } catch (error) {
    //             console.error('Error fetching freelancers:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchFreelancers();
    // }, [currentPage, searchTerm, sortOption, filters]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
            {/* Elegant Page Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-white mb-4">
                    Discover <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Exceptional</span> Talent
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                    Connect with world-class freelancers who bring your vision to life
                </p>
            </div>

            {/* Refined Search Section */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-grow relative">
                            <Search size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Search by name, skills, or expertise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="bg-white/10 text-white px-6 py-4 rounded-2xl font-medium hover:bg-white/20 transition-all duration-200 flex items-center space-x-3 border border-white/20 hover:border-white/30"
                            >
                                <Filter size={18} />
                                <span>Filters</span>
                            </button>

                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-white/10 text-white px-6 py-4 pr-12 rounded-2xl font-medium border border-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-200 text-lg"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value} className="bg-gray-800">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Filters Panel */}
            {showFilters && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold text-white">Refine Your Search</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-white/80 font-medium mb-3">Hourly Rate</label>
                                <div className="flex space-x-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minRate}
                                        onChange={(e) => handleFilterChange('minRate', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxRate}
                                        onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/80 font-medium mb-3">Skills</label>
                                <input
                                    type="text"
                                    placeholder="e.g. React, Design, Python"
                                    value={filters.skills}
                                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 font-medium mb-3">Minimum Rating</label>
                                <select
                                    value={filters.minRating}
                                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50"
                                >
                                    <option value="" className="bg-gray-800">Any Rating</option>
                                    <option value="4.8" className="bg-gray-800">4.8+ Stars</option>
                                    <option value="4.5" className="bg-gray-800">4.5+ Stars</option>
                                    <option value="4.0" className="bg-gray-800">4.0+ Stars</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/80 font-medium mb-3">Location</label>
                                <input
                                    type="text"
                                    placeholder="City, Country or Remote"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={clearAllFilters}
                                className="text-white/70 hover:text-white transition-colors font-medium"
                            >
                                Clear All Filters
                            </button>
                            <button
                                onClick={applyFilters}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Summary */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <p className="text-white/70 text-lg">
                        Showing <span className="text-white font-semibold">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedFreelancers.length)}</span> of <span className="text-white font-semibold">{filteredAndSortedFreelancers.length}</span> talented freelancers
                    </p>
                    <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
                        Post Project
                    </button>
                </div>
            </div>

            {/* Spacious Freelancer Cards Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                        <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-blue-400 opacity-20"></div>
                    </div>
                </div>
            ) : currentFreelancers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {currentFreelancers.map(freelancer => (
                        <FreelancerCard
                            key={freelancer.id}
                            freelancer={freelancer}
                            onViewProfile={handleViewProfile}
                        />
                    ))}
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-16 text-center">
                        <Search size={64} className="text-white/30 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-white mb-4">No freelancers found</h3>
                        <p className="text-white/70 text-lg mb-8 leading-relaxed">
                            We couldn&apos;t find any freelancers matching your criteria. Try adjusting your search or filters.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Elegant Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${page === currentPage
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrowseFreelancersPage;