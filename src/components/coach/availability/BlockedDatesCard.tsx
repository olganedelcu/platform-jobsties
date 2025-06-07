
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import BlockedDateItem from './BlockedDateItem';

interface BlockedDatesCardProps {
  blockedDates: string[];
  newBlockedDate: string;
  onNewBlockedDateChange: (date: string) => void;
  onAddBlockedDate: () => void;
  onRemoveBlockedDate: (date: string) => void;
}

const BlockedDatesCard = ({
  blockedDates,
  newBlockedDate,
  onNewBlockedDateChange,
  onAddBlockedDate,
  onRemoveBlockedDate
}: BlockedDatesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="date"
            value={newBlockedDate}
            onChange={(e) => onNewBlockedDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="flex-1"
          />
          <Button onClick={onAddBlockedDate} disabled={!newBlockedDate}>
            <Plus className="h-4 w-4 mr-2" />
            Block Date
          </Button>
        </div>
        
        {blockedDates.length > 0 && (
          <div className="space-y-2">
            {blockedDates.map((date) => (
              <BlockedDateItem
                key={date}
                date={date}
                onRemove={onRemoveBlockedDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockedDatesCard;
