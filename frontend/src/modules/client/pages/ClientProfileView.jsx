import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { AuthContext } from '../../../context/AuthContext';
import {
    Building2,
    Globe,
    MapPin,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Eye,
    DollarSign,
    Clock,
    Calendar,
    Target,
    AlertTriangle,
    Briefcase,
    MessageSquare,
    CreditCard
} from 'lucide-react';

// Section Card Component
const SectionCard = ({ children, className = '' }) => (
    <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 ${className}`}>
        {children}
    </div>
);

// Tag Component for project types and other lists
const Tag = ({ children, variant = 'purple' }) => {
    const variants = {
        purple: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
        blue: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
        green: 'bg-green-500/20 text-green-200 border-green-400/40',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${variants[variant]}`}>
            {children}
        </span>
    );
};

// Info Grid Item Component
const InfoGridItem = ({ icon: Icon, label, value, variant = 'default' }) => {
    const variants = {
        default: 'bg-white/5 border-white/10',
        success: 'bg-green-500/10 border-green-400/20',
        warning: 'bg-yellow-500/10 border-yellow-400/20',
    };

    return (
        <div className={`p-4 rounded-lg border ${variants[variant]}`}>
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-white/60" />
                <h3 className="text-sm font-medium text-white/70">{label}</h3>
            </div>
            <p className="text-white font-semibold">{value || 'N/A'}</p>
        </div>
    );
};

const ClientProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id || !token) return;

        const fetchClientDetail = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/api/v1/profiles/clients/browse/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClient(response.data);
            } catch (err) {
                console.error('Error fetching client detail:', err);
                setError('Failed to load client profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchClientDetail();
    }, [id, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <div className="space-y-2">
                        <p className="text-white text-lg font-medium">Loading client profile...</p>
                        <p className="text-white/60">Please wait while we fetch the details</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-6 p-8">
                    <div className="text-red-500 text-6xl">⚠️</div>
                    <div className="space-y-2">
                        <p className="text-red-400 text-xl font-semibold">{error}</p>
                        <p className="text-white/60">Something went wrong while loading the profile</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-white/40 text-5xl">🏢</div>
                    <p className="text-white/60 text-lg">No client profile data available</p>
                </div>
            </div>
        );
    }

    const {
        company_name,
        profile_picture,
        company_description,
        account_type,
        business_goals,
        current_challenges,
        industry,
        location,
        country,
        website,
        monthly_budget,
        project_budget,
        payment_method,
        payment_timing,
        project_types,
        preferred_communications,
        budget_range,
        expected_timeline,
        working_hours,
    } = client;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back to Explore Clients</span>
                    </button>

                    <div className="flex items-center gap-2 text-white/60">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Client Profile View</span>
                    </div>
                </div>

                {/* Profile Header */}
                <SectionCard className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Company Logo */}
                        <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-2 border-white/20 bg-white/5 flex items-center justify-center">
                                {profile_picture ? (
                                    <img
                                        src={profile_picture}
                                        alt={`${company_name} logo`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <Building2 size={60} className="text-white/40" />
                                )}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0 space-y-4">
                            {/* Company name and type */}
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                        {company_name}
                                    </h1>
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40">
                                        <Building2 className="text-blue-400 w-4 h-4" />
                                        <span className="text-blue-200 text-sm font-medium">
                                            {account_type === 'business' ? 'Business Client' : 'Personal Client'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Location and Industry */}
                            <div className="flex flex-wrap items-center gap-4 text-white/70">
                                {location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{location}</span>
                                    </div>
                                )}
                                {country && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm">{country}</span>
                                    </div>
                                )}
                                {industry && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-sm">{industry}</span>
                                    </div>
                                )}
                            </div>

                            {/* Website */}
                            {website && (
                                <div className="pt-2">
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30 transition-colors text-sm"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionCard>

                {/* About Section */}
                {company_description && (
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">About Company</h2>
                            </div>
                            <p className="text-white/80 leading-relaxed whitespace-pre-line">{company_description}</p>
                        </div>
                    </SectionCard>
                )}

                {/* Budget & Timeline Grid */}
                <SectionCard>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-white/60" />
                            <h2 className="text-xl font-semibold text-white">Budget & Timeline</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <InfoGridItem
                                icon={DollarSign}
                                label="Monthly Budget"
                                value={monthly_budget ? `$${monthly_budget}` : null}
                                variant="success"
                            />
                            <InfoGridItem
                                icon={DollarSign}
                                label="Project Budget"
                                value={project_budget ? `$${project_budget}` : null}
                                variant="success"
                            />
                            <InfoGridItem
                                icon={DollarSign}
                                label="Budget Range"
                                value={budget_range}
                            />
                            <InfoGridItem
                                icon={Clock}
                                label="Expected Timeline"
                                value={expected_timeline}
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* Goals & Challenges Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Business Goals */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Target className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Business Goals</h2>
                            </div>
                            {business_goals?.length ? (
                                <div className="space-y-2">
                                    {business_goals.map((goal, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-white/80">{goal}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 italic">No business goals listed yet.</p>
                            )}
                        </div>
                    </SectionCard>

                    {/* Current Challenges */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Current Challenges</h2>
                            </div>
                            {current_challenges?.length ? (
                                <div className="space-y-2">
                                    {current_challenges.map((challenge, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-white/80">{challenge}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 italic">No current challenges listed yet.</p>
                            )}
                        </div>
                    </SectionCard>
                </div>

                {/* Project Types */}
                {project_types?.length > 0 && (
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Project Types</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project_types.map((type, idx) => (
                                    <Tag key={idx} variant="purple">
                                        {type}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </SectionCard>
                )}

                {/* Communications & Preferences */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Preferred Communications */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Preferred Communications</h2>
                            </div>
                            {preferred_communications?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {preferred_communications.map((comm, idx) => (
                                        <Tag key={idx} variant="blue">
                                            {comm}
                                        </Tag>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 italic">No communication preferences listed yet.</p>
                            )}
                        </div>
                    </SectionCard>

                    {/* Payment & Working Info */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Payment & Working Info</h2>
                            </div>
                            <div className="space-y-3">
                                <InfoGridItem
                                    icon={CreditCard}
                                    label="Payment Method"
                                    value={payment_method}
                                />
                                <InfoGridItem
                                    icon={Calendar}
                                    label="Payment Timing"
                                    value={payment_timing}
                                />
                                <InfoGridItem
                                    icon={Clock}
                                    label="Working Hours"
                                    value={working_hours}
                                />
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default ClientProfileView;