
import { useState, useEffect, useRef } from 'react';
import { format, startOfWeek, addWeeks } from 'date-fns';

export interface JobRecommendation {
  id: string;
  jobTitle: string;
  jobLink: string;
  companyName: string;
  description: string;
}

// Enhanced localStorage keys with timestamps
const FORM_STATE_KEY = 'coach_job_recommendations_form_state';
const FORM_OPEN_KEY = 'coach_job_recommendations_form_open';
const FORM_TIMESTAMP_KEY = 'coach_job_recommendations_timestamp';

export const useJobRecommendationForm = () => {
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [weekStartDate, setWeekStartDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([
    { id: '1', jobTitle: '', jobLink: '', companyName: '', description: '' }
  ]);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);

  // Initialize form state from localStorage on mount
  useEffect(() => {
    if (!isInitialized.current) {
      try {
        const savedFormState = localStorage.getItem(FORM_STATE_KEY);
        const savedFormOpen = localStorage.getItem(FORM_OPEN_KEY);
        
        if (savedFormState && savedFormOpen) {
          const state = JSON.parse(savedFormState);
          const isOpen = JSON.parse(savedFormOpen);
          
          // Only restore if form was previously open
          if (isOpen && state) {
            console.log('Restoring job recommendation form state from localStorage');
            
            if (state.selectedMentees && Array.isArray(state.selectedMentees)) {
              setSelectedMentees(state.selectedMentees);
            }
            if (state.weekStartDate) {
              setWeekStartDate(state.weekStartDate);
            }
            if (state.jobRecommendations && Array.isArray(state.jobRecommendations)) {
              setJobRecommendations(state.jobRecommendations);
            }
          }
        }
      } catch (error) {
        console.error('Error restoring form state:', error);
        // Clear corrupted data
        localStorage.removeItem(FORM_STATE_KEY);
        localStorage.removeItem(FORM_OPEN_KEY);
        localStorage.removeItem(FORM_TIMESTAMP_KEY);
      }
      isInitialized.current = true;
    }
  }, []);

  // Debounced save to localStorage - more aggressive saving
  const debouncedSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const formState = {
          selectedMentees,
          weekStartDate,
          jobRecommendations,
          timestamp: Date.now()
        };
        
        localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
        localStorage.setItem(FORM_TIMESTAMP_KEY, Date.now().toString());
        console.log('Form state auto-saved to localStorage');
      } catch (error) {
        console.error('Error saving form state:', error);
      }
    }, 500); // Reduced from 1000ms to 500ms for more frequent saving
  };

  // Auto-save form state when data changes
  useEffect(() => {
    if (isInitialized.current) {
      debouncedSave();
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedMentees, weekStartDate, jobRecommendations]);

  // Save immediately when page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isInitialized.current) {
        try {
          const formState = {
            selectedMentees,
            weekStartDate,
            jobRecommendations,
            timestamp: Date.now()
          };
          
          localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
          console.log('Form state saved on page unload');
        } catch (error) {
          console.error('Error saving form state on unload:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isInitialized.current) {
        // Save immediately when tab becomes hidden
        try {
          const formState = {
            selectedMentees,
            weekStartDate,
            jobRecommendations,
            timestamp: Date.now()
          };
          
          localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
          console.log('Form state saved on visibility change');
        } catch (error) {
          console.error('Error saving form state on visibility change:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedMentees, weekStartDate, jobRecommendations]);

  const addNewRecommendation = () => {
    const newId = Date.now().toString();
    setJobRecommendations(prev => [
      ...prev,
      { id: newId, jobTitle: '', jobLink: '', companyName: '', description: '' }
    ]);
  };

  const removeRecommendation = (id: string) => {
    if (jobRecommendations.length > 1) {
      setJobRecommendations(prev => prev.filter(rec => rec.id !== id));
    }
  };

  const updateRecommendation = (id: string, field: keyof Omit<JobRecommendation, 'id'>, value: string) => {
    setJobRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, [field]: value } : rec
    ));
  };

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev => 
      prev.includes(menteeId)
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  const resetForm = () => {
    setJobRecommendations([{ id: '1', jobTitle: '', jobLink: '', companyName: '', description: '' }]);
    setSelectedMentees([]);
    setWeekStartDate(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
    
    // Clear localStorage
    localStorage.removeItem(FORM_STATE_KEY);
    localStorage.removeItem(FORM_OPEN_KEY);
    localStorage.removeItem(FORM_TIMESTAMP_KEY);
  };

  const clearDraft = () => {
    console.log('Clearing draft from localStorage');
    localStorage.removeItem(FORM_STATE_KEY);
    localStorage.removeItem(FORM_OPEN_KEY);
    localStorage.removeItem(FORM_TIMESTAMP_KEY);
    resetForm();
  };

  const saveFormOpenState = (isOpen: boolean) => {
    try {
      localStorage.setItem(FORM_OPEN_KEY, JSON.stringify(isOpen));
      console.log('Form open state saved:', isOpen);
    } catch (error) {
      console.error('Error saving form open state:', error);
    }
  };

  const getFormOpenState = (): boolean => {
    try {
      const savedState = localStorage.getItem(FORM_OPEN_KEY);
      const isOpen = savedState ? JSON.parse(savedState) : false;
      console.log('Retrieved form open state:', isOpen);
      return isOpen;
    } catch (error) {
      console.error('Error reading form open state:', error);
      return false;
    }
  };

  const getWeekOptions = () => {
    const options = [];
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Current week and next 3 weeks
    for (let i = 0; i < 4; i++) {
      const week = addWeeks(currentWeek, i);
      const weekStr = format(week, 'yyyy-MM-dd');
      const displayStr = format(week, 'MMM dd, yyyy');
      options.push({ value: weekStr, label: `Week of ${displayStr}` });
    }
    
    return options;
  };

  const getValidRecommendations = () => {
    return jobRecommendations.filter(rec => 
      rec.jobTitle.trim() && rec.jobLink.trim() && rec.companyName.trim()
    );
  };

  const hasDraftData = () => {
    return selectedMentees.length > 0 || 
           jobRecommendations.some(rec => 
             rec.jobTitle.trim() || rec.jobLink.trim() || rec.companyName.trim() || rec.description.trim()
           );
  };

  return {
    selectedMentees,
    setSelectedMentees,
    toggleMenteeSelection,
    weekStartDate,
    setWeekStartDate,
    jobRecommendations,
    setJobRecommendations,
    addNewRecommendation,
    removeRecommendation,
    updateRecommendation,
    resetForm,
    clearDraft,
    getWeekOptions,
    getValidRecommendations,
    saveFormOpenState,
    getFormOpenState,
    hasDraftData
  };
};
