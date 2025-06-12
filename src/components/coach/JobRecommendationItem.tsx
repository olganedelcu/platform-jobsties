
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { JobRecommendation } from '@/hooks/useJobRecommendationForm';

interface JobRecommendationItemProps {
  recommendation: JobRecommendation;
  index: number;
  canRemove: boolean;
  onUpdate: (id: string, field: keyof Omit<JobRecommendation, 'id'>, value: string) => void;
  onRemove: (id: string) => void;
}

const JobRecommendationItem = ({
  recommendation,
  index,
  canRemove,
  onUpdate,
  onRemove
}: JobRecommendationItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">Job #{index + 1}</h4>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(recommendation.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <Label htmlFor={`jobTitle-${recommendation.id}`} className="text-xs">
            Job Title
          </Label>
          <Input
            id={`jobTitle-${recommendation.id}`}
            value={recommendation.jobTitle}
            onChange={(e) => onUpdate(recommendation.id, 'jobTitle', e.target.value)}
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
            onChange={(e) => onUpdate(recommendation.id, 'companyName', e.target.value)}
            placeholder="e.g. Google"
            className="text-sm"
          />
        </div>
      </div>

      <div className="mb-3">
        <Label htmlFor={`jobLink-${recommendation.id}`} className="text-xs">
          Job Application Link
        </Label>
        <Input
          id={`jobLink-${recommendation.id}`}
          type="url"
          value={recommendation.jobLink}
          onChange={(e) => onUpdate(recommendation.id, 'jobLink', e.target.value)}
          placeholder="https://company.com/careers/job-posting"
          className="text-sm"
        />
      </div>

      <div>
        <Label htmlFor={`description-${recommendation.id}`} className="text-xs">
          Description
        </Label>
        <Textarea
          id={`description-${recommendation.id}`}
          value={recommendation.description}
          onChange={(e) => onUpdate(recommendation.id, 'description', e.target.value)}
          placeholder="Why this job is a good fit for the mentee..."
          className="text-sm min-h-[80px]"
          rows={3}
        />
      </div>
    </Card>
  );
};

export default JobRecommendationItem;
