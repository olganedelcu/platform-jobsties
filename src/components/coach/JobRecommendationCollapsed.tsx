
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

interface JobRecommendationCollapsedProps {
  onExpand: () => void;
}

const JobRecommendationCollapsed = ({ onExpand }: JobRecommendationCollapsedProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Button
          onClick={onExpand}
          className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Briefcase className="h-4 w-4" />
          Send Job Recommendations to Mentee
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobRecommendationCollapsed;
