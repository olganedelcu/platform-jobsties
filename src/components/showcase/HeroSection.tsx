
import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-8">
        <img 
          src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" 
          alt="Jobsties Platform Logo" 
          className="h-16 w-auto"
        />
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Speed Up Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Job Search</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Connect with career coaches, track your progress, and accelerate your career development journey
      </p>
    </div>
  );
};

export default HeroSection;
