import React from 'react';
import { CheckCircle, Star, Users, Globe } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection = () => {
    const features = [
        { icon: <CheckCircle size={24} />, title: "Verified Professionals", description: "All freelancers are vetted and verified" },
        { icon: <Star size={24} />, title: "Quality Work", description: "Get high-quality work from top-rated talent" },
        { icon: <Users size={24} />, title: "Global Talent", description: "Access skills from around the world" },
        { icon: <Globe size={24} />, title: "24/7 Support", description: "Our support team is always here to help" }
    ];

    return (
        <div className="relative z-10 px-6 py-16 bg-white/10 backdrop-blur-lg">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why businesses choose us</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};