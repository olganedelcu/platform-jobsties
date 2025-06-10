
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, BookOpen, Target, Bell, Search } from 'lucide-react';

const ShowcaseHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Logo and Text */}
          <div className="text-center lg:text-left">
            <div className={`mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="Jobsties Logo" 
                className="h-20 mx-auto lg:mx-0 mb-8"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Career Journey
                <span className="text-blue-600 block">Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the platform that's helping professionals land their dream jobs in Germany
              </p>
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative">
              {/* MacBook Frame */}
              <div className="bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                {/* Dashboard Content */}
                <div className="bg-white rounded-lg p-6 min-h-[400px]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Good morning, Alex</h2>
                      <p className="text-gray-600">Ready to continue your journey?</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Search className="h-5 w-5 text-gray-400" />
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        A
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-sm text-gray-600">Course Progress</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">3</div>
                        <div className="text-sm text-gray-600">Interviews</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Items */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Next Session</div>
                        <div className="text-sm text-gray-600">Interview prep with Sarah - Today 3:00 PM</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Continue Learning</div>
                        <div className="text-sm text-gray-600">Module 4: German Interview Techniques</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <Target className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Track Applications</div>
                        <div className="text-sm text-gray-600">2 pending responses from this week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MacBook Base */}
              <div className="bg-gray-300 h-6 rounded-b-2xl shadow-lg"></div>
              <div className="bg-gray-400 h-2 w-16 mx-auto rounded-b-lg"></div>
            </div>
          </div>
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
