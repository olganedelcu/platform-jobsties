
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MenteesLoadingState = () => {
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-500 mt-2">Manage and track your assigned mentees</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-gray-500">Loading mentees...</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default MenteesLoadingState;
