
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

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
  onCancel, 
  onDelete 
}: JobApplicationEditRowProps) => {
  const handleSave = () => {
    onSave(application.id);
  };

  const handleDelete = () => {
    onDelete(application.id);
  };

  return (
    <TableRow className="bg-blue-50">
      <TableCell className="w-32">
        <Input
          type="date"
          value={editData.date_applied ? format(new Date(editData.date_applied), 'yyyy-MM-dd') : ''}
          onChange={(e) => onEditDataChange({ date_applied: e.target.value })}
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={editData.company_name || ''}
          onChange={(e) => onEditDataChange({ company_name: e.target.value })}
          placeholder="Company name"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={editData.job_title || ''}
          onChange={(e) => onEditDataChange({ job_title: e.target.value })}
          placeholder="Job title"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-32">
        <Select
          value={editData.application_status || 'applied'}
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
      </TableCell>
      <TableCell className="w-32">
        <Input
          value={editData.interview_stage || ''}
          onChange={(e) => onEditDataChange({ interview_stage: e.target.value })}
          placeholder="Interview stage"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={editData.recruiter_name || ''}
          onChange={(e) => onEditDataChange({ recruiter_name: e.target.value })}
          placeholder="Recruiter name"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={editData.job_link || ''}
          onChange={(e) => onEditDataChange({ job_link: e.target.value })}
          placeholder="https://example.com/job"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-64">
        <Textarea
          value={editData.mentee_notes || ''}
          onChange={(e) => onEditDataChange({ mentee_notes: e.target.value })}
          placeholder="Add your notes..."
          className="w-full min-h-[60px]"
        />
      </TableCell>
      {isCoachView && (
        <TableCell className="w-64">
          <Textarea
            value={editData.coach_notes || ''}
            onChange={(e) => onEditDataChange({ coach_notes: e.target.value })}
            placeholder="Coach notes"
            className="w-full min-h-[60px]"
          />
        </TableCell>
      )}
      <TableCell className="w-24">
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave}>
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationEditRow;
