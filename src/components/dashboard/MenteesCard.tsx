
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, ArrowRight } from 'lucide-react';
import { Mentee } from '@/hooks/useMentees';
import { useMenteeProgressStats } from '@/hooks/useMenteeProgressStats';
import MenteeProgressItem from './MenteeProgressItem';

interface MenteesCardProps {
  mentees: Mentee[];
  loading: boolean;
  onViewAll: () => void;
}

const MenteesCard = ({ mentees, loading, onViewAll }: MenteesCardProps) => {
  const menteeIds = mentees.map(m => m.id);
  const { loading: progressLoading, getMenteeProgress, averageProgress } = useMenteeProgressStats(menteeIds);

  if (loading || progressLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>My Mentees</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500">Loading mentees...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>My Mentees</span>
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{mentees.length}</div>
            <div className="text-sm text-gray-500">Active mentees</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentees.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No mentees assigned yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Average Progress</span>
                <span className="text-sm text-gray-600">{averageProgress}%</span>
              </div>
              <Progress value={averageProgress} className="h-2" />
            </div>

            <div className="space-y-3">
              {mentees.slice(0, 3).map((mentee) => {
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

            {mentees.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">
                  +{mentees.length - 3} more mentee{mentees.length - 3 !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <Button 
              onClick={onViewAll}
              variant="outline" 
              className="w-full flex items-center justify-center space-x-2"
            >
              <span>View All Mentees</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteesCard;
