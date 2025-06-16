
import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import JobApplicationRowActions from '@/components/JobApplicationRowActions';
import TruncatedNotes from '@/components/TruncatedNotes';

interface JobApplicationViewRowProps {
  application: JobApplication;
  isAddingNew: boolean;
  isCoachView: boolean;
  onEdit: (application: JobApplication) => void;
  onDelete: (applicationId: string) => Promise<void>;
}

const JobApplicationViewRow = ({
  application,
  isAddingNew,
  isCoachView,
  onEdit,
  onDelete
}: JobApplicationViewRowProps) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="w-32">{format(new Date(application.date_applied), 'MMM dd, yyyy')}</TableCell>
      <TableCell className="w-40 font-medium">{application.company_name}</TableCell>
      <TableCell className="w-40">{application.job_title}</TableCell>
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
      <TableCell className="w-32">
        <div className="flex items-center space-x-2">
          {!isCoachView && (
            <Link to={`/application/${application.id}`}>
              <Button variant="outline" size="sm" title="View Full Application">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <JobApplicationRowActions
            application={application}
            isEditing={false}
            isAddingNew={isAddingNew}
            isCoachView={isCoachView}
            onEdit={onEdit}
            onSave={() => Promise.resolve()}
            onCancel={() => {}}
            onDelete={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationViewRow;
