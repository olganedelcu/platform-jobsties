
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, BarChart3, Upload, Play } from 'lucide-react';

const ShowcaseHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Text */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Elegant Dashboard Experience
          </h1>
          <p className="text-xl text-gray-600">
            Clean, intuitive interface designed for productivity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Logo */}
          <div className="text-center lg:text-left">
            <div className={`mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="Jobsties Logo" 
                className="h-20 mx-auto lg:mx-0 mb-8"
              />
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
                  <div className="flex-1 text-center">
                    <span className="text-gray-400 text-sm">jobsties.com/dashboard</span>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="bg-white rounded-lg p-6 min-h-[500px]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Good morning, Avinash</h2>
                      <p className="text-gray-500 text-sm">Ready to accelerate your career journey?</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Career Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-semibold text-gray-900">Career Progress</h3>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Live</span>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">73%</div>
                        <Progress value={73} className="mb-3 h-2" />
                        <div className="text-xs text-gray-500 mb-4">Goal completion</div>

                        {/* Progress Icons */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="text-xs text-gray-600">CV Optimized</div>
                          </div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                              <Clock className="w-3 h-3 text-blue-500" />
                            </div>
                            <div className="text-xs text-gray-600">Interview Prep</div>
                          </div>
                          <div className="text-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            </div>
                            <div className="text-xs text-gray-600">Salary Negotiation</div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h3>
                        <div className="bg-green-500 text-white px-3 py-1.5 rounded-full inline-flex items-center text-xs font-medium">
                          ↗ €10K Avg Salary Boost
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Next Session */}
                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900 text-sm">Next Session</span>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">Today, 2:00 PM</div>
                          <div className="text-xs font-medium text-blue-600 mb-3">Ana Nedelcu</div>
                          <div className="flex justify-end">
                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                              <Play className="w-2.5 h-2.5 text-blue-600 fill-current" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Applications */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
                        <div className="text-xs text-gray-600 mb-3">Applications this month</div>
                        <div className="flex justify-center gap-0.5">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-0.5 h-4 bg-blue-500 rounded-full"></div>
                          ))}
                        </div>
                      </div>

                      {/* Upload CV */}
                      <Card className="bg-gray-900 text-white border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium text-sm">Upload CV</div>
                              <div className="text-xs text-gray-400">Get feedback</div>
                            </div>
                            <Upload className="h-3 w-3 text-gray-400" />
                          </div>
                          <div className="text-xs text-gray-400 mt-3">Drag & Drop</div>
                        </CardContent>
                      </Card>
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
