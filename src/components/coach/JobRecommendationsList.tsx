
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import BulkActionsSection from './BulkActionsSection';
import JobRecommendationCard from './JobRecommendationCard';

interface JobRecommendationsListProps {
  uniqueRecommendations: any[];
  recommendations: any[];
  menteeNames: { [key: string]: string };
  selectedAssignments: string[];
  recommendationsLoading: boolean;
  menteeNamesLoading: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectAssignment: (assignmentId: string, checked: boolean) => void;
  onDeleteSelected: () => void;
  onAssignToMoreMentees: (recommendation: any) => void;
  onDeleteRecommendation: (assignmentId: string) => void;
}

const JobRecommendationsList = ({
  uniqueRecommendations,
  recommendations,
  menteeNames,
  selectedAssignments,
  recommendationsLoading,
  menteeNamesLoading,
  onSelectAll,
  onSelectAssignment,
  onDeleteSelected,
  onAssignToMoreMentees,
  onDeleteRecommendation
}: JobRecommendationsListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Job Recommendations</CardTitle>
            <p className="text-sm text-gray-600">
              {uniqueRecommendations.length} unique job recommendations sent to mentees
            </p>
          </div>
          <BulkActionsSection 
            selectedAssignments={selectedAssignments}
            onDeleteSelected={onDeleteSelected}
          />
        </div>
      </CardHeader>
      <CardContent>
        {recommendationsLoading || menteeNamesLoading ? (
          <div className="text-center py-8">Loading recommendations...</div>
        ) : uniqueRecommendations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
            <p>Start by adding job recommendations for your mentees using the form above.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 border-b pb-4">
              <Checkbox
                checked={selectedAssignments.length === recommendations.length && recommendations.length > 0}
                onCheckedChange={onSelectAll}
              />
              <label className="text-sm font-medium">
                Select All ({recommendations.length} assignments)
              </label>
            </div>

            {uniqueRecommendations.map((recommendation, index) => (
              <JobRecommendationCard
                key={`${recommendation.job_title}-${recommendation.company_name}-${recommendation.job_link}-${index}`}
                recommendation={recommendation}
                menteeNames={menteeNames}
                selectedAssignments={selectedAssignments}
                onSelectAssignment={onSelectAssignment}
                onAssignToMoreMentees={onAssignToMoreMentees}
                onDeleteRecommendation={onDeleteRecommendation}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobRecommendationsList;
