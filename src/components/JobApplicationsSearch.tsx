
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface JobApplicationsSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalApplications: number;
  filteredApplications: number;
}

const JobApplicationsSearch = ({ 
  searchTerm, 
  onSearchChange, 
  totalApplications, 
  filteredApplications 
}: JobApplicationsSearchProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by company or position..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="text-sm text-gray-500">
        {filteredApplications} / {totalApplications}
      </div>
    </div>
  );
};

export default JobApplicationsSearch;
