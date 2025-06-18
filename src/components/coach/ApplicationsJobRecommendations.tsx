
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

// Local storage keys for preserving state
const FORM_STATE_KEY = 'coach_job_recommendations_form_state';
const FORM_OPEN_KEY = 'coach_job_recommendations_form_open';

const ApplicationsJobRecommendations = () => {
  const { user } = useAuthState();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(() => {
    // Restore form open state from localStorage
    const savedState = localStorage.getItem(FORM_OPEN_KEY);
    return savedState ? JSON.parse(savedState) : false;
  });

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
    getWeekOptions,
    getValidRecommendations,
    setSelectedMentees,
    setJobRecommendations
  } = useJobRecommendationForm();

  const { addRecommendation } = useJobRecommendations({ 
    userId: user?.id || '', 
    isCoach: true 
  });

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    if (isFormOpen) {
      const formState = {
        selectedMentees,
        weekStartDate,
        jobRecommendations
      };
      localStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState));
    }
  }, [selectedMentees, weekStartDate, jobRecommendations, isFormOpen]);

  // Save form open state
  useEffect(() => {
    localStorage.setItem(FORM_OPEN_KEY, JSON.stringify(isFormOpen));
  }, [isFormOpen]);

  // Restore form state when component mounts
  useEffect(() => {
    if (isFormOpen) {
      const savedFormState = localStorage.getItem(FORM_STATE_KEY);
      if (savedFormState) {
        try {
          const state = JSON.parse(savedFormState);
          if (state.selectedMentees) setSelectedMentees(state.selectedMentees);
          if (state.weekStartDate) setWeekStartDate(state.weekStartDate);
          if (state.jobRecommendations) setJobRecommendations(state.jobRecommendations);
        } catch (error) {
          console.error('Error restoring form state:', error);
        }
      }
    }
  }, [isFormOpen]);

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
      
      // Show success toast without the problematic popup
      toast({
        title: "Success",
        description: `${totalRecommendations} job recommendation(s) sent successfully to ${selectedMentees.length} mentee(s).`,
      });

      // Clear saved state after successful submission
      localStorage.removeItem(FORM_STATE_KEY);
      localStorage.removeItem(FORM_OPEN_KEY);
      
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    // Don't reset form immediately, just close it
    setIsFormOpen(false);
  };

  const handleExpand = () => {
    setIsFormOpen(true);
  };

  const handleClearDraft = () => {
    localStorage.removeItem(FORM_STATE_KEY);
    localStorage.removeItem(FORM_OPEN_KEY);
    resetForm();
    setIsFormOpen(false);
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
