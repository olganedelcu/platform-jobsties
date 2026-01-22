
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ExternalLink, User, UserPlus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import MenteeNameCell from './MenteeNameCell';
import { JobRecommendation } from '@/types/jobRecommendations';

interface RecommendationAssignment {
  id: string;
  mentee_id: string;
  week_start_date: string;
  created_at: string;
}

interface GroupedRecommendation extends JobRecommendation {
  assignments: RecommendationAssignment[];
}

interface JobRecommendationCardProps {
  recommendation: GroupedRecommendation;
  menteeNames: { [key: string]: string };
  selectedAssignments: string[];
  onSelectAssignment: (assignmentId: string, checked: boolean) => void;
  onAssignToMoreMentees: (recommendation: GroupedRecommendation) => void;
  onDeleteRecommendation: (assignmentId: string) => void;
}

const JobRecommendationCard = ({
  recommendation,
  menteeNames,
  selectedAssignments,
  onSelectAssignment,
  onAssignToMoreMentees,
  onDeleteRecommendation
}: JobRecommendationCardProps) => {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2 text-lg">
            {recommendation.job_title}
          </h4>
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <Building2 className="h-4 w-4" />
            <span className="font-medium">{recommendation.company_name}</span>
          </div>
          
          {recommendation.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {recommendation.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(recommendation.job_link, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssignToMoreMentees(recommendation)}
            className="text-blue-600 hover:text-blue-700"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Assigned to {recommendation.assignments.length} mentee(s)
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendation.assignments.map((assignment) => (
            <div key={assignment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={selectedAssignments.includes(assignment.id)}
                    onCheckedChange={(checked) => onSelectAssignment(assignment.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <MenteeNameCell
                      menteeId={assignment.mentee_id}
                      menteeName={menteeNames[assignment.mentee_id]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Week of {format(new Date(assignment.week_start_date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sent {format(new Date(assignment.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteRecommendation(assignment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobRecommendationCard;
