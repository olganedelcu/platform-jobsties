
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MenteeTodosStatsProps {
  totalPending: number;
  totalInProgress: number;
  totalCompleted: number;
}

const MenteeTodosStats = ({ totalPending, totalInProgress, totalCompleted }: MenteeTodosStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="text-center p-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">{totalPending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="text-center p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{totalInProgress}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="text-center p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">{totalCompleted}</div>
          <div className="text-sm text-gray-500">Done</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenteeTodosStats;
