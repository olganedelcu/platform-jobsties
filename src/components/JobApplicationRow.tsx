
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface JobApplicationRowProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication>;
  onEdit: (application: JobApplication) => void;
  onSave: (applicationId: string) => Promise<void>;
  onCancel: () => void;
  onDelete: (applicationId: string) => Promise<void>;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
  isAddingNew: boolean;
  isCoachView?: boolean;
}

const JobApplicationRow = ({ 
  application, 
  isEditing, 
  editData, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onEditDataChange,
  isAddingNew,
  isCoachView = false
}: JobApplicationRowProps) => {
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

  console.log('JobApplicationRow: Rendering application:', application.id, 'isCoachView:', isCoachView, 'isEditing:', isEditing);

  if (isEditing) {
    return (
      <TableRow className="bg-yellow-50">
        <TableCell>
          {isCoachView ? (
            <div className="text-sm">
              {format(new Date(application.date_applied), 'MMM dd, yyyy')}
            </div>
          ) : (
            <Input
              type="date"
              value={editData.date_applied || application.date_applied}
              onChange={(e) => onEditDataChange({ date_applied: e.target.value })}
              className="w-full"
            />
          )}
        </TableCell>
        <TableCell>
          {isCoachView ? (
            <div className="text-sm font-medium">{application.company_name}</div>
          ) : (
            <Input
              value={editData.company_name || application.company_name}
              onChange={(e) => onEditDataChange({ company_name: e.target.value })}
              className="w-full"
            />
          )}
        </TableCell>
        <TableCell>
          {isCoachView ? (
            <div className="text-sm">{application.job_title}</div>
          ) : (
            <Input
              value={editData.job_title || application.job_title}
              onChange={(e) => onEditDataChange({ job_title: e.target.value })}
              className="w-full"
            />
          )}
        </TableCell>
        <TableCell>
          {isCoachView ? (
            <Badge className={getStatusColor(application.application_status)}>
              {application.application_status.replace('_', ' ').toUpperCase()}
            </Badge>
          ) : (
            <Select
              value={editData.application_status || application.application_status}
              onValueChange={(value) => onEditDataChange({ application_status: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offer">Offer Received</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          )}
        </TableCell>
        <TableCell>
          {isCoachView ? (
            <div className="text-sm">{application.interview_stage || '-'}</div>
          ) : (
            <Input
              value={editData.interview_stage || application.interview_stage || ''}
              onChange={(e) => onEditDataChange({ interview_stage: e.target.value })}
              className="w-full"
            />
          )}
        </TableCell>
        <TableCell>
          {isCoachView ? (
            <div className="text-sm">{application.recruiter_name || '-'}</div>
          ) : (
            <Input
              value={editData.recruiter_name || application.recruiter_name || ''}
              onChange={(e) => onEditDataChange({ recruiter_name: e.target.value })}
              className="w-full"
            />
          )}
        </TableCell>
        <TableCell>
          <Textarea
            value={editData.mentee_notes !== undefined ? editData.mentee_notes : (application.mentee_notes || '')}
            onChange={(e) => onEditDataChange({ mentee_notes: e.target.value })}
            placeholder="Mentee notes..."
            className="w-full min-h-[60px] bg-green-50 border-green-200 focus:border-green-400"
            disabled={isCoachView}
          />
        </TableCell>
        <TableCell>
          <Textarea
            value={editData.coach_notes !== undefined ? editData.coach_notes : (application.coach_notes || '')}
            onChange={(e) => onEditDataChange({ coach_notes: e.target.value })}
            placeholder="Coach feedback..."
            className="w-full min-h-[60px] bg-blue-50 border-blue-200 focus:border-blue-400"
            disabled={!isCoachView}
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button size="sm" onClick={() => onSave(application.id)}>
              <Save className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>{format(new Date(application.date_applied), 'MMM dd, yyyy')}</TableCell>
      <TableCell className="font-medium">{application.company_name}</TableCell>
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
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(application)}
            disabled={isAddingNew}
          >
            <Edit className="h-3 w-3" />
          </Button>
          {!isCoachView && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(application.id)}
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

export default JobApplicationRow;
