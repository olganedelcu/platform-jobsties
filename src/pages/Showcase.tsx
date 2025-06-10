
import React from 'react';
import HeroSection from '@/components/showcase/HeroSection';
import VisualizationSection from '@/components/showcase/VisualizationSection';
import DashboardSection from '@/components/showcase/DashboardSection';
import LaptopMockupSection from '@/components/showcase/LaptopMockupSection';
import FeaturesSection from '@/components/showcase/FeaturesSection';
import MobileMockupSection from '@/components/showcase/MobileMockupSection';
import CTASection from '@/components/showcase/CTASection';

const Showcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section with Career Success Visualization */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
          <VisualizationSection />
        </div>
      </section>

      <DashboardSection />
      <LaptopMockupSection />
      <FeaturesSection />
      <MobileMockupSection />
      <CTASection />
    </div>
  );
};

export default Showcase;
