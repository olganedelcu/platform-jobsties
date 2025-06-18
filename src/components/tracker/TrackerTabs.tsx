
import React, { memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { List, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';
import ExcelLikeJobApplicationsTable from '@/components/ExcelLikeJobApplicationsTable';

interface TrackerTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  statistics: {
    totalApplications: number;
    appliedCount: number;
    toBeConsideredCount: number;
    interviewingCount: number;
    rejectedCount: number;
  };
  filteredApplications: JobApplication[];
  applicationsLoading: boolean;
  onAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
  onUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  onDeleteApplication: (applicationId: string) => Promise<void>;
}

const TrackerTabs = memo(({ 
  activeTab, 
  onTabChange, 
  statistics, 
  filteredApplications, 
  applicationsLoading,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication
}: TrackerTabsProps) => {
  if (applicationsLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All
              {statistics.totalApplications > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statistics.totalApplications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="applied" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Applied
              {statistics.appliedCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statistics.appliedCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="to_be_considered" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              To Be Considered
              {statistics.toBeConsideredCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statistics.toBeConsideredCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="interviewing" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Interviewing
              {statistics.interviewingCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statistics.interviewingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
              {statistics.rejectedCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statistics.rejectedCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <ExcelLikeJobApplicationsTable
            applications={filteredApplications}
            onAddApplication={onAddApplication}
            onUpdateApplication={onUpdateApplication}
            onDeleteApplication={onDeleteApplication}
            isCoachView={false}
          />
        </TabsContent>

        <TabsContent value="applied" className="mt-0">
          <ExcelLikeJobApplicationsTable
            applications={filteredApplications}
            onAddApplication={onAddApplication}
            onUpdateApplication={onUpdateApplication}
            onDeleteApplication={onDeleteApplication}
            isCoachView={false}
          />
        </TabsContent>

        <TabsContent value="to_be_considered" className="mt-0">
          <ExcelLikeJobApplicationsTable
            applications={filteredApplications}
            onAddApplication={onAddApplication}
            onUpdateApplication={onUpdateApplication}
            onDeleteApplication={onDeleteApplication}
            isCoachView={false}
          />
        </TabsContent>

        <TabsContent value="interviewing" className="mt-0">
          <ExcelLikeJobApplicationsTable
            applications={filteredApplications}
            onAddApplication={onAddApplication}
            onUpdateApplication={onUpdateApplication}
            onDeleteApplication={onDeleteApplication}
            isCoachView={false}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <ExcelLikeJobApplicationsTable
            applications={filteredApplications}
            onAddApplication={onAddApplication}
            onUpdateApplication={onUpdateApplication}
            onDeleteApplication={onDeleteApplication}
            isCoachView={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
});

TrackerTabs.displayName = 'TrackerTabs';

export default TrackerTabs;
