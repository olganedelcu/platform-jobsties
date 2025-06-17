
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, TrendingUp, Target, Award } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatsCard = memo(({ title, value, icon: Icon, color }: StatsCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
));

StatsCard.displayName = 'StatsCard';

interface TrackerStatsProps {
  statistics: {
    totalApplications: number;
    interviewingCount: number;
    offersCount: number;
    applicationsThisMonth: number;
  };
}

const TrackerStats = memo(({ statistics }: TrackerStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatsCard 
      title="Total Applications" 
      value={statistics.totalApplications} 
      icon={BarChart} 
      color="text-indigo-600" 
    />
    <StatsCard 
      title="Interviewing" 
      value={statistics.interviewingCount} 
      icon={TrendingUp} 
      color="text-green-600" 
    />
    <StatsCard 
      title="Offers Received" 
      value={statistics.offersCount} 
      icon={Target} 
      color="text-purple-600" 
    />
    <StatsCard 
      title="Applications this month" 
      value={statistics.applicationsThisMonth} 
      icon={Award} 
      color="text-orange-600" 
    />
  </div>
));

TrackerStats.displayName = 'TrackerStats';

export default TrackerStats;
