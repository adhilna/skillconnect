import { useState } from 'react';
import { BackgroundBlobs } from '../components/Landing/BackgroundBlobs';
import { Navbar } from '../components/Landing/Navbar';
import { ExploreHeroSection } from '../components/Explore/ExploreHeroSection';
import { StatsSection } from '../components/Explore/StatsSection';
import { FeaturedServicesSection } from '../components/Explore/FeaturedServiceSection';
import { ServicesSection } from '../components/Explore/FiltersServicesSection';
import { CustomRequestSection } from '../components/Explore/CustomCTASection';
import { FooterSection } from '../components/Landing/FooterSection';


export default function ExplorePage() {
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [favorites, setFavorites] = useState(new Set());

    // Sample services data
    const services = [
        {
            id: 1,
            title: "I will design a modern logo for your brand",
            seller: "Sarah_Designer",
            rating: 4.9,
            reviews: 1247,
            price: 25,
            image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
            category: "Design",
            featured: true,
            delivery: "3 days",
            level: "Top Rated"
        },
        {
            id: 2,
            title: "I will develop a responsive website using React",
            seller: "CodeMaster_JS",
            rating: 4.8,
            reviews: 892,
            price: 150,
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
            category: "Development",
            featured: false,
            delivery: "7 days",
            level: "Level 2"
        },
        {
            id: 3,
            title: "I will create engaging social media content strategy",
            seller: "MarketingPro",
            rating: 4.9,
            reviews: 654,
            price: 75,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
            category: "Marketing",
            featured: true,
            delivery: "5 days",
            level: "Top Rated"
        },
        {
            id: 4,
            title: "I will write compelling copy for your website",
            seller: "WordSmith_Pro",
            rating: 4.7,
            reviews: 423,
            price: 50,
            image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=300&fit=crop",
            category: "Writing",
            featured: false,
            delivery: "2 days",
            level: "Level 1"
        },
        {
            id: 5,
            title: "I will edit professional videos for your business",
            seller: "VideoEditor_X",
            rating: 4.8,
            reviews: 789,
            price: 120,
            image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
            category: "Video",
            featured: true,
            delivery: "4 days",
            level: "Top Rated"
        },
        {
            id: 6,
            title: "I will compose original music for your project",
            seller: "MusicMaestro",
            rating: 4.9,
            reviews: 345,
            price: 200,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
            category: "Music",
            featured: false,
            delivery: "10 days",
            level: "Level 2"
        },
        {
            id: 7,
            title: "I will create a comprehensive business plan",
            seller: "BizConsultant",
            rating: 4.6,
            reviews: 234,
            price: 300,
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
            category: "Business",
            featured: false,
            delivery: "14 days",
            level: "Level 1"
        },
        {
            id: 8,
            title: "I will translate documents professionally",
            seller: "LinguistExpert",
            rating: 4.8,
            reviews: 567,
            price: 35,
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
            category: "Translation",
            featured: true,
            delivery: "2 days",
            level: "Top Rated"
        }
    ];

    const toggleFavorite = (serviceId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(serviceId)) {
            newFavorites.delete(serviceId);
        } else {
            newFavorites.add(serviceId);
        }
        setFavorites(newFavorites);
    };

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            service.seller.toLowerCase().includes(searchInput.toLowerCase());

        let matchesPrice = true;
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(p => p === '500+' ? 1000 : parseInt(p));
            matchesPrice = service.price >= min && (max ? service.price <= max : true);
        }

        return matchesCategory && matchesSearch && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
            <BackgroundBlobs />
            <Navbar />
            <ExploreHeroSection
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <StatsSection />
            <FeaturedServicesSection
                services={services}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
            />
            <ServicesSection
                filteredServices={filteredServices}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
            <CustomRequestSection />
            <FooterSection />
        </div>
    );
}


























// import { useState } from 'react';
// import { Search, Filter, Star, Heart, ChevronDown, Grid, List, Briefcase, Globe, Users, CheckCircle, ArrowRight, TrendingUp, Award, Clock } from 'lucide-react';

// export default function ExplorePage() {
//     const [searchInput, setSearchInput] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [priceRange, setPriceRange] = useState('all');
//     const [sortBy, setSortBy] = useState('featured');
//     const [viewMode, setViewMode] = useState('grid');
//     const [showFilters, setShowFilters] = useState(false);
//     const [favorites, setFavorites] = useState(new Set());

