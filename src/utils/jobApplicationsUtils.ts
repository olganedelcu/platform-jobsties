
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

export const saveDraftToLocalStorage = (editingId: string, editData: any) => {
  try {
    if (!editingId || !editData || Object.keys(editData).length === 0) {
      return;
    }

    const savedDrafts = localStorage.getItem('tracker-draft-changes');
    let drafts = {};
    
    if (savedDrafts) {
      try {
        drafts = JSON.parse(savedDrafts);
      } catch (error) {
        console.error('Error parsing saved drafts:', error);
        drafts = {};
      }
    }
    
    drafts[editingId] = {
      data: editData,
      timestamp: Date.now()
    };
    
    localStorage.setItem('tracker-draft-changes', JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving draft to localStorage:', error);
  }
};

export const clearDraftFromLocalStorage = (applicationId: string) => {
  try {
    const savedDrafts = localStorage.getItem('tracker-draft-changes');
    if (!savedDrafts) return;
    
    const drafts = JSON.parse(savedDrafts);
    delete drafts[applicationId];
    
    if (Object.keys(drafts).length > 0) {
      localStorage.setItem('tracker-draft-changes', JSON.stringify(drafts));
    } else {
      localStorage.removeItem('tracker-draft-changes');
    }
  } catch (error) {
    console.error('Error clearing draft from localStorage:', error);
  }
};

export const loadDraftsFromLocalStorage = () => {
  try {
    const savedDrafts = localStorage.getItem('tracker-draft-changes');
    if (!savedDrafts) return {};
    
    const drafts = JSON.parse(savedDrafts);
    const now = Date.now();
    const cleanedDrafts = {};
    
    // Check if drafts are still valid (within 24 hours)
    Object.keys(drafts).forEach(applicationId => {
      const draft = drafts[applicationId];
      if (draft && draft.timestamp) {
        const timeDiff = now - draft.timestamp;
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (timeDiff <= twentyFourHours) {
          cleanedDrafts[applicationId] = draft;
        }
      }
    });
    
    // Update localStorage with cleaned drafts
    if (Object.keys(cleanedDrafts).length > 0) {
      localStorage.setItem('tracker-draft-changes', JSON.stringify(cleanedDrafts));
      return cleanedDrafts;
    } else {
      localStorage.removeItem('tracker-draft-changes');
      return {};
    }
  } catch (error) {
    console.error('Error loading draft changes:', error);
    // Clean up corrupted data
    try {
      localStorage.removeItem('tracker-draft-changes');
    } catch (cleanupError) {
      console.error('Error cleaning up corrupted draft data:', cleanupError);
    }
    return {};
  }
};
