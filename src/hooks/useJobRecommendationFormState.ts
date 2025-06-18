
import { useState, useEffect } from 'react';
import { useJobRecommendationForm } from '@/hooks/useJobRecommendationForm';

export const useJobRecommendationFormState = () => {
  const {
    selectedMentees,
    toggleMenteeSelection,
    weekStartDate,
    setWeekStartDate,
    jobRecommendations,
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
  } = useJobRecommendationForm();

  const [isFormOpen, setIsFormOpen] = useState(() => getFormOpenState());

  // Save form open state whenever it changes
  useEffect(() => {
    saveFormOpenState(isFormOpen);
  }, [isFormOpen, saveFormOpenState]);

  // Handle page visibility changes to preserve state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden - preserving form state');
      } else {
        console.log('Page visible - maintaining form state');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormOpen && hasDraftData()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormOpen, hasDraftData]);

  return {
    // Form state
    selectedMentees,
    toggleMenteeSelection,
    weekStartDate,
    setWeekStartDate,
    jobRecommendations,
    addNewRecommendation,
    removeRecommendation,
    updateRecommendation,
    
    // Form actions
    resetForm,
    clearDraft,
    getWeekOptions,
    getValidRecommendations,
    hasDraftData,
    
    // UI state
    isFormOpen,
    setIsFormOpen
  };
};
