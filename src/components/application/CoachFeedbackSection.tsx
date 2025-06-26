
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplication } from '@/types/jobApplications';

interface CoachFeedbackSectionProps {
  application: JobApplication;
}

const CoachFeedbackSection = ({ application }: CoachFeedbackSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coach Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 min-h-[120px]">
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {application.coach_notes || 'No coach feedback yet.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachFeedbackSection;
