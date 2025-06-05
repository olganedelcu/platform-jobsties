
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileAboutProps {
  about: string;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileAbout = ({
  about,
  isEditing,
  onInputChange
}: ProfileAboutProps) => {
  return (
    <div className="mt-8">
      <Label className="text-left block text-gray-700 font-medium mb-2">About</Label>
      {isEditing ? (
        <Textarea 
          value={about}
          onChange={(e) => onInputChange('about', e.target.value)}
          placeholder="Tell us about yourself..." 
          className="min-h-[100px]"
        />
      ) : (
        <div className="text-gray-700 text-left min-h-[100px] p-3 bg-gray-50 rounded-md">
          {about || 'Tell us about yourself...'}
        </div>
      )}
    </div>
  );
};

export default ProfileAbout;
