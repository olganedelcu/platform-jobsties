import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, User, BarChart3, Calendar, MessageCircle, Upload } from 'lucide-react';

const Showcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section with Device Mockup */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" 
                alt="Jobsties Platform Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Speed Up Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Job Search</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with career coaches, track your progress, and accelerate your career development journey
            </p>
          </div>

          {/* Desktop Mockup */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-gray-800 rounded-t-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden shadow-2xl">
              {/* Navigation Bar */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <img 
                      src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                      alt="JobSties Logo" 
                      className="h-8 w-auto"
                    />
                    <div className="hidden md:flex space-x-6">
                      <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </div>
                      <div className="flex items-center text-gray-700 px-3 py-2">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Course
                      </div>
                      <div className="flex items-center text-gray-700 px-3 py-2">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Tracker
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      JD
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-gray-50">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome, John!</h1>
                  <p className="text-gray-600 mt-1">Your career development dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">Start Career Course</h3>
                          <p className="text-xs text-gray-600 mb-3">Begin your journey with comprehensive modules</p>
                          <Button size="sm" className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs">
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">Complete Profile</h3>
                          <p className="text-xs text-gray-600 mb-3">Add details for personalized recommendations</p>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs">
                            Update Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">Track Progress</h3>
                          <p className="text-xs text-gray-600 mb-3">Monitor your career development journey</p>
                          <Button size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs">
                            View Progress
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Laptop Mockup Section */}
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

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for your career development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Course</h3>
              <p className="text-gray-600">Structured learning modules covering CV optimization, interview preparation, and job search strategies</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1:1 Coaching</h3>
              <p className="text-gray-600">Connect with experienced career coaches for personalized guidance and mentorship</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your applications, track interview progress, and measure your success</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Scheduling</h3>
              <p className="text-gray-600">Easy booking system for coaching sessions with calendar integration</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Direct communication with your coach for quick questions and support</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CV Review</h3>
              <p className="text-gray-600">Upload and receive professional feedback on your CV and cover letters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Mockup Section */}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of professionals who have transformed their careers</p>
          <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Showcase;
