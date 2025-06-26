
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';

interface ContactInformationCardProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication>;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
}

const ContactInformationCard = ({
  application,
  isEditing,
  editData,
  onEditDataChange
}: ContactInformationCardProps) => {
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-700">
          <User className="h-5 w-5 mr-2" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Recruiter:</span>
          </div>
          {isEditing ? (
            <Input
              value={editData.recruiter_name || ''}
              onChange={(e) => onEditDataChange({ recruiter_name: e.target.value })}
              className="border-gray-300 focus:border-gray-500"
              placeholder="Recruiter name"
            />
          ) : (
            <p className="font-medium ml-6 text-gray-800">
              {application.recruiter_name || 'Not specified'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformationCard;
