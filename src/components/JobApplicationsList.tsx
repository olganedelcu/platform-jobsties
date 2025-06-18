
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface JobApplicationsListProps {
  applications: JobApplication[];
  onUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  onDeleteApplication: (applicationId: string) => Promise<void>;
}

const JobApplicationsList = ({ 
  applications, 
  onUpdateApplication, 
  onDeleteApplication 
}: JobApplicationsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});

  const handleEdit = (application: JobApplication) => {
    setEditingId(application.id);
    setEditData({
      application_status: application.application_status,
      interview_stage: application.interview_stage,
      recruiter_name: application.recruiter_name,
      coach_notes: application.coach_notes
    });
  };

  const handleSave = async (applicationId: string) => {
    await onUpdateApplication(applicationId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

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

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No job applications found. Add your first application to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Job Applications</CardTitle>
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
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">{application.company_name}</TableCell>
                  <TableCell>{application.job_title}</TableCell>
                  <TableCell>
                    {editingId === application.id ? (
                      <select
                        value={editData.application_status || application.application_status}
                        onChange={(e) => setEditData(prev => ({ ...prev, application_status: e.target.value }))}
                        className="w-full text-xs p-1 border rounded"
                      >
                        <option value="applied">Applied</option>
                        <option value="to_be_considered">To Be Considered</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer Received</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.application_status)}`}>
                        {application.application_status.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === application.id ? (
                      <input
                        type="text"
                        value={editData.interview_stage || application.interview_stage || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, interview_stage: e.target.value }))}
                        className="w-full text-xs p-1 border rounded"
                        placeholder="Interview stage"
                      />
                    ) : (
                      application.interview_stage || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === application.id ? (
                      <input
                        type="text"
                        value={editData.recruiter_name || application.recruiter_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, recruiter_name: e.target.value }))}
                        className="w-full text-xs p-1 border rounded"
                        placeholder="Recruiter name"
                      />
                    ) : (
                      application.recruiter_name || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === application.id ? (
                      <textarea
                        value={editData.coach_notes || application.coach_notes || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, coach_notes: e.target.value }))}
                        className="w-full text-xs p-1 border rounded"
                        placeholder="Notes"
                        rows={2}
                      />
                    ) : (
                      <div className="max-w-xs truncate" title={application.coach_notes || ''}>
                        {application.coach_notes || '-'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {editingId === application.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(application.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(application)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onDeleteApplication(application.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationsList;
