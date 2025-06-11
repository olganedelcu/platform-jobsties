
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';

interface MenteesEmptyStateProps {
  type: 'no-mentees' | 'no-search-results';
}

const MenteesEmptyState = ({ type }: MenteesEmptyStateProps) => {
  if (type === 'no-mentees') {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assigned mentees</h3>
            <p className="text-gray-500 mb-4">New mentees will be automatically assigned to you when they sign up</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center py-8">
      <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500">No mentees found matching your search</p>
    </div>
  );
};

export default MenteesEmptyState;