//     const categories = [
//         'All', 'Design', 'Development', 'Marketing', 'Writing', 'Video', 'Music', 'Business', 'Translation', 'AI Services'
//     ];

//     const priceRanges = [
//         { value: 'all', label: 'All Prices' },
//         { value: '5-25', label: '$5 - $25' },
//         { value: '25-100', label: '$25 - $100' },
//         { value: '100-500', label: '$100 - $500' },
//         { value: '500+', label: '$500+' }
//     ];

//     const sortOptions = [
//         { value: 'featured', label: 'Featured' },
//         { value: 'newest', label: 'Newest' },
//         { value: 'rating', label: 'Highest Rated' },
//         { value: 'price-low', label: 'Price: Low to High' },
//         { value: 'price-high', label: 'Price: High to Low' }
//     ];

//     const services = [
//         {
//             id: 1,
//             title: "I will design a modern logo for your brand",
//             seller: "Sarah_Designer",
//             rating: 4.9,
//             reviews: 1247,
//             price: 25,
//             image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
//             category: "Design",
//             featured: true,
//             delivery: "3 days",
//             level: "Top Rated"
//         },
//         {
//             id: 2,
//             title: "I will develop a responsive website using React",
//             seller: "CodeMaster_JS",
//             rating: 4.8,
//             reviews: 892,
//             price: 150,
//             image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
//             category: "Development",
//             featured: false,
//             delivery: "7 days",
//             level: "Level 2"
//         },
//         {
//             id: 3,
//             title: "I will create engaging social media content strategy",
//             seller: "MarketingPro",
//             rating: 4.9,
//             reviews: 654,
//             price: 75,
//             image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
//             category: "Marketing",
//             featured: true,
//             delivery: "5 days",
//             level: "Top Rated"
//         },
//         {
//             id: 4,
//             title: "I will write compelling copy for your website",
//             seller: "WordSmith_Pro",
//             rating: 4.7,
//             reviews: 423,
//             price: 50,
//             image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=300&fit=crop",
//             category: "Writing",
//             featured: false,
//             delivery: "2 days",
//             level: "Level 1"
//         },
//         {
//             id: 5,
//             title: "I will edit professional videos for your business",
//             seller: "VideoEditor_X",
//             rating: 4.8,
//             reviews: 789,
//             price: 120,
//             image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
//             category: "Video",
//             featured: true,
//             delivery: "4 days",
//             level: "Top Rated"
//         },
//         {
//             id: 6,
//             title: "I will compose original music for your project",
//             seller: "MusicMaestro",
//             rating: 4.9,
//             reviews: 345,
//             price: 200,
//             image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
//             category: "Music",
//             featured: false,
//             delivery: "10 days",
//             level: "Level 2"
//         },
//         {
//             id: 7,
//             title: "I will create a comprehensive business plan",
//             seller: "BizConsultant",
//             rating: 4.6,
//             reviews: 234,
//             price: 300,
//             image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
//             category: "Business",
//             featured: false,
//             delivery: "14 days",
//             level: "Level 1"
//         },
//         {
//             id: 8,
//             title: "I will translate documents professionally",
//             seller: "LinguistExpert",
//             rating: 4.8,
//             reviews: 567,
//             price: 35,
//             image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
//             category: "Translation",
//             featured: true,
//             delivery: "2 days",
//             level: "Top Rated"
//         }
//     ];

//     const featuredServices = services.filter(service => service.featured);

//     const toggleFavorite = (serviceId) => {
//         const newFavorites = new Set(favorites);
//         if (newFavorites.has(serviceId)) {
//             newFavorites.delete(serviceId);
//         } else {
//             newFavorites.add(serviceId);
//         }
//         setFavorites(newFavorites);
//     };

//     const filteredServices = services.filter(service => {
//         const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
//         const matchesSearch = service.title.toLowerCase().includes(searchInput.toLowerCase()) ||
//             service.seller.toLowerCase().includes(searchInput.toLowerCase());

//         let matchesPrice = true;
//         if (priceRange !== 'all') {
//             const [min, max] = priceRange.split('-').map(p => p === '500+' ? 1000 : parseInt(p));
//             matchesPrice = service.price >= min && (max ? service.price <= max : true);
//         }

//         return matchesCategory && matchesSearch && matchesPrice;
//     });

