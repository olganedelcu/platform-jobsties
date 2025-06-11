import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CoachNavigation from '@/components/CoachNavigation';
import JobRecommendationForm from '@/components/coach/JobRecommendationForm';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, Calendar, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const CoachJobRecommendations = () => {
  const { user, loading, handleSignOut } = useAuthState();
  const { recommendations, loading: recommendationsLoading, deleteRecommendation } = useJobRecommendations({
    userId: user?.id || '',
    isCoach: true
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    const weekKey = rec.week_start_date;
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(rec);
    return acc;
  }, {} as Record<string, typeof recommendations>);

  const sortedWeeks = Object.keys(groupedRecommendations).sort((a, b) => b.localeCompare(a));

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CoachNavigation user={user} onSignOut={handleSignOut} />
        
        <main className="max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Recommendations</h1>
            <p className="text-gray-600 mt-2">Assign personalized job recommendations to your mentees</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add New Recommendation Form */}
            <div className="lg:col-span-1">
              <JobRecommendationForm coachId={user.id} />
            </div>

            {/* Existing Recommendations */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendationsLoading ? (
                    <div className="text-center py-8">Loading recommendations...</div>
                  ) : recommendations.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
                      <p>Start by adding job recommendations for your mentees.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sortedWeeks.map((weekKey) => (
                        <div key={weekKey}>
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-medium">
                              Week of {format(new Date(weekKey), 'MMM dd, yyyy')}
                            </h3>
                            <Badge variant="secondary">
                              {groupedRecommendations[weekKey].length}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            {groupedRecommendations[weekKey].map((recommendation) => (
                              <div key={recommendation.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      {recommendation.job_title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                      <div className="flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        <span>{recommendation.company_name}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>Mentee ID: {recommendation.mentee_id.slice(0, 8)}...</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Calendar className="h-3 w-3" />
                                      <span>Added {format(new Date(recommendation.created_at), 'MMM dd, yyyy')}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
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
                                      onClick={() => deleteRecommendation(recommendation.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachJobRecommendations;
