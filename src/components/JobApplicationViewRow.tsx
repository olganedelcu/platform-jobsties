
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';

interface JobApplicationViewRowProps {
  application: JobApplication;
  isAddingNew: boolean;
  isCoachView?: boolean;
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => Promise<void>;
}

const JobApplicationViewRow = ({ 
  application, 
  isAddingNew, 
  isCoachView = false,
  onEdit, 
  onDelete 
}: JobApplicationViewRowProps) => {
  const handleDelete = () => {
    onDelete(application.id);
  };

  return (
    <TableRow className={isAddingNew ? "opacity-50" : ""}>
      <TableCell className="w-32">
        {format(new Date(application.date_applied), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell className="w-40">
        <div className="truncate font-medium">
          {application.company_name}
        </div>
      </TableCell>
      <TableCell className="w-40">
        <div className="truncate">
          {application.job_title}
        </div>
      </TableCell>
      <TableCell className="w-32">
        <JobApplicationStatusBadge status={application.application_status} />
      </TableCell>
      <TableCell className="w-32">
        <div className="truncate text-sm text-gray-600">
          {application.interview_stage || '-'}
        </div>
      </TableCell>
      <TableCell className="w-40">
        <div className="truncate text-sm text-gray-600">
          {application.recruiter_name || '-'}
        </div>
      </TableCell>
      <TableCell className="w-40">
        {application.job_link ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(application.job_link!, '_blank')}
            className="h-8 px-2 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Job
          </Button>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell className="w-64">
        <div className="max-w-xs truncate text-sm text-gray-600">
          {application.mentee_notes || '-'}
        </div>
      </TableCell>
      {isCoachView && (
        <TableCell className="w-64">
          <div className="max-w-xs truncate text-sm text-gray-600">
            {application.coach_notes || '-'}
          </div>
        </TableCell>
      )}
      <TableCell className="w-24">
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(application)}
            disabled={isAddingNew}
          >
            <Edit className="h-3 w-3" />
          </Button>
          {!isCoachView && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleDelete}
              disabled={isAddingNew}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationViewRow;
