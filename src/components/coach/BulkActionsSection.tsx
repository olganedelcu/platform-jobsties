
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface BulkActionsSectionProps {
  selectedAssignments: string[];
  onDeleteSelected: () => void;
}

const BulkActionsSection = ({ selectedAssignments, onDeleteSelected }: BulkActionsSectionProps) => {
  if (selectedAssignments.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        {selectedAssignments.length} selected
      </Badge>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDeleteSelected}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete Selected
      </Button>
    </div>
  );
};

export default BulkActionsSection;
