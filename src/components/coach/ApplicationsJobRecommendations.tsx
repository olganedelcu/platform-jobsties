
import React, { useState } from 'react';
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
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    selectedMentee,
    setSelectedMentee,
    weekStartDate,
    setWeekStartDate,
    jobRecommendations,
    addNewRecommendation,
    removeRecommendation,
    updateRecommendation,
    resetForm,
    getWeekOptions,
    getValidRecommendations
  } = useJobRecommendationForm();

  const { addRecommendation } = useJobRecommendations({ 
    userId: user?.id || '', 
    isCoach: true 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMentee) {
      toast({
        title: "Validation Error",
        description: "Please select a mentee.",
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
      const promises = validRecommendations.map(rec => 
        addRecommendation({
          menteeId: selectedMentee,
          jobTitle: rec.jobTitle,
          jobLink: rec.jobLink,
          companyName: rec.companyName,
          description: rec.description,
          weekStartDate
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `${validRecommendations.length} job recommendation(s) sent successfully.`,
      });

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
    resetForm();
    setIsFormOpen(false);
  };

  if (!isFormOpen) {
    return <JobRecommendationCollapsed onExpand={() => setIsFormOpen(true)} />;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Send Job Recommendations
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <JobRecommendationFormSection
            selectedMentee={selectedMentee}
            onMenteeChange={setSelectedMentee}
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
