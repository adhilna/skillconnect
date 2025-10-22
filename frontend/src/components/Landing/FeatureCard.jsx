import React from 'react';

export const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-8 flex flex-col items-center text-center border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-purple-200">{description}</p>
  </div>
);