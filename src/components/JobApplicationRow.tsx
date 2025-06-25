
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import JobApplicationEditRow from '@/components/JobApplicationEditRow';
import JobApplicationViewRow from '@/components/JobApplicationViewRow';
import JobApplicationRowActions from '@/components/JobApplicationRowActions';

interface JobApplicationRowProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication> | null;
  onEdit: (application: JobApplication) => void;
  onSave: (applicationId: string) => Promise<void>;
  onCancel: () => void;
  onDelete: (applicationId: string) => Promise<void>;
  onEditDataChange: (field: string, value: string) => void;
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
  const handleEdit = () => onEdit(application);
  const handleSave = () => onSave(application.id);
  const handleCancel = () => onCancel();
  const handleDelete = () => onDelete(application.id);

  return (
    <TableRow>
      {isEditing ? (
        <JobApplicationEditRow
          application={application}
          editData={editData}
          onEditDataChange={onEditDataChange}
          isCoachView={isCoachView}
        />
      ) : (
        <JobApplicationViewRow
          application={application}
          isCoachView={isCoachView}
        />
      )}
      
      <TableCell>
        <JobApplicationRowActions
          isEditing={isEditing}
          isAddingNew={isAddingNew}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          jobLink={application.job_link}
        />
      </TableCell>
    </TableRow>
  );
};

export default JobApplicationRow;
