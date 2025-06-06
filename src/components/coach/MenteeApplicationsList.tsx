
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, User, Briefcase, Phone } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface MenteeApplicationsListProps {
  applications: JobApplication[];
}

const MenteeApplicationsList = ({ applications }: MenteeApplicationsListProps) => {
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
      <Card>
        <CardContent className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-500">No mentee job applications to review at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  <span>
                    {application.profiles?.first_name} {application.profiles?.last_name}
                  </span>
                </CardTitle>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>{application.company_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{application.job_title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(application.date_applied), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(application.application_status)}>
                {application.application_status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {application.interview_stage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Interview Stage</h4>
                    <p className="text-sm text-gray-900">{application.interview_stage}</p>
                  </div>
                )}
                {application.recruiter_name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Recruiter</span>
                    </h4>
                    <p className="text-sm text-gray-900">{application.recruiter_name}</p>
                  </div>
                )}
              </div>
              {application.coach_notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {application.coach_notes}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenteeApplicationsList;
