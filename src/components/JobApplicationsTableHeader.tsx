
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface JobApplicationsTableHeaderProps {
  showCoachNotesColumn?: boolean;
}

const JobApplicationsTableHeader = ({ showCoachNotesColumn = true }: JobApplicationsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-32">Date Applied</TableHead>
        <TableHead className="w-40">Company</TableHead>
        <TableHead className="w-40">Position</TableHead>
        <TableHead className="w-32">Status</TableHead>
        <TableHead className="w-32">Interview Stage</TableHead>
        <TableHead className="w-40">Recruiter</TableHead>
        <TableHead className="w-64">My Notes</TableHead>
        {showCoachNotesColumn && <TableHead className="w-64">Coach Feedback</TableHead>}
        <TableHead className="w-24">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default JobApplicationsTableHeader;
