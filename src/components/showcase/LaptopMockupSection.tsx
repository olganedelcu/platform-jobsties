
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LaptopMockupSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Modern Learning Experience</h2>
          <p className="text-xl text-gray-600">Designed for professionals on the go</p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            {/* Laptop Base */}
            <div className="relative">
              {/* Laptop Screen */}
              <div className="bg-gray-900 rounded-t-lg p-4 shadow-2xl" style={{ width: '600px', height: '380px' }}>
                <div className="bg-white rounded-md h-full overflow-hidden">
                  {/* Course Page Content */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <img 
                          src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                          alt="JobSties Logo" 
                          className="h-6 w-auto"
                        />
                        <div className="flex space-x-4 text-sm">
                          <span className="text-gray-700">Dashboard</span>
                          <span className="text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">Course</span>
                          <span className="text-gray-700">Tracker</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        JD
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 h-full">
                    <div className="mb-4">
                      <h1 className="text-xl font-bold text-gray-900">Career Development Course</h1>
                      <p className="text-sm text-gray-600">Module 1: CV Optimization</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h3 className="text-sm font-medium">Introduction to CV Writing</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Learn the fundamentals of creating an effective CV</p>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-green-500 h-1 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h3 className="text-sm font-medium">CV Structure & Format</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Understand professional CV layouts and design</p>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-blue-500 h-1 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <h3 className="text-sm font-medium">Tailoring for Roles</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Customize your CV for specific job applications</p>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-gray-300 h-1 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <h3 className="text-sm font-medium">Review & Feedback</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Get professional feedback on your CV</p>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-gray-300 h-1 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="bg-gray-300 rounded-b-xl h-4 shadow-lg" style={{ width: '600px' }}>
                <div className="flex justify-center pt-1">
                  <div className="w-16 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Laptop Stand */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-2 bg-gray-400 rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaptopMockupSection;
