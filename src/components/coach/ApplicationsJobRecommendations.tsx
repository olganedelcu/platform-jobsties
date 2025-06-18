
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Briefcase } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';
import { useJobRecommendationForm } from '@/hooks/useJobRecommendationForm';
import JobRecommendationFormSection from './JobRecommendationFormSection';
import JobRecommendationCollapsed from './JobRecommendationCollapsed';

const ApplicationsJobRecommendations = () => {
  const { user } = useAuthState();
  const { toast } = useToast();

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

  const { addRecommendation } = useJobRecommendations({ 
    userId: user?.id || '', 
    isCoach: true 
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMentees.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one mentee.",
        variant: "destructive"
      });
      return;
    }

    const validRecommendations = getValidRecommendations();

    if (validRecommendations.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one complete job recommendation.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create all combinations of mentees and recommendations
      const promises = [];
      for (const menteeId of selectedMentees) {
        for (const rec of validRecommendations) {
          promises.push(
            addRecommendation({
              menteeId,
              jobTitle: rec.jobTitle,
              jobLink: rec.jobLink,
              companyName: rec.companyName,
              description: rec.description,
              weekStartDate
            })
          );
        }
      }

      await Promise.all(promises);

      const totalRecommendations = validRecommendations.length * selectedMentees.length;
      
      toast({
        title: "Success",
        description: `${totalRecommendations} job recommendation(s) sent successfully to ${selectedMentees.length} mentee(s).`,
      });

      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error sending recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to send job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    // Just close the form, don't reset data
    setIsFormOpen(false);
  };

  const handleExpand = () => {
    setIsFormOpen(true);
  };

  const handleClearDraft = () => {
    clearDraft();
    setIsFormOpen(false);
    toast({
      title: "Draft Cleared",
      description: "All draft data has been cleared.",
    });
  };

  if (!isFormOpen) {
    return <JobRecommendationCollapsed onExpand={handleExpand} />;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Send Job Recommendations
            {hasDraftData() && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Draft Saved
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearDraft}
              className="text-xs"
            >
              Clear Draft
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <JobRecommendationFormSection
            selectedMentees={selectedMentees}
            onToggleMentee={toggleMenteeSelection}
            weekStartDate={weekStartDate}
            onWeekChange={setWeekStartDate}
            jobRecommendations={jobRecommendations}
            onAddRecommendation={addNewRecommendation}
            onUpdateRecommendation={updateRecommendation}
            onRemoveRecommendation={removeRecommendation}
            getWeekOptions={getWeekOptions}
            getValidRecommendations={getValidRecommendations}
            onCancel={handleCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default ApplicationsJobRecommendations;
