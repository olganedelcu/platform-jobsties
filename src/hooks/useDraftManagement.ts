import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobApplication } from "@/types/jobApplications";
import {
  loadDraftFromLocalStorage,
  saveDraftToLocalStorage,
  clearDraftFromLocalStorage,
  cleanupExpiredDrafts,
} from "@/utils/jobApplicationsUtils";

interface StoredDraft {
  formData: Partial<JobApplication>;
  lastUpdated: string;
}

export const useDraftManagement = () => {
  const { toast } = useToast();

  // state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});
  const [showRestorationBanner, setShowRestorationBanner] = useState(false);
  const [restorationTimestamp, setRestorationTimestamp] = useState("");
  const [hasAutoSavedDraft, setHasAutoSavedDraft] = useState(false);

  // refs
  const hasRestoredDrafts = useRef(false);
  const lastEditingId = useRef<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // autosave logic
  const debouncedSave = useCallback(
    (applicationId: string, formData: Partial<JobApplication>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          const hasActualData = Object.values(formData).some((value) => {
            if (value === null || value === undefined) return false;
            if (typeof value === "string") return value.trim() !== "";
            return value !== "";
          });

          if (hasActualData) {
            saveDraftToLocalStorage(applicationId, formData);
            setHasAutoSavedDraft(true);
          }
        } catch (error) {
          console.error("error saving draft:", error);
        }
      }, 500);
    },
    [],
  );

  const isValidStoredDraft = (data: unknown): data is StoredDraft => {
    return (
      data !== null &&
      typeof data === "object" &&
      "formData" in data &&
      typeof data.formData === "object" &&
      data.formData !== null &&
      "lastUpdated" in data &&
      typeof data.lastUpdated === "string"
    );
  };

  // trigger autosave on edit changes
  useEffect(() => {
    if (!editingId || Object.keys(editData).length === 0) return;
    debouncedSave(editingId, editData);
  }, [editingId, editData, debouncedSave]);

  // cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!editingId) return;
      if (!e.key?.startsWith("unsaved_application_")) return;

      const applicationId = e.key.replace("unsaved_application_", "");
      if (applicationId !== editingId) return;

      if (!e.newValue) {
        setHasAutoSavedDraft(false);
        return;
      }

      try {
        const parsed: unknown = JSON.parse(e.newValue);

        if (isValidStoredDraft(parsed)) {
          setEditData(parsed.formData);
          setHasAutoSavedDraft(true);
        }
      } catch (error) {
        console.error("error syncing draft from another tab:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [editingId]);

  // cleanup expired drafts on mount
  useEffect(() => {
    cleanupExpiredDrafts();
  }, []);

  // clear timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // actions
  const handleEdit = useCallback((application: JobApplication) => {
    if (lastEditingId.current !== application.id) {
      hasRestoredDrafts.current = false;
      lastEditingId.current = application.id;
    }

    const existingDraft = loadDraftFromLocalStorage(application.id);
    setEditingId(application.id);

    if (existingDraft && !hasRestoredDrafts.current) {
      setEditData(existingDraft.formData);
      setShowRestorationBanner(true);
      setRestorationTimestamp(existingDraft.lastUpdated);
      setHasAutoSavedDraft(true);
      hasRestoredDrafts.current = true;
      return;
    }

    setEditData({
      company_name: application.company_name,
      job_title: application.job_title,
      application_status: application.application_status,
      interview_stage: application.interview_stage,
      recruiter_name: application.recruiter_name,
      coach_notes: application.coach_notes,
      mentee_notes: application.mentee_notes,
      date_applied: application.date_applied,
    });

    setHasAutoSavedDraft(false);
  }, []);

  const handleSave = useCallback(
    async (
      applicationId: string,
      onUpdateApplication: (
        id: string,
        updates: Partial<JobApplication>,
      ) => Promise<void>,
    ) => {
      try {
        await onUpdateApplication(applicationId, editData);

        setEditingId(null);
        setEditData({});
        setShowRestorationBanner(false);
        setHasAutoSavedDraft(false);

        clearDraftFromLocalStorage(applicationId);

        hasRestoredDrafts.current = false;
        lastEditingId.current = null;
      } catch (error) {
        console.error("error saving application:", error);
      }
    },
    [editData],
  );

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditData({});
    setShowRestorationBanner(false);
    setHasAutoSavedDraft(false);
  }, []);

  const handleDiscardDraft = useCallback(() => {
    if (!editingId) return;

    clearDraftFromLocalStorage(editingId);
    setShowRestorationBanner(false);
    setHasAutoSavedDraft(false);
    hasRestoredDrafts.current = false;

    toast({
      title: "Draft Discarded",
      description: "Your unsaved changes have been discarded.",
    });
  }, [editingId, toast]);

  const handleDismissBanner = useCallback(() => {
    setShowRestorationBanner(false);
  }, []);

  const handleEditDataChange = useCallback(
    (updates: Partial<JobApplication>) => {
      setEditData((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

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
    handleDismissBanner,
  };
};
