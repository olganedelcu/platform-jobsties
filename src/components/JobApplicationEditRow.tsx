
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import JobApplicationStatusSelect from '@/components/JobApplicationStatusSelect';
import { JobApplication } from '@/types/jobApplications';

interface JobApplicationEditRowProps {
  application: JobApplication;
  editData: Partial<JobApplication>;
  isCoachView?: boolean;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
  onSave: (applicationId: string) => Promise<void>;
  onCancel: () => void;
  onDelete: (applicationId: string) => Promise<void>;
}

const JobApplicationEditRow = ({ 
  application, 
  editData,
  isCoachView = false,
  onEditDataChange,
  onSave, 
  onCancel 
}: JobApplicationEditRowProps) => {
  const handleSave = () => {
    onSave(application.id);
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          value={editData.company_name || application.company_name}
          onChange={(e) => onEditDataChange({ company_name: e.target.value })}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.job_title || application.job_title}
          onChange={(e) => onEditDataChange({ job_title: e.target.value })}
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.job_link || application.job_link || ''}
          onChange={(e) => onEditDataChange({ job_link: e.target.value })}
          placeholder="https://..."
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={editData.date_applied || application.date_applied}
          onChange={(e) => onEditDataChange({ date_applied: e.target.value })}
          className="min-w-[130px]"
        />
      </TableCell>
      <TableCell>
        <JobApplicationStatusSelect
          value={editData.application_status || application.application_status}
          onValueChange={(value) => onEditDataChange({ application_status: value })}
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.interview_stage || application.interview_stage || ''}
          onChange={(e) => onEditDataChange({ interview_stage: e.target.value })}
          placeholder="Phone, On-site..."
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.recruiter_name || application.recruiter_name || ''}
          onChange={(e) => onEditDataChange({ recruiter_name: e.target.value })}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.mentee_notes || application.mentee_notes || ''}
          onChange={(e) => onEditDataChange({ mentee_notes: e.target.value })}
          className="min-w-[150px]"
          placeholder="Add your notes..."
        />
      </TableCell>
      {isCoachView && (
        <TableCell>
          <Input
            value={editData.coach_notes || application.coach_notes || ''}
            onChange={(e) => onEditDataChange({ coach_notes: e.target.value })}
            className="min-w-[150px]"
            placeholder="Add coach notes..."
          />
        </TableCell>
      )}
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="h-7 w-7 p-0">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 w-7 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationEditRow;
