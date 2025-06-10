
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, User, BookOpen } from 'lucide-react';

const CareerSuccessVisualization = () => {
  return (
    <div className="relative w-full max-w-2xl">
      {/* Main Success Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-2xl border border-indigo-100">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Career Success Dashboard</h3>
          <p className="text-gray-600">Your journey to dream job offers</p>
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">3.2x</div>
            <div className="text-xs text-gray-600">Salary Increase</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">21</div>
            <div className="text-xs text-gray-600">Days Average</div>
          </div>
        </div>

        {/* Career Path Progress */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Your Career Path</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">CV Optimization</span>
                  <span className="text-xs text-green-600 font-medium">Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Interview Prep</span>
                  <span className="text-xs text-blue-600 font-medium">In Progress</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">Salary Negotiation</span>
                  <span className="text-xs text-gray-500 font-medium">Upcoming</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-300 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Story Preview */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">"I got my dream job offer in 3 weeks!"</p>
              <p className="text-xs opacity-75">- Sarah, Software Engineer</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">$85k → $127k</div>
              <div className="text-xs opacity-75">Salary Jump</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Success Indicators */}
      <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
        +$42k Salary Boost
      </div>
      <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
        92% Success Rate
      </div>
    </div>
  );
};

export default CareerSuccessVisualization;
