
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Sparkles } from 'lucide-react';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';

interface DashboardHeaderProps {
  user: any;
  firstName: string;
}

const DashboardHeader = ({ user, firstName }: DashboardHeaderProps) => {
  const { greeting } = useTimeBasedGreeting(firstName);
  const { todaysQuote } = useQuoteOfTheDay();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}
          </h1>
          <div className="space-y-2">
            {todaysQuote && (
              <div className="text-gray-600">
                <span className="font-medium">{todaysQuote.text}</span>
                <span className="text-gray-500 ml-2">— {todaysQuote.author}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
