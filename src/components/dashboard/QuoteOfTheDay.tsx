
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-none shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
      
      <CardContent className="relative p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Daily Inspiration
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-transparent"></div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-1 -top-1 text-3xl text-purple-300/50 font-serif">"</div>
              <blockquote className="text-gray-800 text-base leading-relaxed font-medium pl-5 pr-4 italic">
                {todaysQuote.text}
              </blockquote>
              <div className="absolute -right-1 -bottom-3 text-3xl text-purple-300/50 font-serif">"</div>
            </div>
            
            <div className="flex items-center justify-end pt-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-300 mr-2"></div>
              <cite className="text-purple-700 font-semibold not-italic text-xs">
                {todaysQuote.author}
              </cite>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
