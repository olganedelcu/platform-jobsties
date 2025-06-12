
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle,
  Archive,
  RotateCcw,
  Clock
} from 'lucide-react';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';

interface EnhancedRecommendationCardProps {
  recommendation: JobRecommendation;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
  onArchive: (recommendationId: string) => void;
  onReactivate: (recommendationId: string) => void;
  loading: boolean;
}

const EnhancedRecommendationCard = ({
  recommendation,
  onViewJob,
  onMarkAsApplied,
  onArchive,
  onReactivate,
  loading
}: EnhancedRecommendationCardProps) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'applied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'active':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'applied':
        return <CheckCircle className="h-3 w-3" />;
      case 'archived':
        return <Archive className="h-3 w-3" />;
      case 'active':
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const canMarkAsApplied = recommendation.status === 'active';
  const canArchive = recommendation.status === 'active';
  const canReactivate = recommendation.status === 'archived' || recommendation.status === 'applied';

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">{recommendation.job_title}</h4>
            <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(recommendation.status)}`}>
              {getStatusIcon(recommendation.status)}
              {recommendation.status || 'active'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="h-4 w-4" />
            <span>{recommendation.company_name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Calendar className="h-3 w-3" />
            <span>For week of {format(new Date(recommendation.week_start_date), 'MMM dd, yyyy')}</span>
          </div>
          
          {recommendation.applied_date && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>Applied on {format(new Date(recommendation.applied_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewJob(recommendation.job_link)}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View Job
        </Button>

        {canMarkAsApplied && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onMarkAsApplied(recommendation)}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Applied
          </Button>
        )}

        {canArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onArchive(recommendation.id)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        )}

        {canReactivate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReactivate(recommendation.id)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reactivate
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedRecommendationCard;
