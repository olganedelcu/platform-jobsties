
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save, X } from 'lucide-react';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';
import { format } from 'date-fns';

interface ExcelLikeJobApplicationsTableProps {
  applications: JobApplication[];
  onAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
  onUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  onDeleteApplication: (applicationId: string) => Promise<void>;
}

const ExcelLikeJobApplicationsTable = ({ 
  applications, 
  onAddApplication,
  onUpdateApplication, 
  onDeleteApplication 
}: ExcelLikeJobApplicationsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newApplicationData, setNewApplicationData] = useState<NewJobApplicationData>({
    dateApplied: format(new Date(), 'yyyy-MM-dd'),
    companyName: '',
    jobTitle: '',
    applicationStatus: 'applied',
    interviewStage: '',
    recruiterName: '',
    coachNotes: ''
  });

  const handleEdit = (application: JobApplication) => {
    setEditingId(application.id);
    setEditData({
      company_name: application.company_name,
      job_title: application.job_title,
      application_status: application.application_status,
      interview_stage: application.interview_stage,
      recruiter_name: application.recruiter_name,
      coach_notes: application.coach_notes,
      date_applied: application.date_applied
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

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = async () => {
    if (newApplicationData.companyName && newApplicationData.jobTitle) {
      await onAddApplication(newApplicationData);
      setIsAddingNew(false);
      setNewApplicationData({
        dateApplied: format(new Date(), 'yyyy-MM-dd'),
        companyName: '',
        jobTitle: '',
        applicationStatus: 'applied',
        interviewStage: '',
        recruiterName: '',
        coachNotes: ''
      });
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewApplicationData({
      dateApplied: format(new Date(), 'yyyy-MM-dd'),
      companyName: '',
      jobTitle: '',
      applicationStatus: 'applied',
      interviewStage: '',
      recruiterName: '',
      coachNotes: ''
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

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Job Applications Tracker</h2>
        <Button onClick={handleAddNew} disabled={isAddingNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-32 font-semibold">Date Applied</TableHead>
              <TableHead className="w-48 font-semibold">Company</TableHead>
              <TableHead className="w-48 font-semibold">Job Title</TableHead>
              <TableHead className="w-32 font-semibold">Status</TableHead>
              <TableHead className="w-40 font-semibold">Interview Stage</TableHead>
              <TableHead className="w-40 font-semibold">Recruiter</TableHead>
              <TableHead className="w-64 font-semibold">Notes</TableHead>
              <TableHead className="w-32 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingNew && (
              <TableRow className="bg-blue-50">
                <TableCell>
                  <Input
                    type="date"
                    value={newApplicationData.dateApplied}
                    onChange={(e) => setNewApplicationData(prev => ({ ...prev, dateApplied: e.target.value }))}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={newApplicationData.companyName}
                    onChange={(e) => setNewApplicationData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Company name"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={newApplicationData.jobTitle}
                    onChange={(e) => setNewApplicationData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="Job title"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={newApplicationData.applicationStatus}
                    onValueChange={(value) => setNewApplicationData(prev => ({ ...prev, applicationStatus: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offer">Offer Received</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={newApplicationData.interviewStage || ''}
                    onChange={(e) => setNewApplicationData(prev => ({ ...prev, interviewStage: e.target.value }))}
                    placeholder="Interview stage"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={newApplicationData.recruiterName || ''}
                    onChange={(e) => setNewApplicationData(prev => ({ ...prev, recruiterName: e.target.value }))}
                    placeholder="Recruiter name"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={newApplicationData.coachNotes || ''}
                    onChange={(e) => setNewApplicationData(prev => ({ ...prev, coachNotes: e.target.value }))}
                    placeholder="Notes"
                    className="w-full min-h-[60px]"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleSaveNew}>
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelNew}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {applications.map((application) => (
              <TableRow key={application.id} className="hover:bg-gray-50">
                <TableCell>
                  {editingId === application.id ? (
                    <Input
                      type="date"
                      value={editData.date_applied || application.date_applied}
                      onChange={(e) => setEditData(prev => ({ ...prev, date_applied: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    format(new Date(application.date_applied), 'MMM dd, yyyy')
                  )}
                </TableCell>
                <TableCell>
                  {editingId === application.id ? (
                    <Input
                      value={editData.company_name || application.company_name}
                      onChange={(e) => setEditData(prev => ({ ...prev, company_name: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    <span className="font-medium">{application.company_name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === application.id ? (
                    <Input
                      value={editData.job_title || application.job_title}
                      onChange={(e) => setEditData(prev => ({ ...prev, job_title: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    application.job_title
                  )}
                </TableCell>
                <TableCell>
                  {editingId === application.id ? (
                    <Select
                      value={editData.application_status || application.application_status}
                      onValueChange={(value) => setEditData(prev => ({ ...prev, application_status: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="offer">Offer Received</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.application_status)}`}>
                      {application.application_status.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === application.id ? (
                    <Input
                      value={editData.interview_stage || application.interview_stage || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, interview_stage: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    application.interview_stage || '-'
                  )}
                </TableCell>
                <TableCell>
                  {editingId === application.id ? (
                    <Input
                      value={editData.recruiter_name || application.recruiter_name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, recruiter_name: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    application.recruiter_name || '-'
                  )}
                </TableCell>
                <TableCell>
                  {editingId === application.id ? (
                    <Textarea
                      value={editData.coach_notes || application.coach_notes || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, coach_notes: e.target.value }))}
                      className="w-full min-h-[60px]"
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
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(application)}
                          disabled={isAddingNew}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onDeleteApplication(application.id)}
                          disabled={isAddingNew}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {applications.length === 0 && !isAddingNew && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No job applications found. Click "Add Application" to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExcelLikeJobApplicationsTable;
