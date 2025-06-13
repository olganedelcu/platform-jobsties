
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';

const QuoteOfTheDay = () => {
  const { todaysQuote } = useQuoteOfTheDay();

  if (!todaysQuote) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Quote className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote of the Day</h3>
            <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-3">
              "{todaysQuote.text}"
            </blockquote>
            <cite className="text-blue-600 font-medium">— {todaysQuote.author}</cite>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
