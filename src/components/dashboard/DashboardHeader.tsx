
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
        <div className="max-w-md">
          <div className="bg-gray-50/50 border border-gray-200/50 rounded-lg p-3 shadow-none">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 p-1.5 bg-gray-100 rounded-full">
                <Sparkles className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Daily Quote
                </h3>
                
                <blockquote className="text-gray-600 text-sm leading-relaxed italic">
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
