
export const getStatusColor = (status: string) => {
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

interface LocalDraft {
  formData: Record<string, unknown>;
  lastUpdated: string;
  applicationId: string;
}

export const saveDraftToLocalStorage = (applicationId: string, formData: Record<string, unknown>) => {
  try {
    if (!applicationId || !formData || Object.keys(formData).length === 0) {
      return;
    }

    const draft: LocalDraft = {
      formData,
      lastUpdated: new Date().toISOString(),
      applicationId
    };
    
    localStorage.setItem(`unsaved_application_${applicationId}`, JSON.stringify(draft));
  } catch (error) {
    console.error('Error saving draft to localStorage:', error);
  }
};

export const clearDraftFromLocalStorage = (applicationId: string) => {
  try {
    localStorage.removeItem(`unsaved_application_${applicationId}`);
  } catch (error) {
    console.error('Error clearing draft from localStorage:', error);
  }
};

export const loadDraftFromLocalStorage = (applicationId: string): LocalDraft | null => {
  try {
    const draftData = localStorage.getItem(`unsaved_application_${applicationId}`);
    if (!draftData) return null;
    
    const draft: LocalDraft = JSON.parse(draftData);
    
    // Check if draft is still valid (within 7 days)
    const draftDate = new Date(draft.lastUpdated);
    const now = new Date();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    if (now.getTime() - draftDate.getTime() > sevenDaysInMs) {
      localStorage.removeItem(`unsaved_application_${applicationId}`);
      return null;
    }
    
    return draft;
  } catch (error) {
    console.error('Error loading draft from localStorage:', error);
    return null;
  }
};

export const getAllDrafts = (): LocalDraft[] => {
  try {
    const drafts: LocalDraft[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('unsaved_application_')) {
        const draftData = localStorage.getItem(key);
        if (draftData) {
          try {
            const draft: LocalDraft = JSON.parse(draftData);
            
            // Check if draft is still valid (within 7 days)
            const draftDate = new Date(draft.lastUpdated);
            const now = new Date();
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
            
            if (now.getTime() - draftDate.getTime() <= sevenDaysInMs) {
              drafts.push(draft);
            } else {
              localStorage.removeItem(key);
            }
          } catch (parseError) {
            console.error('Error parsing draft:', parseError);
            localStorage.removeItem(key);
          }
        }
      }
    }
    
    return drafts;
  } catch (error) {
    console.error('Error getting all drafts:', error);
    return [];
  }
};

export const cleanupExpiredDrafts = () => {
  try {
    const now = new Date();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('unsaved_application_')) {
        const draftData = localStorage.getItem(key);
        if (draftData) {
          try {
            const draft: LocalDraft = JSON.parse(draftData);
            const draftDate = new Date(draft.lastUpdated);
            
            if (now.getTime() - draftDate.getTime() > sevenDaysInMs) {
              localStorage.removeItem(key);
            }
          } catch (parseError) {
            console.error('Error parsing draft for cleanup:', parseError);
            localStorage.removeItem(key);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up expired drafts:', error);
  }
};
