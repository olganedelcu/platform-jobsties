
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

interface CareerProgressCardProps {
  courseProgress: number;
  onCVOptimizedClick: () => void;
  onInterviewPrepClick: () => void;
  onSalaryNegotiationClick: () => void;
}

const CareerProgressCard = ({
  courseProgress,
  onCVOptimizedClick,
  onInterviewPrepClick,
  onSalaryNegotiationClick
}: CareerProgressCardProps) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Career Progress</h3>
            <p className="text-sm text-gray-600">Track your development journey</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Course Completion</span>
            <span className="text-sm font-semibold text-indigo-600">{Math.round(courseProgress)}%</span>
          </div>
          <Progress value={courseProgress} className="h-2" />
        </div>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:bg-gray-50"
            onClick={onCVOptimizedClick}
          >
            <BookOpen className="h-4 w-4 mr-3 text-indigo-600" />
            <span className="text-gray-700">CV Optimization</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:bg-gray-50"
            onClick={onInterviewPrepClick}
          >
            <Target className="h-4 w-4 mr-3 text-green-600" />
            <span className="text-gray-700">Interview Preparation</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-gray-200 hover:bg-gray-50"
            onClick={onSalaryNegotiationClick}
          >
            <TrendingUp className="h-4 w-4 mr-3 text-purple-600" />
            <span className="text-gray-700">Salary Negotiation</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgressCard;
