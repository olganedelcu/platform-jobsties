
import React, { useState, useEffect } from 'react';
import ShowcaseHero from '@/components/showcase/ShowcaseHero';
import ShowcaseFeatures from '@/components/showcase/ShowcaseFeatures';
import ShowcaseTestimonials from '@/components/showcase/ShowcaseTestimonials';
import ShowcaseHowItWorks from '@/components/showcase/ShowcaseHowItWorks';
import ShowcaseCTA from '@/components/showcase/ShowcaseCTA';

const Showcase = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Step-by-step animation sequence for features and testimonials
    const timer = setInterval(() => {
      setCurrentStep(prev => prev + 1);
    }, 800);

    // Clear interval after all steps
    setTimeout(() => {
      clearInterval(timer);
    }, 6400); // 8 steps * 800ms

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <ShowcaseHero />
      <ShowcaseFeatures currentStep={currentStep} />
      <ShowcaseTestimonials currentStep={currentStep} />
      <ShowcaseHowItWorks />
      <ShowcaseCTA />
    </div>
  );
};

export default Showcase;
