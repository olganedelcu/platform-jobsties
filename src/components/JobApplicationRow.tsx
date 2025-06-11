
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Save, X } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import { getStatusColor } from '@/utils/jobApplicationsUtils';

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
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editData.date_applied || application.date_applied}
            onChange={(e) => onEditDataChange({ date_applied: e.target.value })}
            className="w-full"
          />
        ) : (
          format(new Date(application.date_applied), 'MMM dd, yyyy')
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.company_name || application.company_name}
            onChange={(e) => onEditDataChange({ company_name: e.target.value })}
            className="w-full"
          />
        ) : (
          <span className="font-medium">{application.company_name}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.job_title || application.job_title}
            onChange={(e) => onEditDataChange({ job_title: e.target.value })}
            className="w-full"
          />
        ) : (
          application.job_title
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
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
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.application_status)}`}>
            {application.application_status.replace('_', ' ').toUpperCase()}
          </span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.interview_stage || application.interview_stage || ''}
            onChange={(e) => onEditDataChange({ interview_stage: e.target.value })}
            className="w-full"
          />
        ) : (
          application.interview_stage || '-'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.recruiter_name || application.recruiter_name || ''}
            onChange={(e) => onEditDataChange({ recruiter_name: e.target.value })}
            className="w-full"
          />
        ) : (
          application.recruiter_name || '-'
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Textarea
            value={editData.mentee_notes || application.mentee_notes || ''}
            onChange={(e) => onEditDataChange({ mentee_notes: e.target.value })}
            className="w-full min-h-[60px]"
            placeholder="Add your notes..."
          />
        ) : (
          <div className="max-w-xs">
            {application.mentee_notes ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 font-medium">My Notes:</div>
                <div className="text-sm text-gray-700 p-2 bg-green-50 rounded border-l-2 border-green-200" title={application.mentee_notes}>
                  {application.mentee_notes.length > 100 
                    ? `${application.mentee_notes.substring(0, 100)}...` 
                    : application.mentee_notes
                  }
                </div>
              </div>
            ) : (
              <span className="text-gray-400 italic text-sm">No notes yet</span>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing && isCoachView ? (
          <Textarea
            value={editData.coach_notes || application.coach_notes || ''}
            onChange={(e) => onEditDataChange({ coach_notes: e.target.value })}
            className="w-full min-h-[60px]"
            placeholder="Add coach notes..."
          />
        ) : (
          <div className="max-w-xs">
            {application.coach_notes ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 font-medium">Coach Feedback:</div>
                <div className="text-sm text-gray-700 p-2 bg-blue-50 rounded border-l-2 border-blue-200" title={application.coach_notes}>
                  {application.coach_notes.length > 100 
                    ? `${application.coach_notes.substring(0, 100)}...` 
                    : application.coach_notes
                  }
                </div>
              </div>
            ) : isCoachView ? (
              <span className="text-gray-400 italic text-sm">No notes</span>
            ) : (
              <span className="text-gray-400 italic text-sm">No coach feedback yet</span>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button size="sm" onClick={() => onSave(application.id)}>
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEdit(application)}
                disabled={isAddingNew}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDelete(application.id)}
                disabled={isAddingNew}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationRow;
