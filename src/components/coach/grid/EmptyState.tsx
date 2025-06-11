
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-applications' | 'no-search-results';
  searchTerm?: string;
}

const EmptyState = ({ type, searchTerm }: EmptyStateProps) => {
  if (type === 'no-search-results') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Mentees Found</h3>
          <p className="text-gray-500">
            No mentees found matching "{searchTerm}". Try a different search term.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="text-center py-12">
        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
        <p className="text-gray-500">No mentee job applications to review at this time.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
