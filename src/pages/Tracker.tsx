
import React, { useState, useEffect, memo } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { useTrackerData } from '@/hooks/useTrackerData';
import Navigation from '@/components/Navigation';
import EnhancedWeeklyJobRecommendations from '@/components/EnhancedWeeklyJobRecommendations';
import TrackerHeader from '@/components/tracker/TrackerHeader';
import TrackerStats from '@/components/tracker/TrackerStats';
import TrackerTabs from '@/components/tracker/TrackerTabs';
import { Loader2 } from 'lucide-react';

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

  // Preserve scroll position
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('tracker-scroll-position');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);
    }
    setIsPageReady(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      try {
        localStorage.setItem('tracker-scroll-position', window.scrollY.toString());
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Clean up scroll position on unmount
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem('tracker-scroll-position');
      } catch (error) {
        console.error('Failed to clean up tracker localStorage:', error);
      }
    };
  }, []);

  if (authLoading || !isPageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto pt-28 py-8 px-6">
        <TrackerHeader />

        {/* Enhanced Job Recommendations Section with Archive System */}
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
            onTabChange={setActiveTab}
            statistics={statistics}
            filteredApplications={filteredApplications}
            applicationsLoading={applicationsLoading}
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        </div>
      </main>
    </div>
  );
});

Tracker.displayName = 'Tracker';

export default Tracker;
