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
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Elegant Dashboard Experience
          </h1>
          <p className="text-xl text-gray-600">
            Clean, intuitive interface designed for productivity
          </p>
        </div>

        {/* Dashboard Content with Browser Frame */}
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto relative overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 text-sm text-gray-600 border border-gray-200">
                🔒 jobsites.com/dashboard
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8 relative">
              {/* Top Right - 80% Satisfaction */}
              <div className="absolute top-6 right-6 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                80% Satisfaction
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Avinash</h2>
                  <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Career Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Career Progress</h3>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-500">Live</span>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-3">73%</div>
                    <Progress value={73} className="mb-4 h-3" />
                    <div className="text-sm text-gray-500 mb-6">Goal completion</div>

                    {/* Progress Icons */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">CV Optimized</div>
                      </div>
                      <div className="text-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                          <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Interview Prep</div>
                      </div>
                      <div className="text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Salary Negotiation</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                      ↗ €10K Avg Salary Boost
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Next Session */}
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-gray-900 text-lg">Next Session</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Today, 2:00 PM</div>
                      <div className="text-sm font-medium text-blue-600 mb-4">Ana Nedelcu</div>
                      <div className="flex justify-end">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-blue-600 fill-current" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Applications */}
                  <div className="text-center py-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
                    <div className="text-sm text-gray-600 mb-4">Applications this month</div>
                    <div className="flex justify-center gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      ))}
                    </div>
                  </div>

                  {/* Analytics Card */}
                  <Card className="bg-gray-900 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-lg">Career Analytics</div>
                          <div className="text-sm text-gray-400">Track your progress</div>
                        </div>
                        <BarChart3 className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-400 mt-4">View detailed insights</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
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
