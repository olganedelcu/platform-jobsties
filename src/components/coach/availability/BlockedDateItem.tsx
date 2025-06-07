
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BlockedDateItemProps {
  date: string;
  onRemove: (date: string) => void;
}

const BlockedDateItem = ({ date, onRemove }: BlockedDateItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <span>{new Date(date).toLocaleDateString()}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRemove(date)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BlockedDateItem;
