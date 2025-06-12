
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp } from 'lucide-react';

interface ApplicationsStatsCardProps {
  applicationsThisMonth: number;
  onClick: () => void;
}

const ApplicationsStatsCard = ({ applicationsThisMonth, onClick }: ApplicationsStatsCardProps) => {
  return (
    <Card className="shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
            <p className="text-sm text-gray-600">This month's progress</p>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {applicationsThisMonth}
          </div>
          <p className="text-gray-600 mb-4">Applications submitted</p>
          
          <div className="flex justify-center items-center mb-4">
            <div className="flex gap-1">
              {[...Array(Math.min(applicationsThisMonth, 12))].map((_, i) => (
                <div key={i} className="w-2 h-8 bg-purple-500 rounded-full"></div>
              ))}
              {applicationsThisMonth === 0 && (
                <div className="w-2 h-8 bg-gray-200 rounded-full"></div>
              )}
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsStatsCard;
