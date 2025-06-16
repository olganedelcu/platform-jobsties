
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

interface LoadMoreButtonProps {
  show: boolean;
  hasMoreMessages: boolean;
  totalMessages: number;
  visibleMessagesCount: number;
  onLoadMore: () => void;
  variant?: 'floating' | 'inline';
}

const LoadMoreButton = ({ 
  show, 
  hasMoreMessages, 
  totalMessages, 
  visibleMessagesCount, 
  onLoadMore, 
  variant = 'floating' 
}: LoadMoreButtonProps) => {
  if (!hasMoreMessages) return null;

  if (variant === 'floating' && show) {
    return (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          size="sm"
          variant="outline"
          className="bg-white shadow-md hover:bg-gray-50 text-xs"
          onClick={onLoadMore}
        >
          <ChevronUp className="h-3 w-3 mr-1" />
          Load more messages
        </Button>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="text-center py-2">
        <button
          onClick={onLoadMore}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          {totalMessages - visibleMessagesCount} older messages
        </button>
      </div>
    );
  }

  return null;
};

export default LoadMoreButton;
