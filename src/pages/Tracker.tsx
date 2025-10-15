
import React, { useState, useEffect, memo } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { useTrackerData } from '@/hooks/useTrackerData';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import TrackerLayout from '@/components/tracker/TrackerLayout';
import TrackerContent from '@/components/tracker/TrackerContent';

const Tracker = memo(() => {
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const [isPageReady, setIsPageReady] = useState(false);
  const [activeTab, setActiveTab] = useState('applied');

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
    </TrackerLayout>
  );
});

Tracker.displayName = 'Tracker';

export default Tracker;
