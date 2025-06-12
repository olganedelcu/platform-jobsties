
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, CheckSquare, Archive, List } from 'lucide-react';
import { useJobRecommendationArchive } from '@/hooks/useJobRecommendationArchive';
import { JobRecommendation } from '@/types/jobRecommendations';
import EnhancedRecommendationCard from './job-recommendations/EnhancedRecommendationCard';
import { EmptyState } from './job-recommendations/EmptyState';

interface EnhancedWeeklyJobRecommendationsProps {
  userId: string;
}

const EnhancedWeeklyJobRecommendations = ({ userId }: EnhancedWeeklyJobRecommendationsProps) => {
  const [activeTab, setActiveTab] = useState('active');
  const [recommendations, setRecommendations] = useState<{
    active: JobRecommendation[];
    applied: JobRecommendation[];
    all: JobRecommendation[];
  }>({
    active: [],
    applied: [],
    all: []
  });
  const [loading, setLoading] = useState(true);

  const {
    loading: actionLoading,
    handleMarkAsApplied,
    handleArchive,
    handleReactivate,
    fetchRecommendationsByStatus
  } = useJobRecommendationArchive({
    userId,
    isCoach: false,
    onRecommendationUpdated: fetchAllRecommendations
  });

  const fetchAllRecommendations = async () => {
    setLoading(true);
    try {
      const [activeRecs, appliedRecs, allRecs] = await Promise.all([
        fetchRecommendationsByStatus('active'),
        fetchRecommendationsByStatus('applied'),
        fetchRecommendationsByStatus()
      ]);

      setRecommendations({
        active: activeRecs,
        applied: appliedRecs,
        all: allRecs
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllRecommendations();
    }
  }, [userId]);

  const handleViewJob = (jobLink: string) => {
    if (!jobLink) {
      console.error('No job link provided');
      return;
    }

    let url = jobLink.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening job link:', error);
    }
  };

  const renderRecommendationsList = (recs: JobRecommendation[], emptyType: string) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="text-lg">Loading recommendations...</div>
        </div>
      );
    }

    if (recs.length === 0) {
      return <EmptyState type={emptyType} />;
    }

    return (
      <div className="space-y-3">
        {recs.map((recommendation) => (
          <EnhancedRecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onViewJob={handleViewJob}
            onMarkAsApplied={handleMarkAsApplied}
            onArchive={handleArchive}
            onReactivate={handleReactivate}
            loading={actionLoading}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active
              {recommendations.active.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {recommendations.active.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="applied" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Applied
              {recommendations.applied.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {recommendations.applied.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All
              {recommendations.all.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {recommendations.all.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Active Job Recommendations</h3>
                <Badge variant="outline">{recommendations.active.length}</Badge>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {renderRecommendationsList(recommendations.active, 'no-active-recommendations')}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applied" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Applied Jobs</h3>
                <Badge variant="outline">{recommendations.applied.length}</Badge>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {renderRecommendationsList(recommendations.applied, 'no-applied-recommendations')}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">All Job Recommendations</h3>
                <Badge variant="outline">{recommendations.all.length}</Badge>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {renderRecommendationsList(recommendations.all, 'no-recommendations')}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedWeeklyJobRecommendations;
