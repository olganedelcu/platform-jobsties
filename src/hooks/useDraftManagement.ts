
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
  const isInitialized = useRef(false);
  const lastEditingId = useRef<string | null>(null);

  // Clean up expired drafts on mount (only once)
  useEffect(() => {
    if (!isInitialized.current) {
      cleanupExpiredDrafts();
      isInitialized.current = true;
    }
  }, []);

  // Cross-tab synchronization with improved stability
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

  // Debounced save to localStorage with better error handling
  const debouncedSave = useCallback((applicationId: string, formData: Partial<JobApplication>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (applicationId && Object.keys(formData).length > 0) {
          const hasActualData = Object.values(formData).some(value => 
            value !== null && value !== undefined && value !== ''
          );
          
          if (hasActualData) {
            saveDraftToLocalStorage(applicationId, formData);
            setHasAutoSavedDraft(true);
            console.log('Draft auto-saved for application:', applicationId);
          }
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 500);
  }, []);

  // Save draft changes to localStorage whenever editData changes
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
    console.log('Starting edit for application:', application.id);
    
    // Reset restoration flag if editing a different application
    if (lastEditingId.current !== application.id) {
      hasRestoredDrafts.current = false;
      lastEditingId.current = application.id;
    }

    // Check if there's an existing draft
    const existingDraft = loadDraftFromLocalStorage(application.id);
    
    if (existingDraft && !hasRestoredDrafts.current) {
      console.log('Restoring draft for application:', application.id);
      setEditingId(application.id);
      setEditData(existingDraft.formData);
      setShowRestorationBanner(true);
      setRestorationTimestamp(existingDraft.lastUpdated);
      setHasAutoSavedDraft(true);
      hasRestoredDrafts.current = true;
    } else {
      console.log('Using current application data for:', application.id);
      setEditingId(application.id);
      setEditData({
        company_name: application.company_name,
        job_title: application.job_title,
        application_status: application.application_status,
        interview_stage: application.interview_stage,
        recruiter_name: application.recruiter_name,
        coach_notes: application.coach_notes,
        mentee_notes: application.mentee_notes,
        date_applied: application.date_applied
      });
      setHasAutoSavedDraft(false);
    }
  }, []);

  const handleSave = useCallback(async (applicationId: string, onUpdateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>) => {
    try {
      console.log('Saving application:', applicationId);
      await onUpdateApplication(applicationId, editData);
      setEditingId(null);
      setEditData({});
      setShowRestorationBanner(false);
      setHasAutoSavedDraft(false);
      clearDraftFromLocalStorage(applicationId);
      hasRestoredDrafts.current = false;
      lastEditingId.current = null;
    } catch (error) {
      console.error('Error saving application:', error);
    }
  }, [editData]);

  const handleCancel = useCallback(() => {
    console.log('Cancelling edit');
    setEditingId(null);
    setEditData({});
    setShowRestorationBanner(false);
    setHasAutoSavedDraft(false);
    
    // Don't clear draft on cancel - keep it for potential restoration
  }, []);

  const handleDiscardDraft = useCallback(() => {
    if (editingId) {
      console.log('Discarding draft for application:', editingId);
      clearDraftFromLocalStorage(editingId);
      setShowRestorationBanner(false);
      setHasAutoSavedDraft(false);
      hasRestoredDrafts.current = false;
      
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
    console.log('Edit data changing:', updates);
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
