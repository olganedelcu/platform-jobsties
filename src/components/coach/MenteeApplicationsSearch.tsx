
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MenteeApplicationsSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalMentees: number;
  filteredMentees: number;
}

const MenteeApplicationsSearch = ({ 
  searchTerm, 
  onSearchChange, 
  totalMentees, 
  filteredMentees 
}: MenteeApplicationsSearchProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search mentees by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="text-sm text-gray-500">
        Showing {filteredMentees} of {totalMentees} mentees
      </div>
    </div>
  );
};

export default MenteeApplicationsSearch;
