
import React from 'react';
import { BookOpen, User, BarChart3, Calendar, MessageCircle, Upload } from 'lucide-react';

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
