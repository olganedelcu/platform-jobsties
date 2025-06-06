
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, User, Upload, ArrowRight } from 'lucide-react';

const DashboardQuickLinks = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: 'Schedule Your First Session',
      description: 'Book a coaching session with one of our expert career coaches',
      icon: Calendar,
      action: () => navigate('/sessions'),
      buttonText: 'Schedule Now',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      title: 'Start Career Course',
      description: 'Begin your journey with our comprehensive career development modules',
      icon: BookOpen,
      action: () => navigate('/course'),
      buttonText: 'Start Learning',
      color: 'from-green-600 to-teal-600'
    },
    {
      title: 'Complete Your Profile',
      description: 'Add your details and preferences to get personalized recommendations',
      icon: User,
      action: () => navigate('/profile'),
      buttonText: 'Update Profile',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your career development journey and achievements',
      icon: Upload,
      action: () => navigate('/tracker'),
      buttonText: 'View Progress',
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
          <ArrowRight className="h-5 w-5 mr-2 text-indigo-600" />
          Quick Links to Get Started
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.title}
                className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${link.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {link.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {link.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={link.action}
                      className={`bg-gradient-to-r ${link.color} hover:opacity-90 text-white text-xs`}
                    >
                      {link.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickLinks;
