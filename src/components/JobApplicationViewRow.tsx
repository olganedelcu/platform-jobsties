
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import JobApplicationRowActions from '@/components/JobApplicationRowActions';
import { ExternalLink } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';

interface JobApplicationViewRowProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => Promise<void>;
  onArchive?: (id: string) => void;
  showCoachNotes?: boolean;
  isAddingNew?: boolean;
  isCoachView?: boolean;
}

const JobApplicationViewRow = ({ 
  application, 
  onEdit, 
  onDelete, 
  onArchive,
  showCoachNotes = false,
  isAddingNew = false,
  isCoachView = false
}: JobApplicationViewRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{application.company_name}</TableCell>
      <TableCell>{application.job_title}</TableCell>
      <TableCell>
        {application.job_link ? (
          <a 
            href={application.job_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-3 w-3" />
            View Job
          </a>
        ) : (
          <span className="text-gray-400">No link</span>
        )}
      </TableCell>
      <TableCell>{formatDate(application.date_applied)}</TableCell>
      <TableCell>
        <JobApplicationStatusBadge status={application.application_status} />
      </TableCell>
      <TableCell>{application.interview_stage || '-'}</TableCell>
      <TableCell>{application.recruiter_name || '-'}</TableCell>
      <TableCell className="max-w-[200px]">
        <div className="truncate" title={application.mentee_notes}>
          {application.mentee_notes || '-'}
        </div>
      </TableCell>
      {showCoachNotes && (
        <TableCell className="max-w-[200px]">
          <div className="truncate" title={application.coach_notes}>
            {application.coach_notes || '-'}
          </div>
        </TableCell>
      )}
      <TableCell>
        <JobApplicationRowActions
          application={application}
          isEditing={false}
          isAddingNew={isAddingNew}
          isCoachView={isCoachView}
          onEdit={onEdit}
          onSave={async () => {}}
          onCancel={() => {}}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationViewRow;
