
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, ArrowRight } from 'lucide-react';
import { Mentee } from '@/hooks/useMentees';
import { useMenteeProgress } from '@/hooks/useMenteeProgress';

interface MenteesCardProps {
  mentees: Mentee[];
  loading: boolean;
  onViewAll: () => void;
}

const MenteesCard = ({ mentees, loading, onViewAll }: MenteesCardProps) => {
  const menteeIds = mentees.map(m => m.id);
  const { progressData, loading: progressLoading } = useMenteeProgress(menteeIds);

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

  const getMenteeProgress = (menteeId: string) => {
    return progressData.find(p => p.menteeId === menteeId) || {
      overallProgress: 0,
      completedModules: 0,
      totalModules: 5
    };
  };

  const averageProgress = progressData.length > 0 
    ? Math.round(progressData.reduce((sum, p) => sum + p.overallProgress, 0) / progressData.length)
    : 0;

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
                  <div key={mentee.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
                        {mentee.first_name[0]}{mentee.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mentee.first_name} {mentee.last_name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {progress.overallProgress}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={progress.overallProgress} className="h-1 flex-1" />
                        <span className="text-xs text-gray-400">
                          {progress.completedModules}/{progress.totalModules}
                        </span>
                      </div>
                    </div>
                  </div>
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
