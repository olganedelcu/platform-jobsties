
import React from 'react';
import { JobApplication } from '@/types/jobApplications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MenteeApplicationsListProps {
  applications: JobApplication[];
  onViewDetails?: (application: JobApplication) => void;
  onDeleteApplication?: (applicationId: string) => void;
}

const MenteeApplicationsList = ({ 
  applications, 
  onViewDetails, 
  onDeleteApplication 
}: MenteeApplicationsListProps) => {
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

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Applied</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interview Stage</TableHead>
            <TableHead>Recruiter</TableHead>
            <TableHead>Mentee Notes</TableHead>
            <TableHead>Coach Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell>
                {format(new Date(application.date_applied), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="font-medium">
                {application.company_name}
              </TableCell>
              <TableCell>{application.job_title}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(application.application_status)}>
                  {application.application_status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{application.interview_stage || '-'}</TableCell>
              <TableCell>{application.recruiter_name || '-'}</TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {application.mentee_notes ? (
                    <div className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-2 border-green-400">
                      {application.mentee_notes}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {application.coach_notes ? (
                    <div className="text-sm text-gray-700 p-2 rounded bg-blue-50 border-l-2 border-blue-400">
                      {application.coach_notes}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {onViewDetails && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(application)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteApplication && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteApplication(application.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenteeApplicationsList;
