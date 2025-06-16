
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Sparkles } from 'lucide-react';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';

interface DashboardHeaderProps {
  user: any;
  firstName: string;
  applicationsThisMonth: number;
  onTrackerClick: () => void;
}

const DashboardHeader = ({ user, firstName, applicationsThisMonth, onTrackerClick }: DashboardHeaderProps) => {
  const { greeting } = useTimeBasedGreeting(firstName);

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {greeting}
        </h1>
      </div>
    </div>
  );
};

export default DashboardHeader;
