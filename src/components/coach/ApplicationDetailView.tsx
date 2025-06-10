
import React from 'react';
import { ArrowLeft, Building2, Calendar, User, Briefcase, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface ApplicationDetailViewProps {
  application: JobApplication;
  onBack: () => void;
}

const ApplicationDetailView = ({ application, onBack }: ApplicationDetailViewProps) => {
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <User className="h-6 w-6 text-indigo-600" />
                <span>
                  {application.profiles?.first_name} {application.profiles?.last_name}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{application.company_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{application.job_title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Applied: {format(new Date(application.date_applied), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(application.application_status)}>
              {application.application_status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Company</label>
              <p className="text-gray-900">{application.company_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Position</label>
              <p className="text-gray-900">{application.job_title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date Applied</label>
              <p className="text-gray-900">{format(new Date(application.date_applied), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Badge className={getStatusColor(application.application_status)}>
                {application.application_status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            {application.interview_stage && (
              <div>
                <label className="text-sm font-medium text-gray-700">Interview Stage</label>
                <p className="text-gray-900">{application.interview_stage}</p>
              </div>
            )}
            {application.recruiter_name && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Recruiter</span>
                </label>
                <p className="text-gray-900">{application.recruiter_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {application.coach_notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Coach Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">{application.coach_notes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Application Submitted</p>
                <p className="text-sm text-gray-600">{format(new Date(application.date_applied), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
            {application.application_status !== 'applied' && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Status Updated</p>
                  <p className="text-sm text-gray-600">
                    Changed to {application.application_status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetailView;
