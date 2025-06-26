
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';

interface InterviewStageCardProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication>;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
}

const InterviewStageCard = ({
  application,
  isEditing,
  editData,
  onEditDataChange
}: InterviewStageCardProps) => {
  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-700">
          <MessageSquare className="h-5 w-5 mr-2" />
          Interview Stage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">Current Stage:</span>
          </div>
          {isEditing ? (
            <Input
              value={editData.interview_stage || ''}
              onChange={(e) => onEditDataChange({ interview_stage: e.target.value })}
              className="border-purple-300 focus:border-purple-500"
              placeholder="e.g., Phone Screen, Technical Interview"
            />
          ) : (
            <p className="font-medium ml-6 text-purple-800">
              {application.interview_stage || 'Not specified'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewStageCard;
