
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import JobApplicationStatusSelect from '@/components/JobApplicationStatusSelect';
import { JobApplication } from '@/types/jobApplications';

interface JobApplicationEditRowProps {
  application: JobApplication;
  onSave: (id: string, updates: Partial<JobApplication>) => void;
  onCancel: () => void;
}

const JobApplicationEditRow = ({ application, onSave, onCancel }: JobApplicationEditRowProps) => {
  const [editData, setEditData] = useState({
    company_name: application.company_name,
    job_title: application.job_title,
    job_link: application.job_link || '',
    application_status: application.application_status,
    interview_stage: application.interview_stage || '',
    recruiter_name: application.recruiter_name || '',
    mentee_notes: application.mentee_notes || '',
    date_applied: application.date_applied
  });

  const handleSave = () => {
    onSave(application.id, editData);
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          value={editData.company_name}
          onChange={(e) => setEditData(prev => ({ ...prev, company_name: e.target.value }))}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.job_title}
          onChange={(e) => setEditData(prev => ({ ...prev, job_title: e.target.value }))}
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.job_link}
          onChange={(e) => setEditData(prev => ({ ...prev, job_link: e.target.value }))}
          placeholder="https://..."
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={editData.date_applied}
          onChange={(e) => setEditData(prev => ({ ...prev, date_applied: e.target.value }))}
          className="min-w-[130px]"
        />
      </TableCell>
      <TableCell>
        <JobApplicationStatusSelect
          value={editData.application_status}
          onValueChange={(value) => setEditData(prev => ({ ...prev, application_status: value }))}
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.interview_stage}
          onChange={(e) => setEditData(prev => ({ ...prev, interview_stage: e.target.value }))}
          placeholder="Phone, On-site..."
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.recruiter_name}
          onChange={(e) => setEditData(prev => ({ ...prev, recruiter_name: e.target.value }))}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          value={editData.mentee_notes}
          onChange={(e) => setEditData(prev => ({ ...prev, mentee_notes: e.target.value }))}
          className="min-w-[150px]"
          placeholder="Add your notes..."
        />
      </TableCell>
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
