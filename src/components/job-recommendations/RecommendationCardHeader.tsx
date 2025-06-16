
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, CheckCircle, Archive, Clock } from 'lucide-react';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';

interface RecommendationCardHeaderProps {
  recommendation: JobRecommendation;
}

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

const RecommendationCardHeader = ({ recommendation }: RecommendationCardHeaderProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold text-gray-900 text-sm">{recommendation.job_title}</h4>
        <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(recommendation.status)}`}>
          {getStatusIcon(recommendation.status)}
          {recommendation.status || 'active'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
        <Building2 className="h-3 w-3" />
        <span>{recommendation.company_name}</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <Calendar className="h-3 w-3" />
        <span>For week of {format(new Date(recommendation.week_start_date), 'MMM dd, yyyy')}</span>
      </div>
      
      {recommendation.applied_date && (
        <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
          <CheckCircle className="h-3 w-3" />
          <span>Applied on {format(new Date(recommendation.applied_date), 'MMM dd, yyyy')}</span>
        </div>
      )}
    </div>
  );
};

export default RecommendationCardHeader;
