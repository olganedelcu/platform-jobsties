
import React from 'react';
import { JobApplication } from '@/types/jobApplications';
import JobApplicationEditRow from '@/components/JobApplicationEditRow';
import JobApplicationViewRow from '@/components/JobApplicationViewRow';

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
  if (isEditing) {
    return (
      <JobApplicationEditRow
        application={application}
        editData={editData}
        isCoachView={isCoachView}
        onEditDataChange={onEditDataChange}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    );
  }

  return (
    <JobApplicationViewRow
      application={application}
      isAddingNew={isAddingNew}
      isCoachView={isCoachView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default JobApplicationRow;
