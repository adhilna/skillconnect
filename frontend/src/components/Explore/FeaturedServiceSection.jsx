import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export const FeaturedServicesSection = ({ services, favorites, toggleFavorite }) => {
    const featuredServices = services.filter(service => service.featured);

    return (
        <div className="relative z-10 px-6 py-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center">
                            <TrendingUp className="mr-3 text-yellow-400" />
                            Featured Services
                        </h2>
                        <p className="text-purple-300">Hand-picked by our team</p>
                    </div>
                    <button className="flex items-center text-purple-300 hover:text-white transition-colors">
                        View All <ArrowRight size={16} className="ml-1" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredServices.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isGridView={true}
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};