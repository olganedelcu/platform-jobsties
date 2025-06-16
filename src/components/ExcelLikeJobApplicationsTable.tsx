
import React, { useState, useMemo } from 'react';
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
import JobApplicationsSearch from '@/components/JobApplicationsSearch';
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
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter applications based on search term
  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return applications.filter(application => 
      application.company_name.toLowerCase().includes(lowerSearchTerm) ||
      application.job_title.toLowerCase().includes(lowerSearchTerm)
    );
  }, [applications, searchTerm]);

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

      {/* Search Section - only show for mentees */}
      {!isCoachView && (
        <div className="px-4 pt-4">
          <JobApplicationsSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalApplications={applications.length}
            filteredApplications={filteredApplications.length}
          />
        </div>
      )}

      {showRestorationBanner && (
        <div className="p-4 pb-0">
          <DraftRestorationBanner
            lastUpdated={restorationTimestamp}
            onDismiss={handleDismissBanner}
            onDiscard={handleDiscardDraft}
          />
        </div>
      )}
      
      <div className="relative">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="overflow-x-auto">
            <Table>
              <JobApplicationsTableHeader showCoachNotesColumn={true} />
            </Table>
          </div>
        </div>

        {/* Scrollable Body */}
        <ScrollArea className="h-[500px]">
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                {!isCoachView && isAddingNew && (
                  <NewApplicationRow
                    newApplicationData={newApplicationData}
                    setNewApplicationData={setNewApplicationData}
                    onSave={handleSaveNew}
                    onCancel={handleCancelNew}
                  />
                )}
                
                {filteredApplications.map((application) => (
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
                
                {filteredApplications.length === 0 && !isAddingNew && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {searchTerm ? (
                        <>
                          No applications found matching "{searchTerm}".
                          <br />
                          <button 
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-800 underline mt-2"
                          >
                            Clear search
                          </button>
                        </>
                      ) : isCoachView 
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
    </div>
  );
};

export default ExcelLikeJobApplicationsTable;
