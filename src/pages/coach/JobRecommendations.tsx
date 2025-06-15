
import React, { useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CoachNavigation from '@/components/CoachNavigation';
import JobRecommendationForm from '@/components/coach/JobRecommendationForm';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, Calendar, User, Trash2, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import JobRecommendationAssignmentDialog from '@/components/coach/JobRecommendationAssignmentDialog';

const CoachJobRecommendations = () => {
  const { user, loading, handleSignOut } = useAuthState();
  const { toast } = useToast();
  const { recommendations, loading: recommendationsLoading, deleteRecommendation, addRecommendation } = useJobRecommendations({
    userId: user?.id || '',
    isCoach: true
  });
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

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

  const handleAssignToMoreMentees = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentSubmit = async (menteeIds: string[], weekStartDate: string) => {
    if (!selectedRecommendation) return;

    try {
      const promises = menteeIds.map(menteeId =>
        addRecommendation({
          menteeId,
          jobTitle: selectedRecommendation.job_title,
          jobLink: selectedRecommendation.job_link,
          companyName: selectedRecommendation.company_name,
          description: selectedRecommendation.description,
          weekStartDate
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `Job recommendation assigned to ${menteeIds.length} additional mentee(s).`,
      });

      setAssignmentDialogOpen(false);
      setSelectedRecommendation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Group recommendations by job details to show unique jobs
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    const key = `${rec.job_title}-${rec.company_name}-${rec.job_link}`;
    if (!acc[key]) {
      acc[key] = {
        ...rec,
        assignments: []
      };
    }
    acc[key].assignments.push({
      id: rec.id,
      mentee_id: rec.mentee_id,
      week_start_date: rec.week_start_date,
      created_at: rec.created_at
    });
    return acc;
  }, {} as Record<string, any>);

  const uniqueRecommendations = Object.values(groupedRecommendations);

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CoachNavigation user={user} onSignOut={handleSignOut} />
        
        <main className="max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Recommendations</h1>
            <p className="text-gray-600 mt-2">Manage and assign job recommendations to your mentees</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add New Recommendation Form */}
            <div className="lg:col-span-1">
              <JobRecommendationForm coachId={user.id} />
            </div>

            {/* All Recommendations List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Job Recommendations</CardTitle>
                  <p className="text-sm text-gray-600">
                    {uniqueRecommendations.length} unique job recommendations sent to mentees
                  </p>
                </CardHeader>
                <CardContent>
                  {recommendationsLoading ? (
                    <div className="text-center py-8">Loading recommendations...</div>
                  ) : uniqueRecommendations.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
                      <p>Start by adding job recommendations for your mentees.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {uniqueRecommendations.map((recommendation) => (
                        <div key={`${recommendation.job_title}-${recommendation.company_name}`} className="border rounded-lg p-6 bg-white">
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
                                onClick={() => handleAssignToMoreMentees(recommendation)}
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
                              {recommendation.assignments.map((assignment: any) => (
                                <div key={assignment.id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        Mentee ID: {assignment.mentee_id.slice(0, 8)}...
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Week of {format(new Date(assignment.week_start_date), 'MMM dd, yyyy')}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Sent {format(new Date(assignment.created_at), 'MMM dd, yyyy')}
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteRecommendation(assignment.id)}
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <JobRecommendationAssignmentDialog
          open={assignmentDialogOpen}
          onClose={() => {
            setAssignmentDialogOpen(false);
            setSelectedRecommendation(null);
          }}
          onAssign={handleAssignmentSubmit}
          recommendationTitle={selectedRecommendation?.job_title}
          companyName={selectedRecommendation?.company_name}
        />
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachJobRecommendations;
