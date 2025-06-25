
import { useMemo } from 'react';
import { JobApplication } from '@/types/jobApplications';

interface UseTrackerDataProps {
  applications: JobApplication[];
  activeTab: string;
}

export const useTrackerData = ({ applications, activeTab }: UseTrackerDataProps) => {
  const statistics = useMemo(() => {
    const totalApplications = applications.length;
    const appliedCount = applications.filter(app => app.application_status === 'applied').length;
    const interviewedCount = applications.filter(app => app.application_status === 'interviewed').length;
    const offeredCount = applications.filter(app => app.application_status === 'offered').length;
    const rejectedCount = applications.filter(app => app.application_status === 'rejected').length;
    const withdrawnCount = applications.filter(app => app.application_status === 'withdrawn').length;
    
    // Calculate applications this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const applicationsThisMonth = applications.filter(app => {
      const appDate = new Date(app.date_applied);
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    return {
      totalApplications,
      appliedCount,
      toBeConsideredCount: interviewedCount, // Map interviewed to "to be considered"
      interviewingCount: interviewedCount,
      rejectedCount,
      offersCount: offeredCount,
      applicationsThisMonth
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    switch (activeTab) {
      case 'applied':
        return applications.filter(app => app.application_status === 'applied');
      case 'to_be_considered':
        return applications.filter(app => app.application_status === 'interviewed');
      case 'interviewing':
        return applications.filter(app => app.application_status === 'interviewed');
      case 'rejected':
        return applications.filter(app => app.application_status === 'rejected');
      default:
        return applications;
    }
  }, [applications, activeTab]);

  return {
    statistics,
    filteredApplications
  };
};
