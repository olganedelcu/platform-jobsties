
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Briefcase, Send, Trash2 } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useMentees } from '@/hooks/useMentees';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';

interface JobRecommendation {
  id: string;
  jobTitle: string;
  jobLink: string;
  companyName: string;
}

const ApplicationsJobRecommendations = () => {
  const { user } = useAuthState();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [weekStartDate, setWeekStartDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([
    { id: '1', jobTitle: '', jobLink: '', companyName: '' }
  ]);

  const { mentees } = useMentees();
  const { addRecommendation } = useJobRecommendations({ 
    userId: user?.id || '', 
    isCoach: true 
  });

  const addNewRecommendation = () => {
    const newId = Date.now().toString();
    setJobRecommendations(prev => [
      ...prev,
      { id: newId, jobTitle: '', jobLink: '', companyName: '' }
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

    // Validate that all recommendations have required fields
    const validRecommendations = jobRecommendations.filter(rec => 
      rec.jobTitle.trim() && rec.jobLink.trim() && rec.companyName.trim()
    );

    if (validRecommendations.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one complete job recommendation.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Send all valid recommendations to the selected mentee
      const promises = validRecommendations.map(rec => 
        addRecommendation({
          menteeId: selectedMentee,
          jobTitle: rec.jobTitle,
          jobLink: rec.jobLink,
          companyName: rec.companyName,
          weekStartDate
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `${validRecommendations.length} job recommendation(s) sent successfully.`,
      });

      // Reset form
      setJobRecommendations([{ id: '1', jobTitle: '', jobLink: '', companyName: '' }]);
      setSelectedMentee('');
      setWeekStartDate(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
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

  if (!isFormOpen) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Briefcase className="h-4 w-4" />
            Send Job Recommendations to Mentee
          </Button>
        </CardContent>
      </Card>
    );
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
            onClick={() => setIsFormOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mentee and Week Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="menteeSelect">Select Mentee</Label>
              <Select
                value={selectedMentee}
                onValueChange={setSelectedMentee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mentee" />
                </SelectTrigger>
                <SelectContent>
                  {mentees.length === 0 ? (
                    <SelectItem value="" disabled>No mentees found</SelectItem>
                  ) : (
                    mentees.map((mentee) => (
                      <SelectItem key={mentee.id} value={mentee.id}>
                        {mentee.first_name} {mentee.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weekStartDate">Week</Label>
              <Select
                value={weekStartDate}
                onValueChange={setWeekStartDate}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getWeekOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Recommendations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Job Recommendations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewRecommendation}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Job
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {jobRecommendations.map((recommendation, index) => (
                <Card key={recommendation.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">Job #{index + 1}</h4>
                    {jobRecommendations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecommendation(recommendation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`jobTitle-${recommendation.id}`} className="text-xs">
                        Job Title
                      </Label>
                      <Input
                        id={`jobTitle-${recommendation.id}`}
                        value={recommendation.jobTitle}
                        onChange={(e) => updateRecommendation(recommendation.id, 'jobTitle', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`companyName-${recommendation.id}`} className="text-xs">
                        Company Name
                      </Label>
                      <Input
                        id={`companyName-${recommendation.id}`}
                        value={recommendation.companyName}
                        onChange={(e) => updateRecommendation(recommendation.id, 'companyName', e.target.value)}
                        placeholder="e.g. Google"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Label htmlFor={`jobLink-${recommendation.id}`} className="text-xs">
                      Job Application Link
                    </Label>
                    <Input
                      id={`jobLink-${recommendation.id}`}
                      type="url"
                      value={recommendation.jobLink}
                      onChange={(e) => updateRecommendation(recommendation.id, 'jobLink', e.target.value)}
                      placeholder="https://company.com/careers/job-posting"
                      className="text-sm"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={!selectedMentee}
            >
              <Send className="h-4 w-4 mr-2" />
              Send {jobRecommendations.filter(rec => rec.jobTitle.trim() && rec.jobLink.trim() && rec.companyName.trim()).length} Recommendation(s)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApplicationsJobRecommendations;
