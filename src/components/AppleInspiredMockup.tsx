
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Heart, Share, MoreHorizontal, User, Calendar, Clock } from 'lucide-react';

const AppleInspiredMockup = () => {
  return (
    <div className="relative w-full max-w-5xl">
      {/* Main Device Frame */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-1 shadow-2xl">
        {/* Screen */}
        <div className="bg-white rounded-[22px] overflow-hidden" style={{ aspectRatio: '16/10' }}>
          {/* macOS-style Title Bar */}
          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-white rounded-lg px-4 py-1 text-sm text-gray-600 inline-block shadow-sm">
                jobsties.com/dashboard
              </div>
            </div>
            <div className="w-20"></div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-50 h-full p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-2">Good morning, Alex</h1>
                <p className="text-gray-600">Ready to accelerate your career journey?</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Progress Card */}
              <div className="col-span-2">
                <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Career Progress</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Live</span>
                      </div>
                    </div>

                    {/* Progress Visualization */}
                    <div className="relative mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-light text-gray-900">73%</span>
                        <span className="text-sm text-gray-500">Goal completion</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000" style={{ width: '73%' }}></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="text-xs text-gray-600">CV Optimized</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-xs text-gray-600">Interview Prep</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <p className="text-xs text-gray-600">Salary Negotiation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions */}
              <div className="space-y-4">
                {/* Session Card */}
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Next Session</p>
                        <p className="text-xs text-gray-600">Today, 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-indigo-600 font-medium">Sarah Johnson</span>
                      <Play className="h-4 w-4 text-indigo-500" />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-light text-gray-900 mb-1">12</div>
                      <p className="text-xs text-gray-600">Applications this month</p>
                    </div>
                    <div className="flex justify-center space-x-1">
                      {[...Array(7)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1 rounded-full ${i < 5 ? 'bg-indigo-500' : 'bg-gray-200'}`}
                          style={{ height: `${Math.random() * 20 + 10}px` }}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Card */}
                <Card className="bg-gray-900 border-0 shadow-sm rounded-2xl text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium">Upload CV</p>
                        <p className="text-xs text-gray-400">Get feedback</p>
                      </div>
                      <Share className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="w-full bg-gray-800 rounded-lg h-8 flex items-center justify-center">
                      <span className="text-xs text-gray-400">Drag & Drop</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Section - Recent Activity */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Recent Activity</h4>
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { title: "CV Review Completed", time: "2 hours ago", type: "success" },
                  { title: "Interview Scheduled", time: "4 hours ago", type: "info" },
                  { title: "Application Submitted", time: "1 day ago", type: "pending" },
                  { title: "Profile Updated", time: "2 days ago", type: "success" }
                ].map((activity, index) => (
                  <Card key={index} className="bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' : 
                          activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium text-gray-900">92% Satisfaction</span>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl p-4 shadow-lg">
        <div className="text-sm font-medium">+€18K Avg Salary Boost</div>
      </div>
    </div>
  );
};

export default AppleInspiredMockup;
