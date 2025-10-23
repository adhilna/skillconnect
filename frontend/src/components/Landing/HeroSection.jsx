import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import { AvatarGrid } from './AvatarGrid';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';

const InitialsAvatar = ({ name = '', id = '', size = 64 }) => {
    // Compute initials (first 2 letters)
    const initials = name
        .split(' ')
        .map(str => str[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || `U${id}`;

    // Choose background colors programmatically, e.g. with tailwind or fixed set
    const bgColors = ['bg-indigo-700', 'bg-purple-700', 'bg-pink-700'];
    // Use id or initials to pick a color for variety
    const bgClass = bgColors[(id || initials.charCodeAt(0)) % bgColors.length];

    return (
        <div
            className={`${bgClass} flex items-center justify-center rounded-full`}
            style={{ width: size, height: size }}
        >
            <span
                className="text-white font-bold"
                style={{ fontSize: size / 2 }}
            >
                {initials}
            </span>
        </div>
    );
};

export const HeroSection = () => {
    const [heroIndex, setHeroIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const { token } = useContext(AuthContext);
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const navigate = useNavigate();


    const heroTexts = [
        {
            title: "Find the perfect freelance services for your business",
            subtitle: "Work with talented freelancers at the most affordable price"
        },
        {
            title: "Get work done faster, with confidence",
            subtitle: "Your payment is released only when you approve the work"
        },
        {
            title: "The best for every budget",
            subtitle: "Quality work done quickly across thousands of categories"
        }
    ];

    // const testimonials = [
    //     { user: "Sarah Chen", text: "Found my dream client in just 2 days!", role: "UI/UX Designer" },
    //     { user: "Marcus Johnson", text: "Tripled my income working here", role: "Web Developer" },
    //     { user: "Emily Rodriguez", text: "Best platform for creative professionals", role: "Content Writer" }
    // ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setHeroIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
                setIsVisible(true);
            }, 500);
        }, 5000);

        return () => clearTimeout(timer);
    }, [heroIndex]);

    // Fetch freelancers
    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoading(true);
            try {
                const res = await api.get('/api/v1/profiles/freelancers/browse/', {
                    params: {
                        page: 1,
                        page_size: 12,
                        ordering: '-created_at'
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                // Map to UI-friendly fields
                const data = (res.data.results || []).map(f => ({
                    id: f.id,
                    name: f.name,
                    title: f.title ?? 'Freelancer',
                    avatar: f.profile_picture,
                    projects: f.review_count ?? 0,
                    is_available: f.is_available,
                    bio: f.about ?? ''
                }));

                setFreelancers(data);
            } catch {
                setFreelancers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, [token]);

    // Fetch clients
    useEffect(() => {
        const fetchClients = async () => {
            setLoadingClients(true);
            try {
                const res = await api.get('/api/v1/profiles/clients/browse/', {
                    params: {
                        page: 1,
                        page_size: 8, // Only get 8 clients
                        ordering: '-created_at'
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                // Map to UI-friendly fields
                const mapped = (res.data.results || []).map(client => ({
                    id: client.id,
                    name: client.name,
                    avatar: client.logo || client.profile_picture, // Adjust as per your serializer/model
                    projects: client.completed_projects ?? 0
                }));
                setClients(mapped);
            } catch {
                setClients([]);
            } finally {
                setLoadingClients(false);
            }
        };
        fetchClients();
    }, [token]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-600">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                {/* Main Hero Content */}
                <div className="text-center mb-16">
                    <div className="h-48 flex items-center justify-center">
                        <div
                            className={`transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                {heroTexts[heroIndex].title}
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
                                {heroTexts[heroIndex].subtitle}
                            </p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <button
                            onClick={() => navigate("/register")}
                            className="group px-8 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-purple-500/50 hover:scale-105">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Avatar Grid with Stats */}
                <div className="relative">
                    {/* Badges: side by side on desktop, stacked on mobile */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
                        {/* Trusted Freelancers Badge */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                                <div className="flex -space-x-2">
                                    {freelancers.slice(0, 4).map((user, idx) => (
                                        <div key={user.id} style={{ zIndex: 4 - idx }} className="relative">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                />
                                            ) : (
                                                <InitialsAvatar name={user.name} id={user.id} size={32} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                        {freelancers.slice(0, 4).reduce((sum, user) => sum + (user.projects ?? 0), 0) || "Trusted freelancers"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trusted Clients Badge */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                                <div className="flex -space-x-2">
                                    {clients.slice(0, 4).map((client, idx) => (
                                        <div key={client.id} style={{ zIndex: 4 - idx }} className="relative">
                                            {client.avatar ? (
                                                <img
                                                    src={client.avatar}
                                                    alt={client.name}
                                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                                />
                                            ) : (
                                                <InitialsAvatar name={client.name} id={client.id} size={32} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                        {clients.slice(0, 4).reduce((sum, client) => sum + (client.projects ?? 0), 0) || "Trusted clients"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Optional headers for clarity */}
                    <h2 className="text-white font-bold text-lg mb-4">Top Freelancers</h2>
                    {/* Freelancer Grid */}
                    <AvatarGrid freelancers={freelancers} loading={loading} InitialsAvatar={InitialsAvatar} />

                    <h2 className="text-white font-bold text-lg mb-4 mt-10">Top Clients</h2>
                    {/* Client Grid */}
                    <AvatarGrid freelancers={clients} loading={loadingClients} InitialsAvatar={InitialsAvatar} />

                    {/* Rotating Testimonial */}
                    {/* <div className="mt-12 text-center">
                        <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 max-w-2xl">
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-white text-lg italic mb-2">
                                &quot;{testimonials[heroIndex % testimonials.length].text}&quot;
                            </p>
                            <p className="text-purple-300 text-sm">
                                — {testimonials[heroIndex % testimonials.length].user}, {testimonials[heroIndex % testimonials.length].role}
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}