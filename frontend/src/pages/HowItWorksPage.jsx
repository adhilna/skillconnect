import React, { useState, useEffect } from 'react';
import {
    Search,
    MessageCircle,
    CreditCard,
    Star,
    User,
    CheckCircle,
    Shield,
    Clock,
    Users,
    Briefcase,
    ChevronRight,
    Play,
    ArrowRight,
    Zap,
    Globe,
    DollarSign,
    Calendar,
    Award,
    Camera,
    FileText,
    Bell,
    Sparkles,
    TrendingUp,
    Target,
    Rocket
} from 'lucide-react';
import { Navbar } from '../components/Landing/Navbar';
import { useNavigate } from "react-router-dom";

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl top-1/4 -right-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
        <div className="absolute w-72 h-72 rounded-full bg-pink-500 opacity-8 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute w-56 h-56 rounded-full bg-cyan-500 opacity-8 blur-3xl bottom-1/4 -left-10 animate-pulse"></div>
        <div className="absolute w-88 h-88 rounded-full bg-violet-500 opacity-8 blur-3xl top-10 right-1/4 animate-pulse"></div>
    </div>
);

const FloatingCard = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            {children}
        </div>
    );
};

const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return count;
};

const HowItWorksPage = () => {
    const [activeTab, setActiveTab] = useState('client');
    const [activeStep, setActiveStep] = useState(0);
    const [hoveredFeature, setHoveredFeature] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % (activeTab === 'client' ? 6 : 6));
        }, 4000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const clientSteps = [
        {
            icon: <Search size={32} />,
            title: "Search & Browse",
            description: "Find skilled professionals by category, location, or specific skills",
            details: "Browse through thousands of verified freelancers and skilled workers. Use filters to find exactly what you need - from web developers to local plumbers.",
            time: "2 minutes",
            color: "from-emerald-500 to-teal-500"
        },
        {
            icon: <MessageCircle size={32} />,
            title: "Connect & Discuss",
            description: "Chat with professionals to discuss your project requirements",
            details: "Use our real-time messaging system to discuss project details, timelines, and expectations. Get quotes and clarify any questions before hiring.",
            time: "5-10 minutes",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Calendar size={32} />,
            title: "Book & Schedule",
            description: "Choose your preferred time and confirm the booking",
            details: "Select from available time slots, agree on project scope, and confirm your booking. Receive instant confirmation with all project details.",
            time: "3 minutes",
            color: "from-purple-500 to-violet-500"
        },
        {
            icon: <CreditCard size={32} />,
            title: "Secure Payment",
            description: "Pay securely with payment protection guarantee",
            details: "Make secure payments through our platform. Your money is protected until you approve the completed work. Multiple payment options available.",
            time: "1 minute",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: <CheckCircle size={32} />,
            title: "Work Completion",
            description: "Track progress and approve completed work",
            details: "Monitor project progress, communicate with your freelancer, and approve deliverables when satisfied. Your payment is released automatically.",
            time: "Project duration",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <Star size={32} />,
            title: "Rate & Review",
            description: "Leave feedback to help other clients",
            details: "Share your experience by rating and reviewing the freelancer. Your feedback helps maintain quality standards and assists other clients.",
            time: "2 minutes",
            color: "from-yellow-500 to-orange-500"
        }
    ];

    const freelancerSteps = [
        {
            icon: <User size={32} />,
            title: "Create Profile",
            description: "Build your professional profile with skills and portfolio",
            details: "Showcase your expertise, upload portfolio samples, set your rates, and highlight your experience to attract potential clients.",
            time: "15 minutes",
            color: "from-indigo-500 to-purple-500"
        },
        {
            icon: <Shield size={32} />,
            title: "Get Verified",
            description: "Complete verification process for trust and credibility",
            details: "Upload identification documents, verify your skills through our assessment system, and get your profile verified for increased visibility.",
            time: "24-48 hours",
            color: "from-green-500 to-teal-500"
        },
        {
            icon: <Bell size={32} />,
            title: "Receive Requests",
            description: "Get notified about relevant project opportunities",
            details: "Receive notifications when clients post projects matching your skills. Browse available jobs and submit proposals for projects you're interested in.",
            time: "Ongoing",
            color: "from-pink-500 to-rose-500"
        },
        {
            icon: <MessageCircle size={32} />,
            title: "Communicate",
            description: "Discuss project details with potential clients",
            details: "Chat with clients to understand their requirements, provide quotes, and answer questions. Build trust through clear communication.",
            time: "Variable",
            color: "from-blue-500 to-indigo-500"
        },
        {
            icon: <Briefcase size={32} />,
            title: "Deliver Work",
            description: "Complete projects and deliver quality results",
            details: "Work on approved projects, maintain regular communication, and deliver high-quality results within agreed timelines.",
            time: "Project duration",
            color: "from-violet-500 to-purple-500"
        },
        {
            icon: <DollarSign size={32} />,
            title: "Get Paid",
            description: "Receive secure payments upon project completion",
            details: "Get paid automatically when clients approve your work. Payments are processed securely with transparent fee structure.",
            time: "Instant",
            color: "from-emerald-500 to-green-500"
        }
    ];

    const features = [
        {
            icon: <Shield size={28} />,
            title: "Payment Protection",
            description: "Your money is safe until you approve the work",
            benefit: "100% Secure",
            color: "from-green-400 to-emerald-500"
        },
        {
            icon: <Clock size={28} />,
            title: "24/7 Support",
            description: "Round-the-clock customer support for all users",
            benefit: "Always Available",
            color: "from-blue-400 to-cyan-500"
        },
        {
            icon: <Star size={28} />,
            title: "Quality Assurance",
            description: "All freelancers are verified and rated by clients",
            benefit: "Top Talent",
            color: "from-yellow-400 to-orange-500"
        },
        {
            icon: <Globe size={28} />,
            title: "Global Reach",
            description: "Connect with talent from around the world",
            benefit: "Worldwide Access",
            color: "from-purple-400 to-pink-500"
        },
        {
            icon: <Zap size={28} />,
            title: "Fast Delivery",
            description: "Get your projects completed quickly and efficiently",
            benefit: "Lightning Fast",
            color: "from-indigo-400 to-purple-500"
        },
        {
            icon: <Users size={28} />,
            title: "Trusted Community",
            description: "Join thousands of satisfied clients and freelancers",
            benefit: "Proven Track Record",
            color: "from-rose-400 to-pink-500"
        }
    ];

    const stats = [
        { number: 50000, suffix: "+", label: "Active Freelancers", icon: <Users size={24} /> },
        { number: 100000, suffix: "+", label: "Projects Completed", icon: <CheckCircle size={24} /> },
        { number: 95, suffix: "%", label: "Client Satisfaction", icon: <Star size={24} /> },
        { number: 24, suffix: "/7", label: "Support Available", icon: <Clock size={24} /> }
    ];

    const currentSteps = activeTab === 'client' ? clientSteps : freelancerSteps;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <BackgroundBlobs />
            <Navbar />

            <div className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header */}
                    <FloatingCard>
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-full px-6 py-2 border border-purple-400/30 mb-6">
                                <Sparkles size={20} className="text-purple-400" />
                                <span className="text-purple-200 font-medium">How It Works</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                                Your Journey to Success
                                <br />
                                <span className="text-3xl md:text-4xl lg:text-5xl">Starts Here</span>
                            </h2>
                            <p className="text-lg md:text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                                Whether you&apos;re looking to hire skilled professionals or offer your services,
                                our platform makes it simple, secure, and extraordinarily efficient.
                            </p>
                        </div>
                    </FloatingCard>

                    {/* Enhanced Tab Navigation */}
                    <FloatingCard delay={200}>
                        <div className="flex justify-center mb-16">
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-3 border border-white/20 shadow-2xl">
                                <div className="flex space-x-3"> {/* Add this flex container */}
                                    <button
                                        onClick={() => setActiveTab('client')}
                                        className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${activeTab === 'client'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl transform scale-105'
                                            : 'text-purple-200 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Target size={20} />
                                        I&apos;m a Client
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('freelancer')}
                                        className={`px-10 py-4 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${activeTab === 'freelancer'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl transform scale-105'
                                            : 'text-purple-200 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Rocket size={20} />
                                        I&apos;m a Freelancer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FloatingCard>


                    {/* Enhanced Steps Timeline */}
                    <FloatingCard delay={400}>
                        <div className="mb-24">
                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Steps List */}
                                <div className="space-y-6">
                                    {currentSteps.map((step, index) => (
                                        <div
                                            key={index}
                                            className={`group relative flex items-start space-x-6 p-8 rounded-3xl cursor-pointer transition-all duration-500 transform hover:scale-102 ${activeStep === index
                                                ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-2 border-purple-400/50 shadow-2xl'
                                                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                                                }`}
                                            onClick={() => setActiveStep(index)}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className={`relative z-10 flex-shrink-0 p-4 rounded-2xl transition-all duration-500 ${activeStep === index
                                                ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                                                : 'bg-white/10 text-purple-300 group-hover:bg-white/20'
                                                }`}>
                                                {step.icon}
                                            </div>

                                            <div className="relative z-10 flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-100">
                                                        {step.title}
                                                    </h3>
                                                    <span className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${activeStep === index
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-white/10 text-purple-300'
                                                        }`}>
                                                        {step.time}
                                                    </span>
                                                </div>
                                                <p className="text-purple-200 mb-3 group-hover:text-purple-100">
                                                    {step.description}
                                                </p>
                                                <div className={`overflow-hidden transition-all duration-500 ${activeStep === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}>
                                                    <p className="text-sm text-purple-300 leading-relaxed pt-2 border-t border-white/10">
                                                        {step.details}
                                                    </p>
                                                </div>
                                            </div>

                                            <ChevronRight
                                                size={24}
                                                className={`relative z-10 text-purple-400 transition-all duration-500 ${activeStep === index ? 'rotate-90 text-white' : 'group-hover:text-purple-300'
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Enhanced Visual Representation */}
                                <div className="sticky top-8">
                                    <div className="bg-white/5 backdrop-blur-xl rounded-4xl p-10 border border-white/10 shadow-2xl">
                                        <div className="text-center">
                                            <div className={`w-32 h-32 bg-gradient-to-r ${currentSteps[activeStep].color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-500`}>
                                                <div className="text-white transform scale-150">
                                                    {currentSteps[activeStep].icon}
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-6">
                                                {currentSteps[activeStep].title}
                                            </h3>
                                            <p className="text-purple-200 mb-8 text-lg leading-relaxed">
                                                {currentSteps[activeStep].details}
                                            </p>
                                            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Clock size={20} className="text-purple-400" />
                                                    <p className="text-purple-300 font-semibold">
                                                        Time Required: {currentSteps[activeStep].time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FloatingCard>

                    {/* Enhanced Features Grid */}
                    <FloatingCard delay={600}>
                        <div className="mb-24">
                            <div className="text-center mb-16">
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Why Choose SkillConnect?
                                </h3>
                                <p className="text-lg text-purple-200 max-w-3xl mx-auto">
                                    Experience the difference with our cutting-edge platform features
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                                        onMouseEnter={() => setHoveredFeature(index)}
                                        onMouseLeave={() => setHoveredFeature(null)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className={`relative z-10 p-4 rounded-2xl mb-6 bg-gradient-to-r ${feature.color} inline-block shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                                            <div className="text-white">
                                                {feature.icon}
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xl font-bold text-white group-hover:text-purple-100">
                                                    {feature.title}
                                                </h4>
                                                <span className="text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30">
                                                    {feature.benefit}
                                                </span>
                                            </div>
                                            <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                                                {feature.description}
                                            </p>
                                        </div>

                                        <div className={`absolute bottom-4 right-4 transform transition-all duration-300 ${hoveredFeature === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                                            }`}>
                                            <ArrowRight size={20} className="text-purple-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FloatingCard>

                    {/* Enhanced Stats Section */}
                    <FloatingCard delay={800}>
                        <div className="mb-24">
                            <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-4xl p-12 border border-purple-400/30 shadow-2xl">
                                <div className="text-center mb-12">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                        Trusted by Thousands Worldwide
                                    </h3>
                                    <p className="text-purple-200">Real numbers, real success stories</p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center group">
                                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 group-hover:bg-white/15 transition-all duration-300 transform group-hover:scale-105">
                                                <div className="text-purple-400 mb-3 flex justify-center">
                                                    {stat.icon}
                                                </div>
                                                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                                    <AnimatedCounter end={stat.number} />{stat.suffix}
                                                </div>
                                                <div className="text-purple-200 font-medium">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FloatingCard>

                    {/* Enhanced Process Flow */}
                    <FloatingCard delay={1000}>
                        <div className="mb-24">
                            <div className="text-center mb-16">
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    The Complete Journey
                                </h3>
                                <p className="text-lg text-purple-200 max-w-3xl mx-auto">
                                    From discovery to success - every step optimized for your experience
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl rounded-4xl p-12 border border-white/10 shadow-2xl">
                                <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-8">
                                    <div className="text-center flex-1 group">
                                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                                            <Search size={28} className="text-white" />
                                        </div>
                                        <h4 className="font-bold text-white mb-2 text-lg">Discover</h4>
                                        <p className="text-sm text-purple-200">Find the perfect talent</p>
                                    </div>

                                    <div className="hidden lg:block">
                                        <ArrowRight className="text-purple-400 animate-pulse" size={28} />
                                    </div>

                                    <div className="text-center flex-1 group">
                                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                                            <MessageCircle size={28} className="text-white" />
                                        </div>
                                        <h4 className="font-bold text-white mb-2 text-lg">Connect</h4>
                                        <p className="text-sm text-purple-200">Discuss & negotiate</p>
                                    </div>

                                    <div className="hidden lg:block">
                                        <ArrowRight className="text-purple-400 animate-pulse" size={28} />
                                    </div>

                                    <div className="text-center flex-1 group">
                                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                                            <Briefcase size={28} className="text-white" />
                                        </div>
                                        <h4 className="font-bold text-white mb-2 text-lg">Collaborate</h4>
                                        <p className="text-sm text-purple-200">Work seamlessly</p>
                                    </div>

                                    <div className="hidden lg:block">
                                        <ArrowRight className="text-purple-400 animate-pulse" size={28} />
                                    </div>

                                    <div className="text-center flex-1 group">
                                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                                            <Award size={28} className="text-white" />
                                        </div>
                                        <h4 className="font-bold text-white mb-2 text-lg">Succeed</h4>
                                        <p className="text-sm text-purple-200">Achieve excellence</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FloatingCard>

                    {/* Enhanced CTA Section */}
                    <FloatingCard delay={1200}>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-4xl p-16 border border-purple-400/30 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-lg rounded-full px-6 py-3 border border-purple-400/40 mb-8">
                                        <Sparkles size={20} className="text-purple-300" />
                                        <span className="text-purple-200 font-medium">Ready to Transform Your Future?</span>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                        Join the Revolution
                                    </h3>
                                    <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                                        Be part of a thriving community where talent meets opportunity.
                                        Your success story starts with a single click.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                        <button
                                            onClick={() => navigate("/register")}
                                            className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3">
                                            <Target size={20} />
                                            Get Started as Client
                                            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                        <button
                                            onClick={() => navigate("/register")}
                                            className="group px-10 py-5 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-lg flex items-center gap-3">
                                            <Rocket size={20} />
                                            Join as Freelancer
                                            <TrendingUp size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-purple-300">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            <span>Free to join</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} />
                                            <span>100% Secure</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>24/7 Support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;