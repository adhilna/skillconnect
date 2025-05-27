import React from 'react';

export const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl -top-10 -left-10 animate-pulse"></div>
    <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl top-1/4 -right-20 animate-pulse"></div>
    <div className="absolute w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl bottom-10 left-1/3 animate-pulse"></div>
  </div>
);