
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp } from 'lucide-react';
import { Mentee } from '@/hooks/useMentees';
import MenteeProgressItem from './MenteeProgressItem';
import { useMenteeProgressStats } from '@/hooks/useMenteeProgressStats';

interface MenteesCardProps {
  mentees: Mentee[];
  loading: boolean;
  onViewAll: () => void;
}

const MenteesCard = ({ mentees, loading, onViewAll }: MenteesCardProps) => {
  const menteeIds = mentees.map(m => m.id);
  const { getMenteeProgress, averageProgress, loading: progressLoading } = useMenteeProgressStats(menteeIds);

  if (loading || progressLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-lg">Loading mentees...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>My Mentees</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>{averageProgress}% avg progress</span>
          </div>
          <span>{mentees.length} total mentees</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {mentees.length > 0 ? (
          <div className="space-y-4">
            {mentees.map((mentee) => {
              const progress = getMenteeProgress(mentee.id);
              return (
                <MenteeProgressItem
                  key={mentee.id}
                  mentee={mentee}
                  overallProgress={progress.overallProgress}
                  completedModules={progress.completedModules}
                  totalModules={progress.totalModules}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-600 mb-2">No mentees assigned</div>
            <div className="text-sm text-gray-500">Mentees will appear here once they're assigned to you</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteesCard;
