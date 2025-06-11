
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';
import { format } from 'date-fns';
import JobApplicationsTableHeader from '@/components/JobApplicationsTableHeader';
import JobApplicationRow from '@/components/JobApplicationRow';
import NewApplicationRow from '@/components/NewApplicationRow';
import DraftRestorationBanner from '@/components/DraftRestorationBanner';
import AutoSaveIndicator from '@/components/AutoSaveIndicator';
import { useDraftManagement } from '@/hooks/useDraftManagement';

interface ExcelLikeJobApplicationsTableProps {
  applications: JobApplication[];
  onAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
  onUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  onDeleteApplication: (applicationId: string) => Promise<void>;
  isCoachView?: boolean;
}

const ExcelLikeJobApplicationsTable = ({ 
  applications, 
  onAddApplication,
  onUpdateApplication, 
  onDeleteApplication,
  isCoachView = false
}: ExcelLikeJobApplicationsTableProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newApplicationData, setNewApplicationData] = useState<NewJobApplicationData>({
    dateApplied: format(new Date(), 'yyyy-MM-dd'),
    companyName: '',
    jobTitle: '',
    applicationStatus: 'applied',
    interviewStage: '',
    recruiterName: '',
    coachNotes: '',
    menteeNotes: ''
  });

  const {
    editingId,
    editData,
    showRestorationBanner,
    restorationTimestamp,
    hasAutoSavedDraft,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditDataChange,
    handleDiscardDraft,
    handleDismissBanner
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
        coachNotes: '',
        menteeNotes: ''
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
      coachNotes: '',
      menteeNotes: ''
    });
  };

  const handleSaveApplication = async (applicationId: string) => {
    await handleSave(applicationId, onUpdateApplication);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">
            {isCoachView ? "Mentee Applications" : "Job Applications Tracker"}
          </h2>
          <AutoSaveIndicator isVisible={hasAutoSavedDraft && !!editingId} />
        </div>
        {!isCoachView && (
          <Button onClick={handleAddNew} disabled={isAddingNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        )}
      </div>

      {showRestorationBanner && (
        <div className="p-4 pb-0">
          <DraftRestorationBanner
            lastUpdated={restorationTimestamp}
            onDismiss={handleDismissBanner}
            onDiscard={handleDiscardDraft}
          />
        </div>
      )}
      
      <ScrollArea className="h-[600px]">
        <div className="overflow-x-auto">
          <Table>
            <JobApplicationsTableHeader showCoachNotesColumn={true} />
            <TableBody>
              {!isCoachView && isAddingNew && (
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
                  isCoachView={isCoachView}
                />
              ))}
              
              {applications.length === 0 && !isAddingNew && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {isCoachView 
                      ? "No applications found for this mentee." 
                      : "No job applications found. Click \"Add Application\" to get started!"
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExcelLikeJobApplicationsTable;
