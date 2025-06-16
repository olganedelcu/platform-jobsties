
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus } from 'lucide-react';

interface MenteeRecentActivityCardProps {
  onViewAll: () => void;
  onAddApplication: () => void;
}

const MenteeRecentActivityCard = ({ onViewAll, onAddApplication }: MenteeRecentActivityCardProps) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </div>
        
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-gray-600 mb-2">No recent activity</div>
          <div className="text-sm text-gray-500 mb-4">Start applying to jobs to see your activity here</div>
          <Button 
            onClick={onAddApplication} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenteeRecentActivityCard;
