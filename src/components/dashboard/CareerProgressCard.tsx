
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

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
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Career Progress</h3>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live
          </Badge>
        </div>
        
        <div className="text-4xl font-bold text-purple-600 mb-3">{courseProgress}%</div>
        <Progress value={courseProgress} className="mb-4 h-3" />
        <div className="text-sm text-gray-500 mb-6">Course completion</div>

        {/* Progress Icons */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center cursor-pointer" onClick={onCVOptimizedClick}>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-3 mx-auto hover:bg-green-200 transition-colors">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-700 font-medium">CV Optimized</div>
          </div>
          <div className="text-center cursor-pointer" onClick={onInterviewPrepClick}>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 mx-auto hover:bg-purple-200 transition-colors">
              <Clock className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-sm text-gray-700 font-medium">Interview Prep</div>
          </div>
          <div className="text-center cursor-pointer" onClick={onSalaryNegotiationClick}>
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 mx-auto hover:bg-gray-200 transition-colors">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-700 font-medium">Salary Negotiation</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgressCard;
