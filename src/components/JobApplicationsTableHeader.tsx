
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const JobApplicationsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="w-32 font-semibold">Date Applied</TableHead>
        <TableHead className="w-48 font-semibold">Company</TableHead>
        <TableHead className="w-48 font-semibold">Job Title</TableHead>
        <TableHead className="w-32 font-semibold">Status</TableHead>
        <TableHead className="w-40 font-semibold">Interview Stage</TableHead>
        <TableHead className="w-40 font-semibold">Recruiter</TableHead>
        <TableHead className="w-64 font-semibold">Notes</TableHead>
        <TableHead className="w-32 font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default JobApplicationsTableHeader;
