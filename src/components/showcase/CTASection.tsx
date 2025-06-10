
import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Career?</h2>
        <p className="text-xl text-indigo-100 mb-8">Join thousands of professionals who have transformed their careers</p>
        <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
          Get Started Today
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
