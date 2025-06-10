
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Building2, User, Briefcase, Search, Eye } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface MenteeApplicationsGridProps {
  applications: JobApplication[];
  onViewDetails?: (application: JobApplication) => void;
}

interface GroupedApplications {
  [menteeId: string]: {
    menteeInfo: {
      id: string;
      first_name: string;
      last_name: string;
    };
    applications: JobApplication[];
  };
}

const MenteeApplicationsGrid = ({ applications, onViewDetails }: MenteeApplicationsGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedApplications = useMemo(() => {
    const grouped: GroupedApplications = {};
    
    applications.forEach((application) => {
      const menteeId = application.mentee_id;
      if (!grouped[menteeId]) {
        grouped[menteeId] = {
          menteeInfo: {
            id: menteeId,
            first_name: application.profiles?.first_name || 'Unknown',
            last_name: application.profiles?.last_name || 'User'
          },
          applications: []
        };
      }
      grouped[menteeId].applications.push(application);
    });

    return grouped;
  }, [applications]);

  const filteredMentees = useMemo(() => {
    if (!searchTerm) return groupedApplications;

    const filtered: GroupedApplications = {};
    Object.entries(groupedApplications).forEach(([menteeId, data]) => {
      const fullName = `${data.menteeInfo.first_name} ${data.menteeInfo.last_name}`.toLowerCase();
      if (fullName.includes(searchTerm.toLowerCase())) {
        filtered[menteeId] = data;
      }
    });

    return filtered;
  }, [groupedApplications, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSummary = (applications: JobApplication[]) => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.application_status] = (acc[app.application_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusCounts;
  };

  if (Object.keys(groupedApplications).length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-500">No mentee job applications to review at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search mentees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          {Object.keys(filteredMentees).length} mentee{Object.keys(filteredMentees).length !== 1 ? 's' : ''} with applications
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(filteredMentees).map(([menteeId, data]) => {
          const statusSummary = getStatusSummary(data.applications);
          const recentApplications = data.applications
            .sort((a, b) => new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime())
            .slice(0, 3);

          return (
            <Card key={menteeId} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        {data.menteeInfo.first_name[0]}{data.menteeInfo.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {data.menteeInfo.first_name} {data.menteeInfo.last_name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {data.applications.length} application{data.applications.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(statusSummary).map(([status, count]) => (
                    <Badge key={status} className={`text-xs ${getStatusColor(status)}`}>
                      {status.replace('_', ' ')}: {count}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Applications</h4>
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {application.company_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {application.job_title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-500">
                            {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <Badge className={`text-xs ${getStatusColor(application.application_status)}`}>
                          {application.application_status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {onViewDetails && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(application)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {data.applications.length > 3 && (
                  <div className="mt-3 pt-3 border-t text-center">
                    <span className="text-xs text-gray-500">
                      +{data.applications.length - 3} more application{data.applications.length - 3 !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(filteredMentees).length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Mentees Found</h3>
            <p className="text-gray-500">
              No mentees found matching "{searchTerm}". Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenteeApplicationsGrid;
