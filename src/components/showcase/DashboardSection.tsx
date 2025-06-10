
import React from 'react';
import AppleInspiredMockup from '@/components/AppleInspiredMockup';

const DashboardSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Elegant Dashboard Experience</h2>
          <p className="text-xl text-gray-600">Clean, intuitive interface designed for productivity</p>
        </div>

        <div className="flex justify-center">
          <AppleInspiredMockup />
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
