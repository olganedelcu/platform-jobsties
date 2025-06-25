
import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import { Eye, ExternalLink } from 'lucide-react';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import TruncatedNotes from '@/components/TruncatedNotes';

interface JobApplicationViewRowProps {
  application: JobApplication;
  isCoachView: boolean;
}

const JobApplicationViewRow = ({
  application,
  isCoachView
}: JobApplicationViewRowProps) => {
  const handleViewJob = () => {
    if (!application.job_link) return;
    
    let url = application.job_link.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Silent fail for security
    }
  };

  return (
    <>
      <TableCell className="w-32">{format(new Date(application.date_applied), 'MMM dd, yyyy')}</TableCell>
      <TableCell className="w-40 font-medium">{application.company_name}</TableCell>
      <TableCell className="w-40">{application.job_title}</TableCell>
      <TableCell className="w-16">
        {application.job_link ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewJob}
            title="View job posting"
            className="p-1 h-7 w-7"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="w-32">
        <JobApplicationStatusBadge status={application.application_status} />
      </TableCell>
      <TableCell className="w-32">{application.interview_stage || '-'}</TableCell>
      <TableCell className="w-40">
        <div className="break-words">
          {application.recruiter_name || '-'}
        </div>
      </TableCell>
      <TableCell className="w-64">
        <div className="break-words">
          <TruncatedNotes notes={application.mentee_notes} maxLength={100} />
        </div>
      </TableCell>
      {!isCoachView ? (
        <TableCell className="w-64">
          <div className="break-words">
            {application.coach_notes ? (
              <div className="text-sm text-gray-700 p-2 rounded bg-blue-50 border-l-2 border-blue-400">
                {application.coach_notes}
              </div>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        </TableCell>
      ) : null}
    </>
  );
};

export default JobApplicationViewRow;
