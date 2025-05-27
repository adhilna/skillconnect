import React from 'react';

export const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-xl">
    <div className="text-purple-300 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-purple-200">{description}</p>
  </div>
);