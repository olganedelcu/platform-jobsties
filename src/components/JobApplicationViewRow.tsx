
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface JobApplicationViewRowProps {
  application: JobApplication;
  isCoachView?: boolean;
}

const JobApplicationViewRow = ({ application, isCoachView = false }: JobApplicationViewRowProps) => {
  const navigate = useNavigate();

  const handleCompanyClick = () => {
    navigate(`/application/${application.id}`);
  };

  const handlePositionClick = () => {
    navigate(`/application/${application.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'to_be_considered': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <TableCell className="text-sm">
        {format(new Date(application.date_applied), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell 
        className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline hover:no-underline transition-colors" 
        onClick={handleCompanyClick}
      >
        {application.company_name}
      </TableCell>
      <TableCell 
        className="text-blue-600 hover:text-blue-800 cursor-pointer underline hover:no-underline transition-colors" 
        onClick={handlePositionClick}
      >
        {application.job_title}
      </TableCell>
      <TableCell>
        {application.job_link ? (
          <a 
            href={application.job_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={(e) => e.stopPropagation()}
          >
            View
          </a>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(application.application_status)}>
          {application.application_status.replace('_', ' ').toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">
        {application.interview_stage || '-'}
      </TableCell>
      <TableCell className="text-sm">
        {application.recruiter_name || '-'}
      </TableCell>
      {!isCoachView && (
        <TableCell className="text-sm max-w-xs">
          <div className="truncate">
            {application.coach_notes || '-'}
          </div>
        </TableCell>
      )}
      <TableCell className="text-sm max-w-xs">
        <div className="truncate">
          {application.mentee_notes || '-'}
        </div>
      </TableCell>
    </>
  );
};

export default JobApplicationViewRow;
