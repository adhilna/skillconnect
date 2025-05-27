import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';

export const HeroSection = ({ category, setCategory }) => {
    const [heroIndex, setHeroIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const heroTexts = [
        { title: "Find the perfect freelance services for your business", subtitle: "Work with talented freelancers at the most affordable price" },
        { title: "Get work done faster, with confidence", subtitle: "Your payment is released only when you approve the work" },
        { title: "The best for every budget", subtitle: "Quality work done quickly across thousands of categories" }
    ];

    const popular = [
        'Logo Design', 'Website Development', 'Content Writing', 'Video Editing', 'Social Media'
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setHeroIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
        }, 5000);

        setIsVisible(true);

        return () => clearTimeout(timer);
    }, [heroIndex]);

    return (
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

            <SearchBar category={category} setCategory={setCategory} />

            <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-purple-200">Popular:</span>
                {popular.map((item) => (
                    <a key={item} href="#" className="text-purple-200 hover:text-white hover:underline transition-colors">
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
};