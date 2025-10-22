import React, { useState } from 'react';
import { BackgroundBlobs } from '../components/Landing/BackgroundBlobs';
import { Navbar } from '../components/Landing/Navbar';
import { HeroSection } from '../components/Landing/HeroSection';
import { FeaturesSection } from '../components/Landing/FeaturesSection';
import { CategoriesSection } from '../components/Landing/CategoriesSection';
import { TestimonialsSection } from '../components/Landing/TestimonialsSection';
import { CTASection } from '../components/Landing/CTASection';
import { FooterSection } from '../components/Landing/FooterSection';

export default function LandingPage() {
    const [category, setCategory] = useState('Design'); // Shared category state

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
            <BackgroundBlobs />
            <Navbar />
            <HeroSection category={category} setCategory={setCategory} />
            <FeaturesSection />
            <CategoriesSection category={category} setCategory={setCategory} />
            {/* <TestimonialsSection /> */}
            <CTASection />
            <FooterSection />
        </div>
    );
}
