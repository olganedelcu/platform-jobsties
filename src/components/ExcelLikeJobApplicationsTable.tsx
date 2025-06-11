
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';
import { format } from 'date-fns';
import JobApplicationsTableHeader from '@/components/JobApplicationsTableHeader';
import JobApplicationRow from '@/components/JobApplicationRow';
import NewApplicationRow from '@/components/NewApplicationRow';
import { useDraftManagement } from '@/hooks/useDraftManagement';

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

  const {
    editingId,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditDataChange
  } = useDraftManagement();

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

  const handleSaveApplication = async (applicationId: string) => {
    await handleSave(applicationId, onUpdateApplication);
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
          <JobApplicationsTableHeader />
          <TableBody>
            {isAddingNew && (
              <NewApplicationRow
                newApplicationData={newApplicationData}
                setNewApplicationData={setNewApplicationData}
                onSave={handleSaveNew}
                onCancel={handleCancelNew}
              />
            )}
            
            {applications.map((application) => (
              <JobApplicationRow
                key={application.id}
                application={application}
                isEditing={editingId === application.id}
                editData={editData}
                onEdit={handleEdit}
                onSave={handleSaveApplication}
                onCancel={handleCancel}
                onDelete={onDeleteApplication}
                onEditDataChange={handleEditDataChange}
                isAddingNew={isAddingNew}
              />
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
