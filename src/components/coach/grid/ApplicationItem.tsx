
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, Briefcase, Eye, Trash2 } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface ApplicationItemProps {
  application: JobApplication;
  onViewDetails?: (application: JobApplication) => void;
  onDeleteApplication?: (applicationId: string) => void;
}

const ApplicationItem = ({ application, onViewDetails, onDeleteApplication }: ApplicationItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {application.company_name}
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {application.job_title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">
            {format(new Date(application.date_applied), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-3">
        <Badge className={`text-xs ${getStatusColor(application.application_status)}`}>
          {application.application_status.replace('_', ' ').toUpperCase()}
        </Badge>
        <div className="flex items-center space-x-1">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(application)}
              className="flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          {onDeleteApplication && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteApplication(application.id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationItem;
