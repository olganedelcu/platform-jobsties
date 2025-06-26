
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X, Loader2 } from 'lucide-react';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationDetailHeaderProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication>;
  saving: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
}

const ApplicationDetailHeader = ({
  application,
  isEditing,
  editData,
  saving,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onEditDataChange
}: ApplicationDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editData.job_title || ''}
              onChange={(e) => onEditDataChange({ job_title: e.target.value })}
              className="text-2xl font-bold p-3 h-auto"
              placeholder="Job Title"
            />
            <Input
              value={editData.company_name || ''}
              onChange={(e) => onEditDataChange({ company_name: e.target.value })}
              className="text-lg p-2 h-auto"
              placeholder="Company"
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.job_title}</h1>
            <p className="text-xl text-gray-600 mt-1">{application.company_name}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <JobApplicationStatusBadge status={isEditing ? (editData.application_status || '') : application.application_status} />
        {!isEditing ? (
          <Button onClick={onEditClick} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={onSaveClick} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
            <Button variant="outline" onClick={onCancelClick}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailHeader;
