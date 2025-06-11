
import React from 'react';
import { JobApplication } from '@/types/jobApplications';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, Briefcase, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MenteeApplicationsGridProps {
  applications: JobApplication[];
  onViewDetails?: (application: JobApplication) => void;
  onDeleteApplication?: (applicationId: string) => void;
}

const MenteeApplicationsGrid = ({ 
  applications, 
  onViewDetails, 
  onDeleteApplication 
}: MenteeApplicationsGridProps) => {
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

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
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
              <Badge className={`text-xs ml-2 ${getStatusColor(application.application_status)}`}>
                {application.application_status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {(application.mentee_notes || application.coach_notes) && (
              <div className="space-y-2 mb-3">
                {application.mentee_notes && (
                  <div className="text-xs text-gray-700 bg-green-50 p-2 rounded border-l-2 border-green-400">
                    <span className="font-medium">Mentee: </span>
                    {application.mentee_notes}
                  </div>
                )}
                {application.coach_notes && (
                  <div className="text-xs text-gray-700 bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                    <span className="font-medium">Coach: </span>
                    {application.coach_notes}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-gray-500">
                {application.interview_stage && (
                  <span>Stage: {application.interview_stage}</span>
                )}
                {application.recruiter_name && (
                  <span className="ml-2">Recruiter: {application.recruiter_name}</span>
                )}
              </div>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenteeApplicationsGrid;
