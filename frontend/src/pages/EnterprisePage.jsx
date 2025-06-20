import React, { useState, useEffect } from 'react';
import {
    Shield,
    Users,
    Clock,
    Award,
    Zap,
    Globe,
    CheckCircle,
    Star,
    TrendingUp,
    Briefcase,
    ArrowRight,
    Play,
    Sparkles,
    Target,
    Lock,
    Database,
    Headphones,
    Settings,
    BarChart3,
    FileCheck,
    UserCheck,
    Layers,
    Phone,
    Mail,
    Calendar,
    Building2,
    Rocket,
    Workflow,
    PieChart,
    Search,
    Filter,
    MessageSquare
} from 'lucide-react';
import { Navbar } from '../components/Landing/Navbar';

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-blue-600 opacity-8 blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-600 opacity-10 blur-3xl top-1/3 -right-16 animate-pulse"></div>
        <div className="absolute w-72 h-72 rounded-full bg-indigo-600 opacity-8 blur-3xl bottom-20 left-1/4 animate-pulse"></div>
        <div className="absolute w-64 h-64 rounded-full bg-cyan-600 opacity-8 blur-3xl top-2/3 right-1/3 animate-pulse"></div>
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

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
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

    return `${count}${suffix}`;
};

const EnterpriseFeatureCard = ({ icon, title, description, features, color, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <FloatingCard delay={delay}>
            <div
                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className={`relative z-10 p-4 rounded-2xl mb-6 bg-gradient-to-r ${color} inline-block shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <div className="text-white text-3xl">
                        {icon}
                    </div>
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {description}
                    </p>
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-200 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`absolute bottom-6 right-6 transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                    }`}>
                    <ArrowRight size={20} className="text-blue-400" />
                </div>
            </div>
        </FloatingCard>
    );
};

const EnterprisePage = () => {
    // const [activeTab, setActiveTab] = useState('overview');
    const [hoveredStat, setHoveredStat] = useState(null);

    const enterpriseFeatures = [
        {
            icon: <Workflow />,
            title: "Managed Hiring & Onboarding",
            description: "Streamline your talent acquisition process with our comprehensive managed hiring solutions.",
            features: [
                "Automated candidate screening and vetting",
                "Custom onboarding workflows and checklists",
                "Bulk hiring capabilities for large teams",
                "Dedicated account manager for hiring support",
                "Integration with existing HR systems",
                "Custom approval workflows"
            ],
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Shield />,
            title: "Compliance & Security",
            description: "Enterprise-grade security and compliance features to protect your business and data.",
            features: [
                "SOC 2 Type II compliance certification",
                "GDPR and data privacy compliance",
                "Advanced encryption and secure data storage",
                "Role-based access control (RBAC)",
                "Audit trails and compliance reporting",
                "Background checks and identity verification"
            ],
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <UserCheck />,
            title: "Access to Vetted Talent",
            description: "Connect with pre-screened, enterprise-ready professionals across all skill categories.",
            features: [
                "Multi-tier vetting process for all professionals",
                "Skill assessments and certifications",
                "Performance tracking and ratings",
                "Specialized talent pools for enterprise needs",
                "Priority access to top-rated professionals",
                "Custom talent matching algorithms"
            ],
            color: "from-purple-500 to-violet-500"
        },
        {
            icon: <Layers />,
            title: "Scalability & Flexibility",
            description: "Scale your workforce up or down based on business needs with flexible engagement models.",
            features: [
                "Unlimited user accounts and team management",
                "Flexible pricing models (per-project, hourly, retainer)",
                "Multi-location and global workforce support",
                "Custom integrations and API access",
                "White-label solutions available",
                "Scalable infrastructure for high-volume usage"
            ],
            color: "from-orange-500 to-red-500"
        },
        {
            icon: <Headphones />,
            title: "Dedicated Support & Tools",
            description: "Premium support and advanced tools designed specifically for enterprise customers.",
            features: [
                "24/7 dedicated customer success manager",
                "Priority technical support with SLA guarantees",
                "Advanced analytics and reporting dashboard",
                "Custom integrations and API development",
                "Training sessions and onboarding support",
                "Regular business reviews and optimization"
            ],
            color: "from-indigo-500 to-purple-500"
        }
    ];

    const enterpriseStats = [
        { number: 500, suffix: "+", label: "Enterprise Clients", description: "Global companies trust SkillConnect" },
        { number: 99.9, suffix: "%", label: "Uptime SLA", description: "Guaranteed platform availability" },
        { number: 95, suffix: "%", label: "Client Retention", description: "Long-term partnership success" },
        { number: 50, suffix: "K+", label: "Vetted Professionals", description: "Ready for enterprise projects" }
    ];

    const integrations = [
        { name: "Slack", logo: "💬", description: "Team communication" },
        { name: "Microsoft Teams", logo: "👥", description: "Collaboration platform" },
        { name: "Jira", logo: "🎯", description: "Project management" },
        { name: "Salesforce", logo: "☁️", description: "CRM integration" },
        { name: "SAP", logo: "📊", description: "Enterprise resource planning" },
        { name: "Workday", logo: "💼", description: "HR management system" }
    ];

    const testimonials = [
        {
            quote: "SkillConnect has transformed how we scale our development teams. The quality of talent and speed of hiring is unmatched.",
            author: "Sarah Chen",
            position: "CTO, TechCorp",
            company: "Fortune 500 Technology Company"
        },
        {
            quote: "The compliance features and security standards give us complete peace of mind when working with external talent.",
            author: "Michael Rodriguez",
            position: "Head of Operations",
            company: "Global Financial Services"
        },
        {
            quote: "Our dedicated account manager understands our business needs and consistently delivers exceptional talent matches.",
            author: "Emily Johnson",
            position: "VP of Engineering",
            company: "Healthcare Innovation Leader"
        }
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/90 to-slate-900">
            <BackgroundBlobs />
            <Navbar />

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard>
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-full px-6 py-3 border border-blue-400/30 mb-8">
                                    <Building2 size={20} className="text-blue-400" />
                                    <span className="text-blue-200 font-semibold">Enterprise Solutions</span>
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                                    Scale Your Business
                                    <br />
                                    <span className="text-4xl md:text-5xl lg:text-6xl">with Enterprise-Grade Talent</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                                    Empower your organization with managed hiring, vetted professionals,
                                    enterprise security, and dedicated support. Transform how you access and manage talent.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                    <button className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3">
                                        <Rocket size={20} />
                                        Schedule Enterprise Demo
                                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                    <button className="group px-10 py-5 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-lg flex items-center gap-3">
                                        <Phone size={20} />
                                        Speak with Sales
                                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </FloatingCard>

                        {/* Enterprise Stats */}
                        <FloatingCard delay={200}>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                                {enterpriseStats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="text-center group cursor-pointer"
                                        onMouseEnter={() => setHoveredStat(index)}
                                        onMouseLeave={() => setHoveredStat(null)}
                                    >
                                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 transform group-hover:scale-105">
                                            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                                <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                                            </div>
                                            <div className="text-white font-semibold mb-2">
                                                {stat.label}
                                            </div>
                                            <div className={`text-sm text-gray-400 transition-all duration-300 ${hoveredStat === index ? 'opacity-100' : 'opacity-70'
                                                }`}>
                                                {stat.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FloatingCard>
                    </div>
                </div>

                {/* Enterprise Features Section */}
                <div className="px-6 py-20 bg-gradient-to-r from-slate-900/80 to-blue-900/50">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard delay={400}>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Enterprise-Grade Solutions
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Everything your enterprise needs to succeed, built with security, scalability, and efficiency in mind.
                                </p>
                            </div>
                        </FloatingCard>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
                            {enterpriseFeatures.slice(0, 3).map((feature, index) => (
                                <EnterpriseFeatureCard
                                    key={index}
                                    {...feature}
                                    delay={600 + index * 200}
                                />
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {enterpriseFeatures.slice(3).map((feature, index) => (
                                <EnterpriseFeatureCard
                                    key={index + 3}
                                    {...feature}
                                    delay={1200 + index * 200}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Integration & Tools Section */}
                <div className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard delay={1600}>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Seamless Integrations
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Connect SkillConnect with your existing enterprise tools and workflows for maximum efficiency.
                                </p>
                            </div>
                        </FloatingCard>

                        <FloatingCard delay={1800}>
                            <div className="bg-white/5 backdrop-blur-xl rounded-4xl p-12 border border-white/10 shadow-2xl mb-20">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                                    {integrations.map((integration, index) => (
                                        <div key={index} className="text-center group cursor-pointer">
                                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300 transform group-hover:scale-105 mb-4">
                                                <div className="text-4xl mb-3">{integration.logo}</div>
                                                <h4 className="font-semibold text-white text-sm">{integration.name}</h4>
                                            </div>
                                            <p className="text-xs text-gray-400">{integration.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-12">
                                    <button className="group px-8 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white rounded-xl font-semibold border border-blue-400/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center gap-3 mx-auto">
                                        <Settings size={20} />
                                        View All Integrations
                                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </div>

                {/* Client Success Stories */}
                <div className="px-6 py-20 bg-gradient-to-r from-slate-900/80 to-blue-900/50">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard delay={2000}>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Trusted by Industry Leaders
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    See how enterprise clients are transforming their businesses with SkillConnect.
                                </p>
                            </div>
                        </FloatingCard>

                        <div className="grid lg:grid-cols-3 gap-8 mb-20">
                            {testimonials.map((testimonial, index) => (
                                <FloatingCard key={index} delay={2200 + index * 200}>
                                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 h-full">
                                        <div className="flex items-center mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <blockquote className="text-gray-200 mb-6 italic leading-relaxed">
                                            &quot;{testimonial.quote}&quot;
                                        </blockquote>
                                        <div>
                                            <div className="font-semibold text-white">{testimonial.author}</div>
                                            <div className="text-sm text-blue-400">{testimonial.position}</div>
                                            <div className="text-sm text-gray-400">{testimonial.company}</div>
                                        </div>
                                    </div>
                                </FloatingCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enterprise Features Deep Dive */}
                <div className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard delay={2800}>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Advanced Enterprise Features
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Discover the advanced capabilities that set SkillConnect Enterprise apart.
                                </p>
                            </div>
                        </FloatingCard>

                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                            <FloatingCard delay={3000}>
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-6">Advanced Analytics & Reporting</h3>
                                    <p className="text-gray-300 mb-8 leading-relaxed">
                                        Get deep insights into your talent acquisition process, project performance,
                                        and workforce analytics with our comprehensive reporting suite.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center space-x-3">
                                            <BarChart3 size={20} className="text-blue-400" />
                                            <span className="text-gray-200">Real-time performance dashboards</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <PieChart size={20} className="text-purple-400" />
                                            <span className="text-gray-200">Custom report generation</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <TrendingUp size={20} className="text-green-400" />
                                            <span className="text-gray-200">Workforce optimization insights</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Target size={20} className="text-orange-400" />
                                            <span className="text-gray-200">KPI tracking and alerts</span>
                                        </li>
                                    </ul>
                                </div>
                            </FloatingCard>

                            <FloatingCard delay={3200}>
                                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white mb-2">
                                                <AnimatedCounter end={89} suffix="%" />
                                            </div>
                                            <div className="text-sm text-gray-300">Faster Hiring</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white mb-2">
                                                <AnimatedCounter end={67} suffix="%" />
                                            </div>
                                            <div className="text-sm text-gray-300">Cost Reduction</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white mb-2">
                                                <AnimatedCounter end={94} suffix="%" />
                                            </div>
                                            <div className="text-sm text-gray-300">Quality Match</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white mb-2">
                                                <AnimatedCounter end={24} suffix="/7" />
                                            </div>
                                            <div className="text-sm text-gray-300">Support</div>
                                        </div>
                                    </div>
                                </div>
                            </FloatingCard>
                        </div>
                    </div>
                </div>

                {/* Pricing Plans Teaser */}
                <div className="px-6 py-20 bg-gradient-to-r from-slate-900/80 to-blue-900/50">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard delay={3400}>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Enterprise Pricing Plans
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Flexible pricing options designed to scale with your business needs.
                                </p>
                            </div>
                        </FloatingCard>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {['Professional', 'Enterprise', 'Enterprise Plus'].map((plan, index) => (
                                <FloatingCard key={index} delay={3600 + index * 200}>
                                    <div className={`bg-white/5 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 transform hover:scale-105 ${index === 1 ? 'border-blue-400/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'border-white/10 hover:border-white/20'
                                        }`}>
                                        {index === 1 && (
                                            <div className="text-center mb-4">
                                                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold text-white mb-4">{plan}</h3>
                                            <div className="text-gray-300 mb-8">
                                                Custom pricing based on your specific needs and scale
                                            </div>
                                            <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${index === 1
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                                }`}>
                                                Contact Sales
                                            </button>
                                        </div>
                                    </div>
                                </FloatingCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <FloatingCard delay={4200}>
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-xl rounded-4xl p-16 border border-blue-400/30 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>

                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-lg rounded-full px-6 py-3 border border-blue-400/40 mb-8">
                                            <Sparkles size={20} className="text-blue-300" />
                                            <span className="text-blue-200 font-medium">Ready to Transform Your Enterprise?</span>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                            Start Your Enterprise Journey Today
                                        </h3>
                                        <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                                            Join leading enterprises who trust SkillConnect for their talent needs.
                                            Get a personalized demo and see how we can transform your workforce strategy.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                            <button className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3">
                                                <Calendar size={20} />
                                                Schedule Demo
                                                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                            </button>
                                            <button className="group px-10 py-5 bg-white/10 text-white rounded-2xl font-bold border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-lg flex items-center gap-3">
                                                <Mail size={20} />
                                                Get Custom Quote
                                                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                            </button>
                                        </div>

                                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-400" />
                                                <span>No setup fees</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-400" />
                                                <span>30-day implementation</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-400" />
                                                <span>Dedicated support team</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-400" />
                                                <span>99.9% SLA guarantee</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterprisePage;