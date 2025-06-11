
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MenteesHeaderProps {
  menteeCount: number;
}

const MenteesHeader = ({ menteeCount }: MenteesHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
        <p className="text-gray-500 mt-2">Manage and track your assigned mentees with detailed progress information</p>
      </div>
      
      <Badge variant="outline" className="text-lg px-4 py-2">
        {menteeCount} mentee{menteeCount !== 1 ? 's' : ''} assigned
      </Badge>
    </div>
  );
};

export default MenteesHeader;
