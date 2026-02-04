
import React, { memo } from 'react';
import EnhancedWeeklyJobRecommendations from '@/components/EnhancedWeeklyJobRecommendations';
import TrackerStats from './TrackerStats';
import TrackerTabs from './TrackerTabs';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';
import { User } from '@supabase/supabase-js';

interface TrackerContentProps {
  user: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  statistics: {
    totalApplications: number;
    appliedCount: number;
    toBeConsideredCount: number;
    interviewingCount: number;
    rejectedCount: number;
    offersCount: number;
    applicationsThisMonth: number;
  };
  filteredApplications: JobApplication[];
  applicationsLoading: boolean;
  onAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
  onUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  onDeleteApplication: (applicationId: string) => Promise<void>;
  refetchApplications: () => Promise<void>;
}

const TrackerContent = memo(({
  user,
  activeTab,
  onTabChange,
  statistics,
  filteredApplications,
  applicationsLoading,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  refetchApplications
}: TrackerContentProps) => (
  <main className="max-w-7xl mx-auto pt-28 py-8 px-6">
    {/* job recommendatins with archive */}
    <div className="mb-8">
      <EnhancedWeeklyJobRecommendations 
        userId={user.id} 
        onApplicationAdded={refetchApplications}
      />
    </div>

    <TrackerStats statistics={statistics} />

    <div className="space-y-8">
      <TrackerTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        statistics={statistics}
        filteredApplications={filteredApplications}
        applicationsLoading={applicationsLoading}
        onAddApplication={onAddApplication}
        onUpdateApplication={onUpdateApplication}
        onDeleteApplication={onDeleteApplication}
      />
    </div>
  </main>
));

TrackerContent.displayName = 'TrackerContent';

export default TrackerContent;
