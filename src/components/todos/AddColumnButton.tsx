
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddColumnButtonProps {
  onAddColumn: () => void;
}

const AddColumnButton = ({ onAddColumn }: AddColumnButtonProps) => {
  return (
    <Card className="min-w-80 bg-gray-50">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          onClick={onAddColumn}
          className="w-full justify-start text-gray-600 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another list
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddColumnButton;
