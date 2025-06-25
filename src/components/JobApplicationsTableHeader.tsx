
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface JobApplicationsTableHeaderProps {
  showCoachNotes?: boolean;
}

const JobApplicationsTableHeader = ({ showCoachNotes = false }: JobApplicationsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[120px]">Company</TableHead>
        <TableHead className="min-w-[150px]">Job Title</TableHead>
        <TableHead className="min-w-[150px]">Job Link</TableHead>
        <TableHead className="min-w-[130px]">Date Applied</TableHead>
        <TableHead className="min-w-[120px]">Status</TableHead>
        <TableHead className="min-w-[120px]">Interview Stage</TableHead>
        <TableHead className="min-w-[120px]">Recruiter</TableHead>
        <TableHead className="min-w-[150px]">Notes</TableHead>
        {showCoachNotes && (
          <TableHead className="min-w-[150px]">Coach Notes</TableHead>
        )}
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default JobApplicationsTableHeader;
