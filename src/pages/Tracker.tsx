
import React, { useState, useEffect, memo } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { useTrackerData } from '@/hooks/useTrackerData';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useGlobalJobRecommendations } from '@/hooks/useGlobalJobRecommendations';
import TrackerLayout from '@/components/tracker/TrackerLayout';
import TrackerContent from '@/components/tracker/TrackerContent';
import GlobalJobRecommendationsTracker from '@/components/student/GlobalJobRecommendationsTracker';
import { useLocation } from 'react-router-dom';

const Tracker = memo(() => {
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);
  const [activeTab, setActiveTab] = useState('applied');

  // Check if this is a student route
  const isStudentRoute = location.pathname.startsWith('/student');

  const {
    applications,
    loading: applicationsLoading,
    handleAddApplication,
    handleUpdateApplication,
    handleDeleteApplication,
    refetchApplications
  } = useJobApplicationsData(user);

  const { statistics, filteredApplications } = useTrackerData({
    applications,
    activeTab
  });

  // Fetch global job recommendations for students
  const { recommendations, loading: recommendationsLoading } = useGlobalJobRecommendations(
    isStudentRoute ? user?.id : undefined
  );

  // Use the scroll position hook
  useScrollPosition('tracker-scroll-position');

  // Set page ready state
  useEffect(() => {
    setIsPageReady(true);
  }, []);

  return (
    <TrackerLayout 
      user={user} 
      onSignOut={handleSignOut} 
      loading={authLoading || !isPageReady}
    >
      {isStudentRoute ? (
        <div className="space-y-6">
          <GlobalJobRecommendationsTracker 
            recommendations={recommendations}
            loading={recommendationsLoading}
          />
        </div>
      ) : (
        <TrackerContent
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          statistics={statistics}
          filteredApplications={filteredApplications}
          applicationsLoading={applicationsLoading}
          onAddApplication={handleAddApplication}
          onUpdateApplication={handleUpdateApplication}
          onDeleteApplication={handleDeleteApplication}
          refetchApplications={refetchApplications}
        />
      )}
    </TrackerLayout>
  );
});

Tracker.displayName = 'Tracker';

export default Tracker;
