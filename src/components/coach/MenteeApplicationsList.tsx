
import React, { useState } from 'react';
import { JobApplication } from '@/types/jobApplications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

interface MenteeApplicationsListProps {
  applications: JobApplication[];
  onUpdateNotes: (applicationId: string, notes: string) => Promise<void>;
}

const MenteeApplicationsList = ({ 
  applications, 
  onUpdateNotes 
}: MenteeApplicationsListProps) => {
  const [editingNotes, setEditingNotes] = useState<{[key: string]: string}>({});
  const [isEditing, setIsEditing] = useState<{[key: string]: boolean}>({});

  const handleEditNotes = (application: JobApplication) => {
    setEditingNotes({
      ...editingNotes,
      [application.id]: application.coach_notes || ''
    });
    setIsEditing({
      ...isEditing,
      [application.id]: true
    });
  };

  const handleSaveNotes = async (applicationId: string) => {
    await onUpdateNotes(applicationId, editingNotes[applicationId] || '');
    setIsEditing({
      ...isEditing,
      [applicationId]: false
    });
  };

  const handleCancelEdit = (applicationId: string) => {
    setIsEditing({
      ...isEditing,
      [applicationId]: false
    });
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
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No job applications found from your mentees.</p>
        </CardContent>
      </Card>
    );
  }

  // Group applications by mentee
  const applicationsByMentee: {[key: string]: {name: string, applications: JobApplication[]}} = {};
  
  applications.forEach(app => {
    const menteeName = app.profiles ? `${app.profiles.first_name} ${app.profiles.last_name}` : 'Unknown Mentee';
    const menteeId = app.mentee_id;
    
    if (!applicationsByMentee[menteeId]) {
      applicationsByMentee[menteeId] = {
        name: menteeName,
        applications: []
      };
    }
    
    applicationsByMentee[menteeId].applications.push(app);
  });

  return (
    <div className="space-y-8">
      {Object.entries(applicationsByMentee).map(([menteeId, menteeData]) => (
        <Card key={menteeId} className="mb-6">
          <CardHeader>
            <CardTitle>{menteeData.name}'s Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Interview Stage</TableHead>
                    <TableHead>Recruiter</TableHead>
                    <TableHead>Coach Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menteeData.applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{application.company_name}</TableCell>
                      <TableCell>{application.job_title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.application_status)}`}>
                          {application.application_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{application.interview_stage || '-'}</TableCell>
                      <TableCell>{application.recruiter_name || '-'}</TableCell>
                      <TableCell>
                        {isEditing[application.id] ? (
                          <Textarea
                            value={editingNotes[application.id] || ''}
                            onChange={(e) => setEditingNotes({
                              ...editingNotes,
                              [application.id]: e.target.value
                            })}
                            placeholder="Add your notes here..."
                            className="w-full"
                            rows={3}
                          />
                        ) : (
                          <div className="max-w-xs truncate" title={application.coach_notes || ''}>
                            {application.coach_notes || '-'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing[application.id] ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveNotes(application.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCancelEdit(application.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditNotes(application)}
                          >
                            Add Notes
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenteeApplicationsList;
