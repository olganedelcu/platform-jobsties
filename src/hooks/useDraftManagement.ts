import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/types/jobApplications';
import { 
  loadDraftFromLocalStorage, 
  saveDraftToLocalStorage, 
  clearDraftFromLocalStorage,
  cleanupExpiredDrafts
} from '@/utils/jobApplicationsUtils';

export const useDraftManagement = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});
  const [showRestorationBanner, setShowRestorationBanner] = useState(false);
  const [restorationTimestamp, setRestorationTimestamp] = useState<string>('');
  const [hasAutoSavedDraft, setHasAutoSavedDraft] = useState(false);
  
  const hasRestoredDrafts = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up expired drafts on mount
  useEffect(() => {
    cleanupExpiredDrafts();
  }, []);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('unsaved_application_') && editingId) {
        const applicationId = e.key.replace('unsaved_application_', '');
        if (applicationId === editingId) {
          if (e.newValue) {
            try {
              const draft = JSON.parse(e.newValue);
              setEditData(draft.formData);
              setHasAutoSavedDraft(true);
            } catch (error) {
              console.error('Error syncing draft from another tab:', error);
            }
          } else {
            setHasAutoSavedDraft(false);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [editingId]);

  // Debounced save to localStorage
  const debouncedSave = useCallback((applicationId: string, formData: Partial<JobApplication>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (applicationId && Object.keys(formData).length > 0) {
          saveDraftToLocalStorage(applicationId, formData);
          setHasAutoSavedDraft(true);
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 500); // 500ms debounce as requested
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
    // First check if there's an existing draft
    const existingDraft = loadDraftFromLocalStorage(application.id);
    
    if (existingDraft && !hasRestoredDrafts.current) {
      // Restore from draft
      setEditingId(application.id);
      setEditData(existingDraft.formData);
      setShowRestorationBanner(true);
      setRestorationTimestamp(existingDraft.lastUpdated);
      setHasAutoSavedDraft(true);
      hasRestoredDrafts.current = true;
    } else {
      // Use current application data
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
      setHasAutoSavedDraft(false);
    }
  }, []);

  const handleSave = useCallback(async (applicationId: string, onUpdateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>) => {
    try {
      await onUpdateApplication(applicationId, editData);
      setEditingId(null);
      setEditData({});
      setShowRestorationBanner(false);
      setHasAutoSavedDraft(false);
      clearDraftFromLocalStorage(applicationId);
    } catch (error) {
      console.error('Error saving application:', error);
    }
  }, [editData]);

  const handleCancel = useCallback(() => {
    const currentEditingId = editingId;
    setEditingId(null);
    setEditData({});
    setShowRestorationBanner(false);
    setHasAutoSavedDraft(false);
    
    // Don't clear draft on cancel - keep it for potential restoration
  }, [editingId]);

  const handleDiscardDraft = useCallback(() => {
    if (editingId) {
      clearDraftFromLocalStorage(editingId);
      setShowRestorationBanner(false);
      setHasAutoSavedDraft(false);
      
      toast({
        title: "Draft Discarded",
        description: "Your unsaved changes have been discarded.",
      });
    }
  }, [editingId, toast]);

  const handleDismissBanner = useCallback(() => {
    setShowRestorationBanner(false);
  }, []);

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
    showRestorationBanner,
    restorationTimestamp,
    hasAutoSavedDraft,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditDataChange,
    handleDiscardDraft,
    handleDismissBanner
  };
};
