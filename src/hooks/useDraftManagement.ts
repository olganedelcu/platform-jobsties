
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const hasRestoredDrafts = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved draft changes on component mount - only once
  useEffect(() => {
    if (hasRestoredDrafts.current) return;
    
    try {
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
      
      hasRestoredDrafts.current = true;
    } catch (error) {
      console.error('Error restoring drafts:', error);
    }
  }, [toast]);

  // Debounced save to localStorage
  const debouncedSave = useCallback((editingId: string, editData: Partial<JobApplication>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (editingId && Object.keys(editData).length > 0) {
          saveDraftToLocalStorage(editingId, editData);
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 500); // Save after 500ms of inactivity
  }, []);

  // Save draft changes to localStorage whenever editData changes (debounced)
  useEffect(() => {
    if (editingId && Object.keys(editData).length > 0) {
      debouncedSave(editingId, editData);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editingId, editData, debouncedSave]);

  const handleEdit = useCallback((application: JobApplication) => {
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
  }, []);

  const handleSave = useCallback(async (applicationId: string, onUpdateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>) => {
    try {
      await onUpdateApplication(applicationId, editData);
      setEditingId(null);
      setEditData({});
      clearDraftFromLocalStorage(applicationId);
    } catch (error) {
      console.error('Error saving application:', error);
    }
  }, [editData]);

  const handleCancel = useCallback(() => {
    const currentEditingId = editingId;
    setEditingId(null);
    setEditData({});
    
    if (currentEditingId) {
      try {
        clearDraftFromLocalStorage(currentEditingId);
      } catch (error) {
        console.error('Error clearing draft:', error);
      }
    }
  }, [editingId]);

  const handleEditDataChange = useCallback((updates: Partial<JobApplication>) => {
    setEditData(prev => ({ ...prev, ...updates }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    editingId,
    editData,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditDataChange
  };
};
