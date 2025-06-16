
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
      
      {/* Applications visualization - now separate from greeting */}
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onTrackerClick}
      >
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{applicationsThisMonth}</div>
          <div className="text-xs text-gray-600">apps this month</div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(Math.min(applicationsThisMonth, 8))].map((_, i) => (
            <div key={i} className="w-1 h-6 bg-blue-500 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
