
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, User, BarChart3 } from 'lucide-react';

const MobileMockupSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Anywhere</h2>
          <p className="text-xl text-gray-600">Responsive design works perfectly on all devices</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            {/* Mobile Frame */}
            <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden w-80 h-[600px]">
                {/* Mobile Status Bar */}
                <div className="bg-gray-900 text-white text-xs p-2 flex justify-between items-center">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-1 h-2 bg-white rounded-sm"></div>
                    <div className="w-6 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <img 
                      src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                      alt="JobSties Logo" 
                      className="h-6 w-auto"
                    />
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">JD</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Content */}
                <div className="p-4 bg-gray-50 h-full">
                  <div className="mb-4">
                    <h1 className="text-lg font-bold text-gray-900">Welcome!</h1>
                    <p className="text-sm text-gray-600">Your career dashboard</p>
                  </div>

                  <div className="space-y-3">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Career Course</h3>
                            <p className="text-xs text-gray-600">Start learning</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Complete Profile</h3>
                            <p className="text-xs text-gray-600">Add your details</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Track Progress</h3>
                            <p className="text-xs text-gray-600">View your stats</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileMockupSection;
