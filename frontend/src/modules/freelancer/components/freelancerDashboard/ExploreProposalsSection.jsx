import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplyProposalModal from './ApplyProposalModal'
import {
    Search, Filter, Star, Clock, DollarSign, ChevronDown, Grid, List,
    ChevronLeft, ChevronRight, Eye, ExternalLink
} from 'lucide-react';
import api from '../../../../api/api';
import { AuthContext } from '../../../../context/AuthContext';

// ProposalCard mirrors ServiceCard but adapted fields for proposal
// ProposalCard component updated to match your API payload structure
const ProposalCard = ({ proposal, onViewClient, onApplyProposal }) => {
    return (
        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 relative">
            {proposal.is_featured && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full z-20">
                    Featured
                </div>
            )}

            <div className="relative h-48 sm:h-56 lg:h-48 overflow-hidden">
                {/* Since proposals don't have image field in your payload, using placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 flex items-center justify-center text-white">
                    <div className="text-center p-4">
                        <div className="text-3xl font-bold mb-2">{proposal.category?.name || 'Project'}</div>
                        <div className="text-sm opacity-80">
                            {proposal.is_urgent && (
                                <span className="bg-red-500/80 px-2 py-1 rounded-full text-xs font-semibold mr-2">
                                    URGENT
                                </span>
                            )}
                            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                {proposal.project_scope?.toUpperCase() || 'PROJECT'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="flex flex-col sm:flex-row gap-3 px-4">
                        <button
                            onClick={() => onApplyProposal(proposal)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm hover:scale-105 min-w-[120px]"
                        >
                            <ExternalLink size={16} />
                            <span>Apply Now</span>
                        </button>
                        <button
                            onClick={() => onViewClient(proposal.client)}
                            className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm border border-white/20 hover:border-white/40 hover:scale-105 min-w-[120px]"
                        >
                            <Eye size={16} />
                            <span>View Client</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-shrink-0">
                        {proposal.client?.profile_picture ? (
                            <img
                                src={proposal.client.profile_picture}
                                alt={proposal.client.name || 'Client'}
                                className="w-8 h-8 rounded-full border-2 border-blue-400/30"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {(proposal.client?.name || 'C').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <span className="text-white/70 text-sm truncate flex-1">
                        {proposal.client?.name || 'Anonymous Client'}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white/80 text-sm">{proposal.client?.rating || '-'}</span>
                        <span className="text-white/50 text-xs">({proposal.client?.review_count || '0'})</span>
                    </div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                    {proposal.title}
                </h3>

                <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {proposal.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {proposal.skills_output?.slice(0, 3).map(skill => (
                        <span
                            key={skill.id}
                            className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-400/30 font-medium"
                        >
                            {skill.name}
                        </span>
                    ))}
                    {proposal.skills_output?.length > 3 && (
                        <span className="text-white/50 text-xs px-2 py-1 font-medium">
                            +{proposal.skills_output.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-white/70">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{proposal.timeline_days || 'N/A'} days</span>
                        </div>
                        <div className="text-white/50 text-xs bg-white/10 px-2 py-1 rounded-full">
                            {proposal.category?.name || 'Uncategorized'}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>${proposal.budget_min} - ${proposal.budget_max}</span>
                    </div>
                </div>

                {/* Additional info row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${proposal.status === 'open' ? 'bg-green-400' :
                                proposal.status === 'closed' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                        <span className="text-white/60 text-xs capitalize">{proposal.status}</span>
                    </div>
                    <div className="text-white/50 text-xs">
                        {proposal.project_scope && (
                            <span className="capitalize">{proposal.project_scope}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const fallbackCategories = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "Mobile Development" },
    { id: 3, name: "Writing & Translation" },
    { id: 4, name: "Design & Creative" },
    { id: 5, name: "Digital Marketing" },
    { id: 6, name: "Programming & Tech" },
    { id: 7, name: "Business" },
    { id: 8, name: "Lifestyle" },
    { id: 9, name: "Data Science & AI" },
    { id: 10, name: "Video & Animation" },
    { id: 11, name: "Music & Audio" },
    { id: 12, name: "Finance & Accounting" },
    { id: 13, name: "Engineering & Architecture" },
    { id: 14, name: "Education & Training" },
    { id: 15, name: "Legal" }
];

const ExploreProposalsSection = () => {
    const { token } = useContext(AuthContext);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('-created_at');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const itemsPerPage = 9;

    const [filters, setFilters] = useState({
        category: '',
        minBudget: '',
        maxBudget: '',
        deliveryTime: '',
        skills: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setCategories(fallbackCategories);
            return;
        }

        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await api.get('/api/v1/core/categories/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status !== 200) {
                    setCategories(fallbackCategories);
                    return;
                }

                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategories(fallbackCategories);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [token]);

    const sortOptions = [
        { value: '-created_at', label: 'Newest First' },
        { value: 'created_at', label: 'Oldest First' },
        { value: 'budget', label: 'Budget: Low to High' },
        { value: '-budget', label: 'Budget: High to Low' },
        { value: 'delivery_time', label: 'Fastest Delivery' },
        { value: '-delivery_time', label: 'Longest Delivery' }
    ];

    // Build query params for API call
    const buildQueryParams = useCallback(() => {
        const params = {
            page: currentPage,
            ordering: sortOption,
        };
        if (searchTerm && searchTerm.trim() !== '') {
            params.search = searchTerm.trim();
        }
        if (filters.category && filters.category !== '') {
            params.category = filters.category;
        }
        if (filters.minBudget && filters.minBudget !== '') {
            params.min_budget = filters.minBudget;
        }
        if (filters.maxBudget && filters.maxBudget !== '') {
            params.max_budget = filters.maxBudget;
        }
        if (filters.deliveryTime && filters.deliveryTime !== '') {
            params.delivery_time = filters.deliveryTime;
        }
        if (filters.skills && filters.skills.trim() !== '') {
            params.skills = filters.skills.trim();
        }
        return params;
    }, [currentPage, sortOption, searchTerm, filters]);

    useEffect(() => {
        if (!token) return;

        const fetchProposals = async () => {
            setLoading(true);
            try {
                const params = buildQueryParams();

                const response = await api.get('/api/v1/gigs/explore-proposals/', {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProposals(response.data.results || []);
                setTotalPages(Math.ceil(response.data.count / itemsPerPage));
            } catch (error) {
                console.error('Failed to fetch proposals:', error);
                setProposals([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [token, buildQueryParams]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({
            category: '',
            minBudget: '',
            maxBudget: '',
            deliveryTime: '',
            skills: ''
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewClient = (client) => {
        navigate(`/clients/${client.id}/view`, { state: { clientProfileData: client } });
    };

    const handleApplyProposal = (proposal) => {
        setSelectedProposal(proposal);
        setApplyModalVisible(true);
    };

    const handleCancelApply = () => {
        setSelectedProposal(null);
        setApplyModalVisible(false);
    };

    const handleSendApply = async (message) => {
        if (!selectedProposal || !token) return;

        try {
            const response = await api.post(
                '/api/v1/proposals/applications/',
                {
                    proposal_id: selectedProposal.id,
                    message: message,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('Applied successfully!', response);
            setSelectedProposal(null);
            setApplyModalVisible(false);
        } catch (error) {
            console.error('Apply error:', error.response?.data);
            const detail =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0];

            if (detail && detail.toLowerCase().includes('already have an active application')) {
                alert('You already have an active application for this proposal.');
            } else {
                alert('Failed to apply. Please try again.');
            }

            setSelectedProposal(null);
            setApplyModalVisible(false);
        }
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 mb-8 max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                        Explore <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Proposals</span>
                    </h2>
                    <p className="text-white/80 max-w-3xl mx-auto text-base sm:text-lg px-4">
                        Discover client job proposals that match your skills and preferences
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 sm:mb-8 space-y-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 shadow-xl">
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-full lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search proposals..."
                                value={searchTerm}
                                onChange={e => handleSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all text-sm sm:text-base"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative min-w-0 lg:min-w-[180px]">
                            <select
                                value={filters.category}
                                onChange={e => handleFilterChange('category', e.target.value)}
                                className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white pr-10 focus:outline-none focus:border-blue-400 focus:bg-white/20"
                            >
                                <option value="">All Categories</option>
                                {categoriesLoading ? (
                                    <option disabled>Loading categories...</option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative min-w-0 lg:min-w-[180px]">
                            <select
                                value={sortOption}
                                onChange={e => { setSortOption(e.target.value); setCurrentPage(1); }}
                                className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white pr-10 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all text-sm sm:text-base"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-gray-800">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-white/10 rounded-xl p-1 border border-white/20 self-center">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all self-center"
                        >
                            <Filter className="w-5 h-5" />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Min Budget</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={filters.minBudget}
                                        onChange={e => handleFilterChange('minBudget', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Max Budget</label>
                                    <input
                                        type="number"
                                        placeholder="10000"
                                        value={filters.maxBudget}
                                        onChange={e => handleFilterChange('maxBudget', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Max Delivery Days</label>
                                    <select
                                        value={filters.deliveryTime}
                                        onChange={e => handleFilterChange('deliveryTime', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 text-sm"
                                    >
                                        <option value="">Any</option>
                                        <option value="1" className="bg-gray-800">1 Day</option>
                                        <option value="3" className="bg-gray-800">3 Days</option>
                                        <option value="7" className="bg-gray-800">7 Days</option>
                                        <option value="14" className="bg-gray-800">14 Days</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Skills</label>
                                    <input
                                        type="text"
                                        placeholder="Filter by skills"
                                        value={filters.skills}
                                        onChange={e => handleFilterChange('skills', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={clearAllFilters}
                                    className="text-white/70 hover:text-white underline text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                <p className="text-white/70 text-sm">
                    {loading
                        ? 'Loading...'
                        : `Showing ${startItem}–${endItem} of ${totalPages * itemsPerPage} proposals`}
                </p>
            </div>

            {/* Proposals Grid/List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                </div>
            ) : proposals.length > 0 ? (
                <div className={`${viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8'
                    : 'space-y-6'
                    }`}>
                    {proposals.map(proposal => (
                        <ProposalCard
                            key={proposal.id}
                            proposal={proposal}
                            onViewClient={handleViewClient}
                            onApplyProposal={handleApplyProposal}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">No proposals found</h3>
                    <p className="text-white/60">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-8 flex-wrap">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg transition-all ${pageNum === currentPage
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                    : 'text-white bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            <ApplyProposalModal
                proposal={selectedProposal}
                visible={applyModalVisible}
                onCancel={handleCancelApply}
                onSubmit={handleSendApply}
            />
        </div>
    );
};

export default ExploreProposalsSection;
