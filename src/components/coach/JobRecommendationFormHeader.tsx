
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, X } from 'lucide-react';

interface JobRecommendationFormHeaderProps {
  hasDraftData: boolean;
  onClearDraft: () => void;
  onCancel: () => void;
}

const JobRecommendationFormHeader = ({
  hasDraftData,
  onClearDraft,
  onCancel
}: JobRecommendationFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Send Job Recommendations
          {hasDraftData && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Draft Saved
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearDraft}
            className="text-xs"
          >
            Clear Draft
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default JobRecommendationFormHeader;
