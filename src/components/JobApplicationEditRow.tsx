
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TableCell } from '@/components/ui/table';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';

interface JobApplicationEditRowProps {
  application: JobApplication;
  editData: Partial<JobApplication> | null;
  isCoachView: boolean;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
}

const JobApplicationEditRow = ({
  application,
  editData,
  isCoachView,
  onEditDataChange
}: JobApplicationEditRowProps) => {
  const handleViewJob = () => {
    const jobLink = editData?.job_link || application.job_link;
    if (!jobLink) return;
    
    let url = jobLink.trim();
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
      <TableCell className="w-32">
        {isCoachView ? (
          <div className="text-sm">
            {format(new Date(application.date_applied), 'MMM dd, yyyy')}
          </div>
        ) : (
          <Input
            type="date"
            value={editData?.date_applied || application.date_applied}
            onChange={(e) => onEditDataChange({ date_applied: e.target.value })}
            className="w-full"
          />
        )}
      </TableCell>
      <TableCell className="w-40">
        {isCoachView ? (
          <div className="text-sm font-medium">{application.company_name}</div>
        ) : (
          <Input
            value={editData?.company_name || application.company_name}
            onChange={(e) => onEditDataChange({ company_name: e.target.value })}
            className="w-full"
          />
        )}
      </TableCell>
      <TableCell className="w-40">
        {isCoachView ? (
          <div className="text-sm">{application.job_title}</div>
        ) : (
          <Input
            value={editData?.job_title || application.job_title}
            onChange={(e) => onEditDataChange({ job_title: e.target.value })}
            className="w-full"
          />
        )}
      </TableCell>
      <TableCell className="w-16">
        {isCoachView ? (
          (editData?.job_link || application.job_link) ? (
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
          )
        ) : (
          <div className="flex items-center gap-1">
            <Input
              value={editData?.job_link !== undefined ? editData.job_link : (application.job_link || '')}
              onChange={(e) => onEditDataChange({ job_link: e.target.value })}
              placeholder="Job URL"
              className="w-full text-xs"
            />
            {(editData?.job_link || application.job_link) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewJob}
                title="View job posting"
                className="p-1 h-6 w-6 shrink-0"
              >
                <ExternalLink className="h-2 w-2" />
              </Button>
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="w-32">
        {isCoachView ? (
          <JobApplicationStatusBadge status={application.application_status} />
        ) : (
          <Select
            value={editData?.application_status || application.application_status}
            onValueChange={(value) => onEditDataChange({ application_status: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="to_be_considered">To Be Considered</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offer">Offer Received</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        )}
      </TableCell>
      <TableCell className="w-32">
        {isCoachView ? (
          <div className="text-sm">{application.interview_stage || '-'}</div>
        ) : (
          <Input
            value={editData?.interview_stage !== undefined ? editData.interview_stage : (application.interview_stage || '')}
            onChange={(e) => onEditDataChange({ interview_stage: e.target.value })}
            className="w-full"
          />
        )}
      </TableCell>
      <TableCell className="w-40">
        {isCoachView ? (
          <div className="text-sm break-words">{application.recruiter_name || '-'}</div>
        ) : (
          <Input
            value={editData?.recruiter_name !== undefined ? editData.recruiter_name : (application.recruiter_name || '')}
            onChange={(e) => onEditDataChange({ recruiter_name: e.target.value })}
            className="w-full"
          />
        )}
      </TableCell>
      <TableCell className="w-64">
        <Textarea
          value={editData?.mentee_notes !== undefined ? editData.mentee_notes : (application.mentee_notes || '')}
          onChange={(e) => onEditDataChange({ mentee_notes: e.target.value })}
          placeholder="Mentee notes..."
          className="w-full min-h-[60px] bg-green-50 border-green-200 focus:border-green-400"
          disabled={isCoachView}
        />
      </TableCell>
      {!isCoachView ? (
        <TableCell className="w-64">
          <Textarea
            value={editData?.coach_notes !== undefined ? editData.coach_notes : (application.coach_notes || '')}
            onChange={(e) => onEditDataChange({ coach_notes: e.target.value })}
            placeholder="Coach feedback..."
            className="w-full min-h-[60px] bg-blue-50 border-blue-200 focus:border-blue-400"
            disabled={!isCoachView}
          />
        </TableCell>
      ) : null}
    </>
  );
};

export default JobApplicationEditRow;
