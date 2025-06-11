
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface JobApplicationsTableHeaderProps {
  showCoachNotesColumn?: boolean;
}

const JobApplicationsTableHeader = ({ showCoachNotesColumn = true }: JobApplicationsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date Applied</TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Position</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Interview Stage</TableHead>
        <TableHead>Recruiter</TableHead>
        <TableHead>My Notes</TableHead>
        {showCoachNotesColumn && <TableHead>Coach Feedback</TableHead>}
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default JobApplicationsTableHeader;
