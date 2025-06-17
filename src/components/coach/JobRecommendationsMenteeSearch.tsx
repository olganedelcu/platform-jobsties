
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface JobRecommendationsMenteeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultCount: number;
}

const JobRecommendationsMenteeSearch = ({ 
  searchTerm, 
  onSearchChange, 
  resultCount 
}: JobRecommendationsMenteeSearchProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search mentees..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="text-sm text-gray-500">
        {resultCount} mentee{resultCount !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default JobRecommendationsMenteeSearch;
