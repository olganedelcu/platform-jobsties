
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  CheckCircle,
  Archive,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { JobRecommendation } from '@/types/jobRecommendations';

interface RecommendationCardActionsProps {
  recommendation: JobRecommendation;
  loading: boolean;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
  onArchive: (recommendationId: string) => void;
  onReactivate: (recommendationId: string) => void;
}

const RecommendationCardActions = ({
  recommendation,
  loading,
  onViewJob,
  onMarkAsApplied,
  onArchive,
  onReactivate
}: RecommendationCardActionsProps) => {
  const [isMarkingAsApplied, setIsMarkingAsApplied] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  const canMarkAsApplied = recommendation.status === 'active';
  const canArchive = recommendation.status === 'active';
  const canReactivate = recommendation.status === 'archived' || recommendation.status === 'applied';

  const handleMarkAsApplied = async () => {
    setIsMarkingAsApplied(true);
    try {
      await onMarkAsApplied(recommendation);
    } finally {
      setIsMarkingAsApplied(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onArchive(recommendation.id);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await onReactivate(recommendation.id);
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewJob(recommendation.job_link)}
        className="flex items-center gap-1 text-xs px-2 py-1 h-7"
      >
        <ExternalLink className="h-3 w-3" />
        View Job
      </Button>

      {canMarkAsApplied && (
        <Button
          variant="default"
          size="sm"
          onClick={handleMarkAsApplied}
          disabled={loading || isMarkingAsApplied}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 min-w-[100px] text-xs px-2 py-1 h-7"
        >
          {isMarkingAsApplied ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3" />
              Mark Applied
            </>
          )}
        </Button>
      )}

      {canArchive && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleArchive}
          disabled={loading || isArchiving}
          className="flex items-center gap-1 text-xs px-2 py-1 h-7"
        >
          {isArchiving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Archive className="h-3 w-3" />
          )}
          Archive
        </Button>
      )}

      {canReactivate && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReactivate}
          disabled={loading || isReactivating}
          className="flex items-center gap-1 text-xs px-2 py-1 h-7"
        >
          {isReactivating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RotateCcw className="h-3 w-3" />
          )}
          Reactivate
        </Button>
      )}
    </div>
  );
};

export default RecommendationCardActions;
