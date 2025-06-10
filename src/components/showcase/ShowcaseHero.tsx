
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, BarChart3, Upload, Play, TrendingUp } from 'lucide-react';

const ShowcaseHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Elegant Dashboard Experience
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Clean, intuitive interface designed for productivity
          </p>
        </div>

        {/* Dashboard Content with Browser Frame */}
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto relative overflow-hidden border border-gray-200/50">
            {/* Browser Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200/80 relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 text-sm text-gray-600 border border-gray-200/60 shadow-sm">
                🔒 jobsites.com/dashboard
              </div>
              
           
            </div>

            {/* Dashboard Content */}
            <div className="p-8 relative bg-gradient-to-br from-white to-gray-50/30">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    Good morning, Avinash
                  </h2>
                  <p className="text-gray-500 text-lg font-medium">Ready to accelerate your career journey?</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-sm border border-blue-200/50">
                  <User className="h-7 w-7 text-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Career Progress */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Career Progress</h3>
                      <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-700 font-medium">Live</span>
                      </div>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">73%</div>
                    <Progress value={73} className="mb-4 h-4 bg-gray-100" />
                    <div className="text-sm text-gray-500 mb-6 font-medium">Goal completion</div>

                    {/* Progress Icons */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-sm border border-green-200/50">
                          <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">CV Optimized</div>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-sm border border-blue-200/50">
                          <Clock className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="text-sm text-gray-700 font-medium">Interview Prep</div>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-sm border border-gray-200/50">
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-700 font-medium">Salary Negotiation</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl inline-flex items-center text-sm font-semibold shadow-lg">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Active Progress Tracking
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Next Session */}
                  <Card className="border border-gray-200/50 shadow-sm bg-white/60 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">Next Session</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2 font-medium">Today, 2:00 PM</div>
                      <div className="text-sm font-semibold text-blue-600 mb-4">Ana Nedelcu</div>
                      <div className="flex justify-end">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm border border-blue-200/50">
                          <Play className="w-5 h-5 text-blue-600 fill-current" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Applications */}
                  <div className="text-center py-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">12</div>
                    <div className="text-sm text-gray-600 mb-4 font-medium">Applications this month</div>
                    <div className="flex justify-center gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1.5 h-8 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
                      ))}
                    </div>
                  </div>

                  {/* Analytics Card */}
                  <Card className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-lg">Career Analytics</div>
                          <div className="text-sm text-gray-300">Track your progress</div>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-gray-300" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mt-4">View detailed insights</div>
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
      </div>
    </section>
  );
};

export default ShowcaseHero;
