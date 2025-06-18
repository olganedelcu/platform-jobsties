
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Building2, Briefcase, User, MapPin, Phone, Mail, FileText, MessageSquare, X } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface ApplicationDetailViewProps {
  application: JobApplication;
  onClose: () => void;
  onUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  isCoachView?: boolean;
}

const ApplicationDetailView = ({ 
  application, 
  onClose, 
  onUpdateApplication,
  isCoachView = false 
}: ApplicationDetailViewProps) => {
  const [coachNotes, setCoachNotes] = React.useState(application.coach_notes || '');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'to_be_considered': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveCoachNotes = async () => {
    if (!isCoachView) return;
    
    setIsUpdating(true);
    try {
      await onUpdateApplication(application.id, { coach_notes: coachNotes });
    } catch (error) {
      console.error('Error updating coach notes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Basic Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Application Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{application.company_name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>{application.job_title}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date Applied</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(application.date_applied), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(application.application_status)}>
                        {application.application_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {application.interview_stage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Interview Stage</label>
                    <p className="mt-1">{application.interview_stage}</p>
                  </div>
                )}

                {application.recruiter_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Recruiter</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{application.recruiter_name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mentee Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Mentee ID: {application.mentee_id}
                </div>
              </CardContent>
            </Card>

            {/* Coach Notes Section - Only visible to coaches */}
            {isCoachView && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Coach Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    placeholder="Add your coaching notes here..."
                    className="min-h-[120px]"
                  />
                  <Button 
                    onClick={handleSaveCoachNotes}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? 'Saving...' : 'Save Coach Notes'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Display Coach Notes for Mentees */}
            {!isCoachView && application.coach_notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Coach Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                    <p className="text-gray-700">{application.coach_notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailView;
