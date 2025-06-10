
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ShowcaseHero = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setIsVisible(true);
    
    // Step-by-step animation sequence
    const timer = setInterval(() => {
      setCurrentStep(prev => prev + 1);
    }, 800);

    // Clear interval after all steps
    setTimeout(() => {
      clearInterval(timer);
    }, 6400); // 8 steps * 800ms

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { number: "100+", label: "Jobseekers Helped" },
    { number: "80%", label: "Success Rate" },
    { number: "Interview", label: "Guarantee" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo Animation */}
        <div className={`mb-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <img 
            src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
            alt="Jobsties Logo" 
            className="h-16 mx-auto mb-6 animate-fade-in"
          />
        </div>

        {/* Main Title with Typewriter Effect */}
        <div className={`transition-all duration-1000 delay-300 ${
          currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Land Your Dream Job
            <span className="text-blue-600 ml-3">in Germany</span>
          </h1>
        </div>

        {/* New descriptive text */}
        <div className={`transition-all duration-1000 delay-400 ${
          currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-xl text-gray-700 mb-6 max-w-4xl mx-auto leading-relaxed">
            We help professionals stop playing small, own their worth, and win in today's job market without second-guessing their every move. Want to learn how it works? Book a call to see if you qualify!
          </p>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-1000 delay-500 ${
          currentStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Join 100+ successful jobseekers who've transformed their careers in Germany with our expert coaching, interview guarantee, and proven 80% success rate.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-700 ${
          currentStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Link to="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Start Your Journey
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-900 ${
          currentStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>
    </section>
  );
};

export default ShowcaseHero;
