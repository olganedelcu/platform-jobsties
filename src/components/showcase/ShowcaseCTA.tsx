
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ShowcaseCTA = () => {
  return (
    <section className="py-20 px-6 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your German Career Journey?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join 100+ professionals who have successfully launched their careers in Germany with our proven system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseCTA;
