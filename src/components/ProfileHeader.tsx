
import React from 'react';
import { Input } from '@/components/ui/input';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileHeader = ({
  firstName,
  lastName,
  email,
  isEditing,
  onInputChange
}: ProfileHeaderProps) => {
  return (
    <>
      {isEditing ? (
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              placeholder="First Name"
              className="text-center"
            />
            <Input
              value={lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              placeholder="Last Name"
              className="text-center"
            />
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-600">{email}</p>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
