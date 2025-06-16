
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Sparkles } from 'lucide-react';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';

interface DashboardHeaderProps {
  user: any;
  firstName: string;
  applicationsThisMonth: number;
  onTrackerClick: () => void;
}

const DashboardHeader = ({ user, firstName, applicationsThisMonth, onTrackerClick }: DashboardHeaderProps) => {
  const { greeting } = useTimeBasedGreeting(firstName);
  const { todaysQuote } = useQuoteOfTheDay();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {greeting}
        </h1>
        {todaysQuote && (
          <p className="text-sm text-gray-600 italic max-w-2xl">
            "{todaysQuote.text}"
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
