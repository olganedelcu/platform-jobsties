
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Shield, Clock } from 'lucide-react';

interface ShowcaseFeaturesProps {
  currentStep: number;
}

const ShowcaseFeatures = ({ currentStep }: ShowcaseFeaturesProps) => {
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

  return (
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
  );
};

export default ShowcaseFeatures;
