
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="relative p-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Daily Inspiration
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-transparent"></div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-2 -top-1 text-4xl text-purple-300/50 font-serif">"</div>
              <blockquote className="text-gray-800 text-lg leading-relaxed font-medium pl-6 pr-4 italic">
                {todaysQuote.text}
              </blockquote>
              <div className="absolute -right-2 -bottom-3 text-4xl text-purple-300/50 font-serif">"</div>
            </div>
            
            <div className="flex items-center justify-end">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300 mr-3"></div>
              <cite className="text-purple-700 font-semibold not-italic text-sm">
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
