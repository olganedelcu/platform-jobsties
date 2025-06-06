
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit3, Calendar, Building2, User } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface MenteeApplicationsListProps {
  applications: JobApplication[];
  onUpdateNotes: (applicationId: string, notes: string) => Promise<void>;
}

const MenteeApplicationsList = ({ applications, onUpdateNotes }: MenteeApplicationsListProps) => {
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const handleEditNotes = (applicationId: string, currentNotes: string) => {
    setEditingNotes(applicationId);
    setTempNotes(currentNotes || '');
  };

  const handleSaveNotes = async (applicationId: string) => {
    await onUpdateNotes(applicationId, tempNotes);
    setEditingNotes(null);
    setTempNotes('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setTempNotes('');
  };

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
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Job Title</h4>
                  <p className="text-sm text-gray-900">{application.job_title}</p>
                </div>
                {application.interview_stage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Interview Stage</h4>
                    <p className="text-sm text-gray-900">{application.interview_stage}</p>
                  </div>
                )}
                {application.recruiter_name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Recruiter</h4>
                    <p className="text-sm text-gray-900">{application.recruiter_name}</p>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Coach Notes</h4>
                  {editingNotes !== application.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditNotes(application.id, application.coach_notes || '')}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {editingNotes === application.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Add your coaching notes here..."
                      rows={4}
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveNotes(application.id)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md min-h-[100px]">
                    {application.coach_notes || 'No notes added yet.'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenteeApplicationsList;
