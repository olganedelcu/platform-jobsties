
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useJobRecommendationFormState } from '@/hooks/useJobRecommendationFormState';
import JobRecommendationFormSection from './JobRecommendationFormSection';
import JobRecommendationCollapsed from './JobRecommendationCollapsed';
import JobRecommendationFormHeader from './JobRecommendationFormHeader';
import JobRecommendationFormActions from './JobRecommendationFormActions';

const ApplicationsJobRecommendations = () => {
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
    hasDraftData,
    isFormOpen,
    setIsFormOpen
  } = useJobRecommendationFormState();

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
      <JobRecommendationFormHeader
        hasDraftData={hasDraftData()}
        onClearDraft={handleClearDraft}
        onCancel={handleCancel}
      />
      <CardContent>
        <JobRecommendationFormActions
          selectedMentees={selectedMentees}
          weekStartDate={weekStartDate}
          getValidRecommendations={getValidRecommendations}
          resetForm={resetForm}
          setIsFormOpen={setIsFormOpen}
        >
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
        </JobRecommendationFormActions>
      </CardContent>
    </Card>
  );
};

export default ApplicationsJobRecommendations;
