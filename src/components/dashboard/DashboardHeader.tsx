
import React from 'react';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
  firstName: string;
  applicationsThisMonth: number;
  onTrackerClick: () => void;
}

const DashboardHeader = ({ user, firstName }: DashboardHeaderProps) => {
  const { greeting } = useTimeBasedGreeting(firstName);
  const { todaysQuote } = useQuoteOfTheDay();

  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {greeting}
      </h1>
      {todaysQuote && (
        <p className="text-sm text-gray-600 italic max-w-2xl">
          "{todaysQuote.text}"
        </p>
      )}
    </div>
  );
};

export default DashboardHeader;
