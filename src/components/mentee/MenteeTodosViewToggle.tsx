
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface MenteeTodosViewToggleProps {
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
}

const MenteeTodosViewToggle = ({ viewMode, onViewModeChange }: MenteeTodosViewToggleProps) => {
  return (
    <Button
      onClick={() => onViewModeChange(viewMode === 'list' ? 'board' : 'list')}
      variant="outline"
      className="flex items-center space-x-2"
    >
      {viewMode === 'list' ? (
        <>
          <LayoutGrid className="h-4 w-4" />
          <span>Board View</span>
        </>
      ) : (
        <>
          <List className="h-4 w-4" />
          <span>List View</span>
        </>
      )}
    </Button>
  );
};

export default MenteeTodosViewToggle;
