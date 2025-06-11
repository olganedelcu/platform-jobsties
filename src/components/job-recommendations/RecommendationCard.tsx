
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Building2, Calendar, CheckCircle, Plus, Clock } from 'lucide-react';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';

interface RecommendationCardProps {
  recommendation: JobRecommendation;
  userTimeZone: string;
  addingToTracker: string | null;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
}

const RecommendationCard = ({ 
  recommendation, 
  userTimeZone, 
  addingToTracker, 
  onViewJob, 
  onMarkAsApplied 
}: RecommendationCardProps) => (
  <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{recommendation.job_title}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Building2 className="h-4 w-4" />
          <span>{recommendation.company_name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <Calendar className="h-3 w-3" />
          <span>For week of {format(new Date(recommendation.week_start_date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Added {format(new Date(recommendation.created_at), 'MMM dd, yyyy HH:mm')} ({userTimeZone})</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewJob(recommendation.job_link);
          }}
          className="flex items-center gap-2"
          type="button"
        >
          <ExternalLink className="h-4 w-4" />
          View Job
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMarkAsApplied(recommendation);
          }}
          disabled={addingToTracker === recommendation.id}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          type="button"
        >
          {addingToTracker === recommendation.id ? (
            <>
              <Plus className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Mark as Applied
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);

export default RecommendationCard;
