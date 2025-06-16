
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuoteOfTheDay } from '@/hooks/useQuoteOfTheDay';

const QuoteOfTheDay = () => {
  const { todaysQuote } = useQuoteOfTheDay();

  if (!todaysQuote) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quote of the Day</h3>
          <blockquote className="text-gray-700 italic text-lg mb-2">
            "{todaysQuote.text}"
          </blockquote>
          <cite className="text-gray-600 text-sm">— {todaysQuote.author}</cite>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
