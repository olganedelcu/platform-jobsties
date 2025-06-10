
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  BookOpen,
  MessageSquare,
  BarChart3,
  Clock,
  Shield
} from 'lucide-react';

const Showcase = () => {
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

  const features = [
    {
      icon: Users,
      title: "Expert Coaching",
      description: "Connect with professional career coaches who guide you through every step of your job search journey in Germany."
    },
    {
      icon: BookOpen,
      title: "Interview Assurance",
      description: "We guarantee you'll get interviews with our proven CV optimization and application strategies."
    },
    {
      icon: Shield,
      title: "80% Success Rate",
      description: "Our mentees have an 80% success rate in landing their dream jobs in Germany."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get round-the-clock support and guidance whenever you need help with your job search."
    }
  ];

  const stats = [
    { number: "100+", label: "Jobseekers Helped" },
    { number: "80%", label: "Success Rate" },
    { number: "Interview", label: "Guarantee" },
    { number: "24/7", label: "Support Available" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Engineer",
      content: "I never thought I could land a tech job in Germany. The team helped me turn my uncertainty into multiple offers!",
      location: "Berlin"
    },
    {
      name: "Ahmed K.",
      role: "Marketing Manager",
      content: "The 24/7 support was incredible. They guided me through every step and I got my dream job in just 3 months.",
      location: "Munich"
    },
    {
      name: "Maria L.",
      role: "Data Analyst",
      content: "From resume optimization to interview prep, they made the impossible possible. Now I'm thriving in my career!",
      location: "Hamburg"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Animation */}
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
            <Link to="/coach-signup">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Become a Coach
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

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            currentStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Jobsties?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide guaranteed results with proven strategies tailored specifically for the German job market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center hover:shadow-lg transition-all duration-500 ${
                currentStep >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            currentStep >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hear from Our Happy Mentees!
            </h2>
            <p className="text-xl text-gray-600">
              See how we've helped them turn uncertainty into offers and build careers they never thought possible in Germany.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`transition-all duration-500 ${
                currentStep >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: `${index * 150}ms` }}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Path to Success in Germany
            </h2>
            <p className="text-xl text-gray-600">
              Follow our proven 4-step process to land your dream job
            </p>
          </div>

          <div className="space-y-8">
            {[
              { step: 1, title: "Sign Up & Get Matched", description: "Create your profile and get matched with an expert coach specialized in the German job market." },
              { step: 2, title: "CV Optimization & Strategy", description: "Work with your coach to optimize your CV and develop a targeted job search strategy for Germany." },
              { step: 3, title: "Interview Preparation", description: "Get prepared for German-style interviews with our guaranteed interview assurance program." },
              { step: 4, title: "Land Your Dream Job", description: "Celebrate your success with our 80% success rate and continue growing with ongoing support." }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
    </div>
  );
};

export default Showcase;
