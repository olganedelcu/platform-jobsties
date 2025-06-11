
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, Calendar, Briefcase, CheckCircle, Plus, Clock } from 'lucide-react';
import { useJobRecommendationActions } from '@/hooks/useJobRecommendationActions';
import { useTimeZoneAwareRecommendations } from '@/hooks/useTimeZoneAwareRecommendations';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';

interface WeeklyJobRecommendationsProps {
  userId: string;
}

const WeeklyJobRecommendations = ({ userId }: WeeklyJobRecommendationsProps) => {
  const {
    currentWeekRecommendations,
    previousWeeksRecommendations,
    userTimeZone,
    currentWeekStart
  } = useTimeZoneAwareRecommendations(userId);
  
  const [addingToTracker, setAddingToTracker] = useState<string | null>(null);

  const { markAsApplied } = useJobRecommendationActions({ 
    user: { id: userId }
  });

  const handleViewJob = (jobLink: string) => {
    console.log('Opening job link:', jobLink);
    
    if (!jobLink) {
      console.error('No job link provided');
      return;
    }

    // Ensure the URL has a protocol
    let url = jobLink.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log('Successfully opened URL:', url);
    } catch (error) {
      console.error('Error opening job link:', error);
    }
  };

  const handleMarkAsApplied = async (recommendation: JobRecommendation) => {
    console.log('Marking as applied:', recommendation);
    
    if (addingToTracker === recommendation.id) {
      console.log('Already adding this recommendation, skipping');
      return;
    }

    setAddingToTracker(recommendation.id);
    
    try {
      await markAsApplied(recommendation);
      console.log('Successfully marked as applied');
    } catch (error) {
      console.error('Error marking as applied:', error);
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
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Calendar className="h-3 w-3" />
            <span>Week of {format(new Date(recommendation.week_start_date), 'MMM dd, yyyy')}</span>
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
              handleViewJob(recommendation.job_link);
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
              handleMarkAsApplied(recommendation);
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

  const totalRecommendations = currentWeekRecommendations.length + previousWeeksRecommendations.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Weekly Job Recommendations
        </CardTitle>
        {userTimeZone && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Your timezone: {userTimeZone}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Week Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">This Week</h3>
            <Badge variant="secondary">{currentWeekRecommendations.length}</Badge>
            {currentWeekStart && (
              <span className="text-sm text-gray-500">
                (Week of {format(new Date(currentWeekStart), 'MMM dd, yyyy')})
              </span>
            )}
          </div>
          
          {currentWeekRecommendations.length > 0 ? (
            <div className="space-y-3">
              {currentWeekRecommendations.map((recommendation) => (
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
        {previousWeeksRecommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Previous Weeks</h3>
              <Badge variant="outline">{previousWeeksRecommendations.length}</Badge>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {previousWeeksRecommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>
        )}

        {totalRecommendations === 0 && (
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
