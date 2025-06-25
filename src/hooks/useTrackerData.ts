
import { useState, useEffect, useMemo } from 'react';
import { JobApplication } from '@/types/jobApplications';

interface UseTrackerDataParams {
  applications: JobApplication[];
  activeTab: string;
}

export const useTrackerData = ({ applications, activeTab }: UseTrackerDataParams) => {
  // Memoize statistics calculations and filtered applications
  const { statistics, filteredApplications } = useMemo(() => {
    const totalApplications = applications.length;
    const appliedCount = applications.filter(app => app.application_status === 'applied').length;
    const toBeConsideredCount = applications.filter(app => app.application_status === 'to_be_considered').length;
    const interviewingCount = applications.filter(app => app.application_status === 'interviewing').length;
    const rejectedCount = applications.filter(app => app.application_status === 'rejected').length;
    const offersCount = applications.filter(app => app.application_status === 'offer').length;
    
    const applicationsThisMonth = applications.filter(app => {
      const appDate = new Date(app.date_applied);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    // Filter applications based on active tab
    let filtered = applications;
    switch (activeTab) {
      case 'applied':
        filtered = applications.filter(app => app.application_status === 'applied');
        break;
      case 'to_be_considered':
        filtered = applications.filter(app => app.application_status === 'to_be_considered');
        break;
      case 'interviewing':
        filtered = applications.filter(app => app.application_status === 'interviewing');
        break;
      case 'rejected':
        filtered = applications.filter(app => app.application_status === 'rejected');
        break;
      default:
        filtered = applications;
    }

    return {
      statistics: {
        totalApplications,
        appliedCount,
        toBeConsideredCount,
        interviewingCount,
        rejectedCount,
        offersCount,
        applicationsThisMonth
      },
      filteredApplications: filtered
    };
  }, [applications, activeTab]);

  return { statistics, filteredApplications };
};
