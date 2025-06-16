
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Career Progress</h3>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live
          </Badge>
        </div>
        
        <div className="text-3xl font-bold text-blue-600 mb-2">{courseProgress}%</div>
        <Progress value={courseProgress} className="mb-4 h-2" />

        {/* Progress Icons */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center cursor-pointer" onClick={onCVOptimizedClick}>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-green-200 transition-colors">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-700 font-medium">CV Optimized</div>
          </div>
          <div className="text-center cursor-pointer" onClick={onInterviewPrepClick}>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-blue-200 transition-colors">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xs text-gray-700 font-medium">Interview Prep</div>
          </div>
          <div className="text-center cursor-pointer" onClick={onSalaryNegotiationClick}>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-gray-200 transition-colors">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-700 font-medium">Salary Negotiation</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgressCard;
