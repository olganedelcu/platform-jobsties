
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AvailabilityLoadingCard = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="text-lg">Loading availability settings...</div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityLoadingCard;
