
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { useEnhancedJobRecommendations } from '@/hooks/useEnhancedJobRecommendations';
import { useJobViewHandler } from '@/hooks/useJobViewHandler';
import EnhancedRecommendationsTabs from './job-recommendations/EnhancedRecommendationsTabs';

interface EnhancedWeeklyJobRecommendationsProps {
  userId: string;
}

const EnhancedWeeklyJobRecommendations = ({ userId }: EnhancedWeeklyJobRecommendationsProps) => {
  const [activeTab, setActiveTab] = useState('active');
  
  const {
    recommendations,
    loading,
    actionLoading,
    handleMarkAsAppliedWithJobTracker,
    handleArchiveWithValidation,
    handleReactivateWithValidation
  } = useEnhancedJobRecommendations({ userId });

  const { handleViewJob } = useJobViewHandler();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedRecommendationsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          recommendations={recommendations}
          loading={loading}
          actionLoading={actionLoading}
          onViewJob={handleViewJob}
          onMarkAsApplied={handleMarkAsAppliedWithJobTracker}
          onArchive={handleArchiveWithValidation}
          onReactivate={handleReactivateWithValidation}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedWeeklyJobRecommendations;
