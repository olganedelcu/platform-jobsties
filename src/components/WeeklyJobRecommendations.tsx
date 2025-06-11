
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, Calendar, Briefcase, CheckCircle, Plus } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useJobRecommendationActions } from '@/hooks/useJobRecommendationActions';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format, startOfWeek } from 'date-fns';

interface WeeklyJobRecommendationsProps {
  userId: string;
}

const WeeklyJobRecommendations = ({ userId }: WeeklyJobRecommendationsProps) => {
  const { recommendations, loading, refetchRecommendations } = useJobRecommendations({ userId, isCoach: false });
  const { markAsApplied } = useJobRecommendationActions({ 
    user: { id: userId },
    onApplicationAdded: refetchRecommendations
  });
  const [addingToTracker, setAddingToTracker] = useState<string | null>(null);

  // Get current week's recommendations
  const getCurrentWeekRecommendations = () => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
    const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    
    return recommendations.filter(rec => rec.week_start_date === currentWeekStartStr);
  };

  // Get previous weeks' recommendations
  const getPreviousWeeksRecommendations = () => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    
    return recommendations.filter(rec => rec.week_start_date !== currentWeekStartStr);
  };

  const currentWeekRecs = getCurrentWeekRecommendations();
  const previousWeeksRecs = getPreviousWeeksRecommendations();

  const handleMarkAsApplied = async (recommendation: JobRecommendation) => {
    setAddingToTracker(recommendation.id);
    try {
      await markAsApplied(recommendation);
    } finally {
      setAddingToTracker(null);
    }
  };

  const RecommendationCard = ({ recommendation }: { recommendation: JobRecommendation }) => (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{recommendation.job_title}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="h-4 w-4" />
            <span>{recommendation.company_name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Week of {format(new Date(recommendation.week_start_date), 'MMM dd, yyyy')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(recommendation.job_link, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Job
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleMarkAsApplied(recommendation)}
            disabled={addingToTracker === recommendation.id}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Weekly Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading recommendations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Weekly Job Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Week Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">This Week</h3>
            <Badge variant="secondary">{currentWeekRecs.length}</Badge>
          </div>
          
          {currentWeekRecs.length > 0 ? (
            <div className="space-y-3">
              {currentWeekRecs.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No job recommendations for this week yet.</p>
              <p className="text-sm">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>

        {/* Previous Weeks */}
        {previousWeeksRecs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Previous Weeks</h3>
              <Badge variant="outline">{previousWeeksRecs.length}</Badge>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {previousWeeksRecs.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>
        )}

        {recommendations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Job Recommendations Yet</h3>
            <p>Your coach will share personalized job recommendations here.</p>
            <p className="text-sm">These will be tailored to your skills and career goals.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyJobRecommendations;
