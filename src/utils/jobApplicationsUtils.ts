
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
  if (editingId && Object.keys(editData).length > 0) {
    const savedDrafts = localStorage.getItem('tracker-draft-changes');
    let drafts = {};
    
    if (savedDrafts) {
      try {
        drafts = JSON.parse(savedDrafts);
      } catch (error) {
        console.error('Error parsing saved drafts:', error);
      }
    }
    
    drafts[editingId] = {
      data: editData,
      timestamp: Date.now()
    };
    
    localStorage.setItem('tracker-draft-changes', JSON.stringify(drafts));
  }
};

export const clearDraftFromLocalStorage = (applicationId: string) => {
  const savedDrafts = localStorage.getItem('tracker-draft-changes');
  if (savedDrafts) {
    try {
      const drafts = JSON.parse(savedDrafts);
      delete drafts[applicationId];
      
      if (Object.keys(drafts).length > 0) {
        localStorage.setItem('tracker-draft-changes', JSON.stringify(drafts));
      } else {
        localStorage.removeItem('tracker-draft-changes');
      }
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }
};

export const loadDraftsFromLocalStorage = () => {
  const savedDrafts = localStorage.getItem('tracker-draft-changes');
  if (savedDrafts) {
    try {
      const drafts = JSON.parse(savedDrafts);
      const now = Date.now();
      
      // Check if drafts are still valid (within reasonable time)
      Object.keys(drafts).forEach(applicationId => {
        const draft = drafts[applicationId];
        const timeDiff = now - draft.timestamp;
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (timeDiff > oneHour) {
          // Draft is too old, remove it
          delete drafts[applicationId];
        }
      });
      
      // Update localStorage with cleaned drafts
      if (Object.keys(drafts).length > 0) {
        localStorage.setItem('tracker-draft-changes', JSON.stringify(drafts));
        return drafts;
      } else {
        localStorage.removeItem('tracker-draft-changes');
        return {};
      }
    } catch (error) {
      console.error('Error loading draft changes:', error);
      localStorage.removeItem('tracker-draft-changes');
      return {};
    }
  }
  return {};
};
