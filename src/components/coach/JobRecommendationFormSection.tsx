
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import JobRecommendationItem from './JobRecommendationItem';
import MenteeMultiSelector from './MenteeMultiSelector';
import { JobRecommendation } from '@/hooks/useJobRecommendationForm';

interface JobRecommendationFormSectionProps {
  selectedMentees: string[];
  onToggleMentee: (menteeId: string) => void;
  weekStartDate: string;
  onWeekChange: (value: string) => void;
  jobRecommendations: JobRecommendation[];
  onAddRecommendation: () => void;
  onUpdateRecommendation: (id: string, field: keyof Omit<JobRecommendation, 'id'>, value: string) => void;
  onRemoveRecommendation: (id: string) => void;
  getWeekOptions: () => Array<{ value: string; label: string }>;
  getValidRecommendations: () => JobRecommendation[];
  onCancel: () => void;
}

const JobRecommendationFormSection = ({
  selectedMentees,
  onToggleMentee,
  weekStartDate,
  onWeekChange,
  jobRecommendations,
  onAddRecommendation,
  onUpdateRecommendation,
  onRemoveRecommendation,
  getWeekOptions,
  getValidRecommendations,
  onCancel
}: JobRecommendationFormSectionProps) => {
  const validRecommendations = getValidRecommendations();
  const totalRecommendations = validRecommendations.length * selectedMentees.length;

  return (
    <div className="space-y-6">
      {/* Mentee and Week Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <MenteeMultiSelector
            selectedMentees={selectedMentees}
            onToggleMentee={onToggleMentee}
          />
        </div>

        <div>
          <Label htmlFor="weekStartDate">Week</Label>
          <Select
            value={weekStartDate}
            onValueChange={onWeekChange}
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
            onClick={onAddRecommendation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Job
          </Button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {jobRecommendations.map((recommendation, index) => (
            <JobRecommendationItem
              key={recommendation.id}
              recommendation={recommendation}
              index={index}
              canRemove={jobRecommendations.length > 1}
              onUpdate={onUpdateRecommendation}
              onRemove={onRemoveRecommendation}
            />
          ))}
        </div>
      </div>

      {/* Summary and Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button 
          type="submit" 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          disabled={selectedMentees.length === 0 || validRecommendations.length === 0}
        >
          <Send className="h-4 w-4 mr-2" />
          Send {totalRecommendations} Recommendation(s) to {selectedMentees.length} Mentee(s)
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default JobRecommendationFormSection;