//     const ServiceCard = ({ service, isGridView }) => (
//         <div className={`bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl group ${isGridView ? '' : 'flex'}`}>
//             <div className={`relative ${isGridView ? 'h-48' : 'w-64 h-48'} overflow-hidden`}>
//                 <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
//                 <button
//                     onClick={() => toggleFavorite(service.id)}
//                     className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
//                 >
//                     <Heart size={16} className={`${favorites.has(service.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
//                 </button>
//                 {service.featured && (
//                     <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-black">
//                         Featured
//                     </div>
//                 )}
//                 <div className="absolute bottom-3 left-3 px-2 py-1 bg-purple-500 rounded-full text-xs font-medium">
//                     {service.level}
//                 </div>
//             </div>

//             <div className={`p-4 ${isGridView ? '' : 'flex-1'}`}>
//                 <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm text-purple-300">{service.category}</span>
//                     <div className="flex items-center text-yellow-400">
//                         <Star size={14} className="fill-current" />
//                         <span className="ml-1 text-sm font-medium text-white">{service.rating}</span>
//                         <span className="ml-1 text-xs text-purple-300">({service.reviews})</span>
//                     </div>
//                 </div>

//                 <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
//                     {service.title}
//                 </h3>

//                 <div className="flex items-center mb-3">
//                     <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
//                         {service.seller[0]}
//                     </div>
//                     <span className="ml-2 text-sm text-purple-200">{service.seller}</span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center text-sm text-purple-300">
//                         <Clock size={14} className="mr-1" />
//                         {service.delivery}
//                     </div>
//                     <div className="text-right">
//                         <span className="text-sm text-purple-300">Starting at</span>
//                         <div className="font-bold text-lg text-white">${service.price}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
//             {/* Background Effects */}
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
//                 <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl top-1/4 -right-20 animate-pulse"></div>
//                 <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
//             </div>

//             {/* Navbar */}
//             <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12 bg-black/20 backdrop-blur-lg">
//                 <div onClick={() => window.location.href = '/'} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//                     Skill+Connect
//                 </div>
//                 <div className="hidden md:flex space-x-6">
//                     <a href="#" className="text-purple-300 font-medium">Explore</a>
//                     <a href="#" className="hover:text-purple-300 transition-colors">How it Works</a>
//                     <a href="#" className="hover:text-purple-300 transition-colors">Enterprise</a>
//                 </div>
//                 <div className="space-x-4">
//                     <button className="hidden md:inline-block px-4 py-2 rounded-lg text-white hover:text-purple-300 transition-colors">Log In</button>
//                     <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all transform hover:scale-105">
//                         Join Now
//                     </button>
//                 </div>
//             </nav>

//             {/* Hero Section */}
//             <div className="relative z-10 px-6 py-16 text-center">
//                 <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//                     Explore Amazing Services
//                 </h1>
//                 <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
//                     Discover thousands of talented freelancers ready to bring your vision to life
//                 </p>

//                 {/* Enhanced Search Bar */}
//                 <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-2">
//                     <div className="flex flex-col md:flex-row gap-2">
//                         <div className="flex-1 relative">
//                             <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                             <input
//                                 type="text"
//                                 value={searchInput}
//                                 onChange={(e) => setSearchInput(e.target.value)}
//                                 placeholder="Search for services..."
//                                 className="w-full pl-12 pr-4 py-3 bg-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:bg-white/30 transition-all"
//                             />
//                         </div>
//                         <select
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                             className="px-4 py-3 bg-white/20 rounded-xl text-white focus:outline-none focus:bg-white/30 transition-all"
//                         >
//                             {categories.map(cat => (
//                                 <option key={cat} value={cat} className="bg-indigo-900">{cat}</option>
//                             ))}
//                         </select>
//                         <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
//                             Search
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Section */}
//             <div className="relative z-10 px-6 py-8 bg-white/5 backdrop-blur-lg">
//                 <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//                     <div>
//                         <div className="text-3xl font-bold text-white mb-2">50K+</div>
//                         <div className="text-purple-300">Active Services</div>
//                     </div>
//                     <div>
//                         <div className="text-3xl font-bold text-white mb-2">25K+</div>
//                         <div className="text-purple-300">Freelancers</div>
//                     </div>
//                     <div>
//                         <div className="text-3xl font-bold text-white mb-2">100K+</div>
//                         <div className="text-purple-300">Projects Completed</div>
//                     </div>
//                     <div>
//                         <div className="text-3xl font-bold text-white mb-2">4.9★</div>
//                         <div className="text-purple-300">Average Rating</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Featured Services */}
//             <div className="relative z-10 px-6 py-16">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="flex items-center justify-between mb-8">
//                         <div>
//                             <h2 className="text-3xl font-bold mb-2 flex items-center">
//                                 <TrendingUp className="mr-3 text-yellow-400" />
//                                 Featured Services
//                             </h2>
//                             <p className="text-purple-300">Hand-picked by our team</p>
//                         </div>
//                         <button className="flex items-center text-purple-300 hover:text-white transition-colors">
//                             View All <ArrowRight size={16} className="ml-1" />
//                         </button>
//                     </div>

