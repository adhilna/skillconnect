import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/api';
import { AuthContext } from '../../../context/AuthContext';
import {
    Star,
    Clock,
    ExternalLink,
    Github,
    Linkedin,
    Globe,
    CheckCircle,
    XCircle,
    MapPin,
    Mail,
    Phone,
    Award,
    Briefcase,
    GraduationCap,
    Code,
    MessageCircle,
    UserPlus,
    Calendar,
    ArrowLeft,
    Users,
    TrendingUp,
    Eye,
} from 'lucide-react';

// Verification Badge Component
const VerificationBadge = ({ verified, label }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
        {verified ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
            <XCircle className="w-4 h-4 text-red-400" />
        )}
        <span className="text-sm font-medium text-white/90">{label}</span>
    </div>
);

// Section Card
const SectionCard = ({ children, className = '' }) => (
    <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 ${className}`}>
        {children}
    </div>
);

// Skill Tag
const SkillTag = ({ skill, variant = 'blue' }) => {
    const variants = {
        blue: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
        green: 'bg-green-500/20 text-green-200 border-green-400/40',
        purple: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]}`}>
            {skill}
        </span>
    );
};

// Action Button
const FloatingActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${primary
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/20'
            }`}
        aria-label={label}
    >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

const FreelancerProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "explore";
    const { token } = useContext(AuthContext);

    const [profile, setProfile] = useState(location.state?.freelancerProfileData || null);
    const [loading, setLoading] = useState(!profile);
    const [error, setError] = useState('');

    const handleBack = () => {
        if (from === "browse") {
            navigate("/client/dashboard", { state: { section: "browse" } });
        } else {
            navigate("/client/dashboard", { state: { section: "explore" } });
        }
    };

    useEffect(() => {
        if (!id || !token) return;

        if (!token) {
            setError('Authentication required');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/v1/profiles/freelancers/browse/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

    }, [id, token]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                    <div className="space-y-2">
                        <p className="text-white text-lg font-medium">Loading profile...</p>
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

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-white/40 text-5xl">👤</div>
                    <p className="text-white/60 text-lg">No profile data available</p>
                </div>
            </div>
        );
    }

    const {
        name,
        profile_picture,
        about,
        location: loc,
        age,
        country,
        educations_output: raw_educations_output,
        experiences_output: raw_experiences_output,
        skills: raw_skills,
        languages_output: raw_languages_output,
        portfolios_output: raw_portfolios_output,
        social_links_output: raw_social_links_output,
        verification_output: raw_verification_output,
        is_available,
    } = profile;

    // Convert null to empty array / object
    const educations_output = raw_educations_output || [];
    const experiences_output = raw_experiences_output || [];
    const skills = raw_skills || [];
    const languages_output = raw_languages_output || [];
    const portfolios_output = raw_portfolios_output || [];
    const social_links_output = raw_social_links_output || {};
    const verification_output = raw_verification_output || {};

// console.log("skills:", skills);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">
                            {from === "browse" ? "Back to Browse Talent" : "Back to Explore"}
                        </span>
                    </button>

                    <div className="flex items-center gap-2 text-white/60">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Profile View</span>
                    </div>
                </div>

                {/* Profile Header */}
                <SectionCard className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Profile Image */}
                        <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500">
                                {profile_picture ? (
                                    <img
                                        src={profile_picture}
                                        alt={`${name} Profile`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-2xl lg:text-3xl">
                                        {`${name?.[0] || ''}`}
                                    </span>
                                )}
                            </div>

                            {/* Status Indicator */}
                            <div
                                className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${is_available ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            >
                                <div
                                    className={`w-2 h-2 rounded-full ${is_available ? 'bg-green-700' : 'bg-red-700'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 min-w-0 space-y-4">
                            {/* Name and Verification */}
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                        {name}
                                    </h1>
                                    {verification_output?.email_verified && (
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/40">
                                            <CheckCircle className="text-green-400 w-4 h-4" />
                                            <span className="text-green-200 text-sm font-medium">Verified</span>
                                        </div>
                                    )}
                                </div>

                                {/* Availability Status */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20">
                                    <div
                                        className={`w-2 h-2 rounded-full ${is_available ? 'bg-green-400' : 'bg-red-400'
                                            }`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${is_available ? 'text-green-200' : 'text-red-200'
                                            }`}
                                    >
                                        {is_available ? 'Available for Work' : 'Currently Busy'}
                                    </span>
                                </div>
                            </div>

                            {/* Location and Details */}
                            <div className="flex flex-wrap items-center gap-4 text-white/70">
                                {loc && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{loc}</span>
                                    </div>
                                )}
                                {age !== undefined && age !== null && (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        <span className="text-sm">{age} years</span>
                                    </div>
                                )}
                                {country && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm">{country}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                <FloatingActionButton
                                    icon={MessageCircle}
                                    label="Send Message"
                                    onClick={() => alert('Message functionality coming soon!')}
                                    primary={true}
                                />
                                <FloatingActionButton
                                    icon={UserPlus}
                                    label="Follow"
                                    onClick={() => alert('Follow functionality coming soon!')}
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* About Section */}
                {about && (
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">About</h2>
                            </div>
                            <p className="text-white/80 leading-relaxed whitespace-pre-line">{about}</p>
                        </div>
                    </SectionCard>
                )}

                {/* Skills & Languages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Code className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Skills</h2>
                            </div>
                            {skills?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <SkillTag key={skill.id} skill={skill.name} variant="blue" />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 italic">No skills listed yet.</p>
                            )}
                        </div>
                    </SectionCard>

                    {/* Languages */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Languages</h2>
                            </div>
                            {languages_output?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {languages_output.map(lang => (
                                        <SkillTag
                                            key={lang.id}
                                            skill={`${lang.name} - ${lang.proficiency}`}
                                            variant="green"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 italic">No languages listed yet.</p>
                            )}
                        </div>
                    </SectionCard>
                </div>

                {/* Experience Section */}
                <SectionCard>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-white/60" />
                            <h2 className="text-xl font-semibold text-white">Experience</h2>
                        </div>
                        {experiences_output?.length ? (
                            <div className="space-y-6">
                                {experiences_output.map((exp, index) => (
                                    <div key={exp.id} className="relative">
                                        {/* Timeline line */}
                                        {index !== experiences_output.length - 1 && (
                                            <div className="absolute left-6 top-12 w-0.5 h-full bg-white/20"></div>
                                        )}

                                        <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-6 h-6 text-orange-400" />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                                                    <p className="text-blue-400 font-medium">{exp.company}</p>
                                                </div>

                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {exp.start_date?.slice(0, 10)} - {exp.end_date?.slice(0, 10) || 'Present'}
                                                    </span>
                                                </div>

                                                {exp.description && (
                                                    <p className="text-white/80 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                                )}

                                                {exp.certificate && (
                                                    <a
                                                        href={exp.certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-colors text-sm"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        View Certificate
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white/60 italic">No experience details available yet.</p>
                        )}
                    </div>
                </SectionCard>

                {/* Education Section */}
                <SectionCard>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-white/60" />
                            <h2 className="text-xl font-semibold text-white">Education</h2>
                        </div>
                        {educations_output?.length ? (
                            <div className="space-y-6">
                                {educations_output.map((edu, index) => (
                                    <div key={edu.id} className="relative">
                                        {/* Timeline line */}
                                        {index !== educations_output.length - 1 && (
                                            <div className="absolute left-6 top-12 w-0.5 h-full bg-white/20"></div>
                                        )}

                                        <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center flex-shrink-0">
                                                <GraduationCap className="w-6 h-6 text-indigo-400" />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                                                    <p className="text-purple-400 font-medium">{edu.college}</p>
                                                </div>

                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {edu.start_year} - {edu.end_year || 'Present'}
                                                    </span>
                                                </div>

                                                {edu.certificate && (
                                                    <a
                                                        href={edu.certificate}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/30 transition-colors text-sm"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        View Certificate
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white/60 italic">No education details available yet.</p>
                        )}
                    </div>
                </SectionCard>

                {/* Portfolio Section */}
                {portfolios_output?.length > 0 && (
                    <SectionCard>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Star className="w-5 h-5 text-white/60" />
                                <h2 className="text-xl font-semibold text-white">Portfolio</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {portfolios_output.map(portfolio => (
                                    <div key={portfolio.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-lg font-semibold text-white flex-1">{portfolio.title}</h3>
                                                {portfolio.link && (
                                                    <a
                                                        href={portfolio.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg bg-pink-500/20 border border-pink-400/40 text-pink-400 hover:bg-pink-500/30 transition-colors"
                                                        title={`Visit ${portfolio.title}`}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-white/80 leading-relaxed whitespace-pre-line">{portfolio.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>
                )}

                {/* Bottom Section: Social Links and Verifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Social Links */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-white/60" />
                                <h2 className="text-2xl font-semibold text-white">Social Links</h2>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                {social_links_output?.github_url && (
                                    <a
                                        href={social_links_output.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-colors"
                                        title="GitHub"
                                    >
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                                {social_links_output?.linkedin_url && (
                                    <a
                                        href={social_links_output.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                        title="LinkedIn"
                                    >
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                                {social_links_output?.website_url && (
                                    <a
                                        href={social_links_output.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20 border border-green-400/40 text-green-400 hover:bg-green-500/30 transition-colors"
                                        title="Website"
                                    >
                                        <Globe className="w-6 h-6" />
                                    </a>
                                )}
                                {!social_links_output?.github_url &&
                                    !social_links_output?.linkedin_url &&
                                    !social_links_output?.website_url && (
                                        <p className="text-white/60 italic">No social links available yet.</p>
                                    )}
                            </div>
                        </div>
                    </SectionCard>

                    {/* Verifications */}
                    <SectionCard>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-white/60" />
                                <h2 className="text-2xl font-semibold text-white">Verifications</h2>
                            </div>

                            {verification_output ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <VerificationBadge
                                        verified={verification_output.email_verified}
                                        label="Email"
                                    />
                                    <VerificationBadge
                                        verified={verification_output.phone_verified}
                                        label="Phone"
                                    />
                                    <VerificationBadge
                                        verified={verification_output.id_verified}
                                        label="ID"
                                    />
                                    <VerificationBadge
                                        verified={verification_output.video_verified}
                                        label="Video"
                                    />
                                </div>
                            ) : (
                                <p className="text-white/60 italic">No verification data available yet.</p>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfileView;
