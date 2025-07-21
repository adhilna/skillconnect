import React from 'react';
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
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
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
