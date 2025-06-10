
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
  BarChart3
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
      description: "Connect with professional career coaches who guide you through every step of your job search journey."
    },
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Access comprehensive courses covering CV optimization, interview skills, and job search strategies."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your application progress and track your career development with detailed analytics."
    },
    {
      icon: MessageSquare,
      title: "Real-time Support",
      description: "Get instant feedback and support through our integrated chat system with your coach."
    }
  ];

  const stats = [
    { number: "500+", label: "Success Stories" },
    { number: "95%", label: "Interview Rate" },
    { number: "50+", label: "Expert Coaches" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
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
              Transform Your
              <span className="text-blue-600 ml-3">Career Journey</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-500 ${
            currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with expert coaches, master essential skills, and land your dream job with our comprehensive career development platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-700 ${
            currentStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
            currentStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            currentStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and support you need to accelerate your career growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center hover:shadow-lg transition-all duration-500 ${
                currentStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            currentStep >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Path to Success
            </h2>
            <p className="text-xl text-gray-600">
              Follow our proven 4-step process to transform your career
            </p>
          </div>

          <div className="space-y-8">
            {[
              { step: 1, title: "Sign Up & Get Matched", description: "Create your profile and get matched with an expert coach based on your career goals and industry." },
              { step: 2, title: "Complete Your Learning Path", description: "Work through our structured course modules covering CV optimization, interview prep, and job search strategies." },
              { step: 3, title: "Apply & Track Progress", description: "Start applying to jobs while tracking your progress and receiving real-time feedback from your coach." },
              { step: 4, title: "Land Your Dream Job", description: "Celebrate your success and continue growing with ongoing support and career development resources." }
            ].map((item, index) => (
              <div key={index} className={`flex items-center gap-6 transition-all duration-500 ${
                currentStep >= 8 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`} style={{ transitionDelay: `${index * 150}ms` }}>
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
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have already accelerated their career growth with Jobsties.
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
