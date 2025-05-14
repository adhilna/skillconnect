import { useState, useEffect } from 'react';
import { Search, CheckCircle, Star, ChevronDown, Users, Globe, Briefcase } from 'lucide-react';

export default function LandingPage() {
    const [heroIndex, setHeroIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState('Design');

    const heroTexts = [
        { title: "Find the perfect freelance services for your business", subtitle: "Work with talented freelancers at the most affordable price" },
        { title: "Get work done faster, with confidence", subtitle: "Your payment is released only when you approve the work" },
        { title: "The best for every budget", subtitle: "Quality work done quickly across thousands of categories" }
    ];

    const categories = [
        'Design', 'Development', 'Marketing', 'Writing', 'Video', 'Music', 'Business'
    ];

    const popular = [
        'Logo Design', 'Website Development', 'Content Writing', 'Video Editing', 'Social Media'
    ];

    const features = [
        { icon: <CheckCircle size={24} />, title: "Verified Professionals", description: "All freelancers are vetted and verified" },
        { icon: <Star size={24} />, title: "Quality Work", description: "Get high-quality work from top-rated talent" },
        { icon: <Users size={24} />, title: "Global Talent", description: "Access skills from around the world" },
        { icon: <Globe size={24} />, title: "24/7 Support", description: "Our support team is always here to help" }
    ];

    const testimonials = [
        { name: "Sarah Johnson", role: "Marketing Director", text: "Found the perfect designer for our rebrand in just 2 days. The quality exceeded our expectations." },
        { name: "Michael Chen", role: "Startup Founder", text: "This platform helped us build our MVP with a fraction of our budget. Highly recommend!" },
        { name: "Emily Rodriguez", role: "Content Manager", text: "The writers we hired delivered exceptional content that boosted our engagement by 45%." }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setHeroIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
        }, 5000);

        setIsVisible(true);

        return () => clearTimeout(timer);
    }, [heroIndex]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`Searching for "${searchInput}" in ${category}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl top-1/4 -right-20 animate-pulse"></div>
                <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skill+Connect</div>
                <div className="hidden md:flex space-x-6">
                    <a href="#" className="hover:text-purple-300 transition-colors">Explore</a>
                    <a href="#" className="hover:text-purple-300 transition-colors">How it Works</a>
                    <a href="#" className="hover:text-purple-300 transition-colors">Enterprise</a>
                </div>
                <div className="space-x-4">
                    <button className="hidden md:inline-block px-4 py-2 rounded-lg text-white hover:text-purple-300 transition-colors">Log In</button>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all transform hover:scale-105">Join Now</button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-24 md:pt-20 lg:pt-32 text-center">
                <div className="h-32 relative overflow-hidden">
                    <div key={heroIndex} className={`absolute w-full transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl mx-auto">
                            {heroTexts[heroIndex].title}
                        </h1>
                        <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
                            {heroTexts[heroIndex].subtitle}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl mt-12 bg-white rounded-full shadow-xl overflow-hidden flex items-center p-1.5">
                    <div className="flex items-center border-r border-gray-300 px-4 py-2 relative">
                        <span className="text-gray-700">{category}</span>
                        <ChevronDown size={16} className="ml-2 text-gray-500" />
                        {/* Dropdown placeholder (not functional) */}
                    </div>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for any service..."
                        className="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
                    />
                    <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full flex items-center font-medium">
                        <Search size={18} className="mr-2" />
                        Search
                    </button>
                </form>

                {/* Popular Searches */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="text-purple-200">Popular:</span>
                    {popular.map((item) => (
                        <a key={item} href="#" className="text-purple-200 hover:text-white hover:underline transition-colors">
                            {item}
                        </a>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 px-6 py-16 bg-white/10 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why businesses choose us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-xl">
                                <div className="text-purple-300 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-purple-200">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                        Browse service categories
                    </h2>
                    <p className="text-center text-purple-200 mb-12 max-w-2xl mx-auto">
                        Find the perfect professional for any project within our diverse range of categories
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
                        {categories.map((cat) => (
                            <div
                                key={cat}
                                onClick={() => setCategory(cat)}  // Step 2: Set the selected category
                                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105 cursor-pointer ${category === cat ? 'bg-purple-500' : ''}`}  // Highlight selected category
                            >
                                {/* Icons based on category */}
                                {cat === 'Design' && <Briefcase className="mx-auto mb-4" size={32} />}
                                {cat === 'Development' && <Globe className="mx-auto mb-4" size={32} />}
                                {cat === 'Marketing' && <Star className="mx-auto mb-4" size={32} />}
                                {cat === 'Writing' && <CheckCircle className="mx-auto mb-4" size={32} />}
                                {cat === 'Video' && <Users className="mx-auto mb-4" size={32} />}
                                {cat === 'Music' && <Briefcase className="mx-auto mb-4" size={32} />}
                                {cat === 'Business' && <Globe className="mx-auto mb-4" size={32} />}
                                <h3 className="font-medium">{cat}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="relative z-10 px-6 py-16 bg-white/10 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What our clients say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="mb-6 text-purple-100">"{testimonial.text}"</p>
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-purple-300">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 px-6 py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Ready to get started?</h2>
                    <p className="text-lg text-purple-200 mb-8">Join thousands of businesses finding the perfect talent for their projects</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all transform hover:scale-105 text-lg">
                            Sign Up For Free
                        </button>
                        <button className="px-8 py-3 rounded-lg border border-purple-400 hover:bg-white/10 font-medium transition-all text-lg">
                            Learn How It Works
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-8 bg-indigo-900/50 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold mb-4">Categories</h4>
                            <ul className="space-y-2">
                                {categories.slice(0, 4).map((cat) => (
                                    <li key={cat}><a href="#" className="text-purple-300 hover:text-white">{cat}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">About</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-purple-300 hover:text-white">Careers</a></li>
                                <li><a href="#" className="text-purple-300 hover:text-white">Press</a></li>
                                <li><a href="#" className="text-purple-300 hover:text-white">Partnerships</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-purple-300 hover:text-white">Help Center</a></li>
                                <li><a href="#" className="text-purple-300 hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="text-purple-300 hover:text-white">FAQs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Follow Us</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-purple-300 hover:text-white">Instagram</a></li>
                                <li><a href="#" className="text-purple-300 hover:text-white">LinkedIn</a></li>
                                <li><a href="#" className="text-purple-300 hover:text-white">Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-center text-purple-300 text-sm">&copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
