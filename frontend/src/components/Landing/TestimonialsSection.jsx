import React from 'react';
import { TestimonialCard } from './TestimonialCard';

export const TestimonialsSection = () => {
    const testimonials = [
        { name: "Sarah Johnson", role: "Marketing Director", text: "Found the perfect designer for our rebrand in just 2 days. The quality exceeded our expectations." },
        { name: "Michael Chen", role: "Startup Founder", text: "This platform helped us build our MVP with a fraction of our budget. Highly recommend!" },
        { name: "Emily Rodriguez", role: "Content Manager", text: "The writers we hired delivered exceptional content that boosted our engagement by 45%." }
    ];

    return (
        <div className="relative z-10 px-6 py-16 bg-white/10 backdrop-blur-lg">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What our clients say</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            name={testimonial.name}
                            role={testimonial.role}
                            text={testimonial.text}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};