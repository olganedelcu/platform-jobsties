
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckSquare, List } from 'lucide-react';
import { JobRecommendation } from '@/types/jobRecommendations';
import EnhancedRecommendationsList from './EnhancedRecommendationsList';

interface EnhancedRecommendationsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  recommendations: {
    active: JobRecommendation[];
    applied: JobRecommendation[];
    all: JobRecommendation[];
  };
  loading: boolean;
  actionLoading: string | null;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
  onArchive: (recommendationId: string) => void;
  onReactivate: (recommendationId: string) => void;
}

const EnhancedRecommendationsTabs = ({
  activeTab,
  onTabChange,
  recommendations,
  loading,
  actionLoading,
  onViewJob,
  onMarkAsApplied,
  onArchive,
  onReactivate
}: EnhancedRecommendationsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
        <div className="max-h-[400px] overflow-y-auto">
          <EnhancedRecommendationsList
            recommendations={recommendations.active}
            loading={loading}
            actionLoading={actionLoading}
            emptyType="no-active-recommendations"
            onViewJob={onViewJob}
            onMarkAsApplied={onMarkAsApplied}
            onArchive={onArchive}
            onReactivate={onReactivate}
          />
        </div>
      </TabsContent>

      <TabsContent value="applied" className="mt-6">
        <div className="max-h-[400px] overflow-y-auto">
          <EnhancedRecommendationsList
            recommendations={recommendations.applied}
            loading={loading}
            actionLoading={actionLoading}
            emptyType="no-applied-recommendations"
            onViewJob={onViewJob}
            onMarkAsApplied={onMarkAsApplied}
            onArchive={onArchive}
            onReactivate={onReactivate}
          />
        </div>
      </TabsContent>

      <TabsContent value="all" className="mt-6">
        <div className="max-h-[400px] overflow-y-auto">
          <EnhancedRecommendationsList
            recommendations={recommendations.all}
            loading={loading}
            actionLoading={actionLoading}
            emptyType="no-recommendations"
            onViewJob={onViewJob}
            onMarkAsApplied={onMarkAsApplied}
            onArchive={onArchive}
            onReactivate={onReactivate}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedRecommendationsTabs;
