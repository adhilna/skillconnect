import React from 'react';
import { CategoryCard } from './CategoryCard';

export const CategoriesSection = ({ category, setCategory }) => {
    const categories = [
        'Design', 'Development', 'Marketing', 'Writing', 'Video', 'Music', 'Business'
    ];

    return (
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
                        <CategoryCard
                            key={cat}
                            category={cat}
                            isSelected={category === cat}
                            onClick={setCategory}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};