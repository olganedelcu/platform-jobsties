
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';

const QuoteOfTheDay = () => {
  const { todaysQuote } = useQuoteOfTheDay();

  if (!todaysQuote) {
    return null;
  }

  return (
    <Card className="bg-gray-50/50 border-gray-200/50 shadow-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite] transform -skew-x-12"></div>
      <CardContent className="p-3 relative z-10">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 p-1.5 bg-indigo-50 rounded-full">
            <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
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
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
