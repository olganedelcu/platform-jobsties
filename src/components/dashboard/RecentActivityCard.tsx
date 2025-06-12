
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus, ArrowRight, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface RecentActivityCardProps {
  recentApplications: any[];
  onViewAll: () => void;
  onAddApplication: () => void;
}

const RecentActivityCard = ({
  recentApplications,
  onViewAll,
  onAddApplication
}: RecentActivityCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-700';
      case 'interview':
        return 'bg-yellow-100 text-yellow-700';
      case 'offer':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Your latest job applications</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={onAddApplication}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        {recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border">
                    <Building2 className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{application.job_title}</p>
                    <p className="text-sm text-gray-600">{application.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                    {application.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {format(new Date(application.date_applied), 'MMM dd')}
                  </span>
                </div>
              </div>
            ))}
            
            <Button 
              variant="ghost" 
              onClick={onViewAll}
              className="w-full justify-center mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              View All Applications
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No recent applications</p>
            <Button onClick={onAddApplication} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Application
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
