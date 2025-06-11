
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/types/jobApplications';
import { 
  loadDraftsFromLocalStorage, 
  saveDraftToLocalStorage, 
  clearDraftFromLocalStorage 
} from '@/utils/jobApplicationsUtils';

export const useDraftManagement = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});

  // Load saved draft changes on component mount
  useEffect(() => {
    const drafts = loadDraftsFromLocalStorage();
    const validDrafts = Object.keys(drafts);
    
    if (validDrafts.length > 0) {
      const applicationId = validDrafts[0];
      const draft = drafts[applicationId];
      
      setEditingId(applicationId);
      setEditData(draft.data);
      
      toast({
        title: "Draft Changes Restored",
        description: "Your unsaved changes have been restored. Don't forget to save them!",
      });
    }
  }, [toast]);

  // Save draft changes to localStorage whenever editData changes
  useEffect(() => {
    if (editingId) {
      saveDraftToLocalStorage(editingId, editData);
    }
  }, [editingId, editData]);

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

  const handleSave = async (applicationId: string, onUpdateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>) => {
    await onUpdateApplication(applicationId, editData);
    setEditingId(null);
    setEditData({});
    clearDraftFromLocalStorage(applicationId);
  };

  const handleCancel = () => {
    const currentEditingId = editingId;
    setEditingId(null);
    setEditData({});
    
    if (currentEditingId) {
      clearDraftFromLocalStorage(currentEditingId);
    }
  };

  const handleEditDataChange = (updates: Partial<JobApplication>) => {
    setEditData(prev => ({ ...prev, ...updates }));
  };

  return {
    editingId,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditDataChange
  };
};
