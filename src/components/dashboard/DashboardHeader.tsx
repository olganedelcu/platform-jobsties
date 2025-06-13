
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
          <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
        </div>
      </div>
      
      {todaysQuote && (
        <div className="max-w-lg">
          <div className="bg-gray-50/30 rounded-md p-2 shadow-none">
            <div className="flex items-center space-x-1.5">
              <div className="flex-shrink-0 p-1 bg-indigo-50 rounded-full">
                <Sparkles className="h-2.5 w-2.5 text-indigo-500" />
              </div>
              <div className="flex-1 space-y-0.5">
                <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                  Daily Quote
                </h3>
                
                <blockquote className="text-gray-600 text-xs leading-relaxed italic">
                  "{todaysQuote.text}"
                </blockquote>
                
                <div className="flex items-center justify-end">
                  <cite className="text-gray-500 not-italic text-xs">
                    — {todaysQuote.author}
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