//                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {featuredServices.map(service => (
//                             <ServiceCard key={service.id} service={service} isGridView={true} />
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Filters and Results */}
//             <div className="relative z-10 px-6 py-8">
//                 <div className="max-w-7xl mx-auto">
//                     {/* Filter Bar */}
//                     <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-8">
//                         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                             <div className="flex items-center gap-4">
//                                 <button
//                                     onClick={() => setShowFilters(!showFilters)}
//                                     className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
//                                 >
//                                     <Filter size={16} className="mr-2" />
//                                     Filters
//                                 </button>

//                                 <select
//                                     value={priceRange}
//                                     onChange={(e) => setPriceRange(e.target.value)}
//                                     className="px-4 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:bg-white/30"
//                                 >
//                                     {priceRanges.map(range => (
//                                         <option key={range.value} value={range.value} className="bg-indigo-900">
//                                             {range.label}
//                                         </option>
//                                     ))}
//                                 </select>

//                                 <select
//                                     value={sortBy}
//                                     onChange={(e) => setSortBy(e.target.value)}
//                                     className="px-4 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:bg-white/30"
//                                 >
//                                     {sortOptions.map(option => (
//                                         <option key={option.value} value={option.value} className="bg-indigo-900">
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <span className="text-purple-300">{filteredServices.length} services found</span>
//                                 <div className="flex bg-white/20 rounded-lg overflow-hidden">
//                                     <button
//                                         onClick={() => setViewMode('grid')}
//                                         className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500' : 'hover:bg-white/30'} transition-colors`}
//                                     >
//                                         <Grid size={16} />
//                                     </button>
//                                     <button
//                                         onClick={() => setViewMode('list')}
//                                         className={`p-2 ${viewMode === 'list' ? 'bg-purple-500' : 'hover:bg-white/30'} transition-colors`}
//                                     >
//                                         <List size={16} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Services Grid/List */}
//                     <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
//                         {filteredServices.map(service => (
//                             <ServiceCard key={service.id} service={service} isGridView={viewMode === 'grid'} />
//                         ))}
//                     </div>

//                     {/* Load More */}
//                     <div className="text-center mt-12">
//                         <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
//                             Load More Services
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* CTA Section */}
//             <div className="relative z-10 px-6 py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-center">
//                 <div className="max-w-4xl mx-auto">
//                     <h2 className="text-3xl md:text-4xl font-bold mb-6">Can't Find What You're Looking For?</h2>
//                     <p className="text-xl mb-8 text-purple-100">Post a custom request and let freelancers come to you with proposals</p>
//                     <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
//                         Post a Request
//                     </button>
//                 </div>
//             </div>

//             {/* Footer */}
//             <footer className="relative z-10 px-6 py-12 bg-black/30 backdrop-blur-lg">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
//                         <div>
//                             <h4 className="font-bold mb-4">Categories</h4>
//                             <ul className="space-y-2">
//                                 {categories.slice(1, 5).map((cat) => (
//                                     <li key={cat}><a href="#" className="text-purple-300 hover:text-white transition-colors">{cat}</a></li>
//                                 ))}
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="font-bold mb-4">For Buyers</h4>
//                             <ul className="space-y-2">
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">How it Works</a></li>
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Quality Guide</a></li>
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Help Center</a></li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="font-bold mb-4">For Sellers</h4>
//                             <ul className="space-y-2">
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Become a Seller</a></li>
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Seller Resources</a></li>
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Community</a></li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="font-bold mb-4">Company</h4>
//                             <ul className="space-y-2">
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">About Us</a></li>
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Careers</a></li>
//                                 <li><a href="#" className="text-purple-300 hover:text-white transition-colors">Press</a></li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div className="border-t border-purple-800 pt-8 text-center">
//                         <p className="text-purple-300">&copy; 2025 Skill+Connect. All rights reserved.</p>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// }