
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Mail, Phone } from 'lucide-react';

interface ProfileContactInfoProps {
  location: string;
  email: string;
  phone: string;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ProfileContactInfo = ({
  location,
  email,
  phone,
  isEditing,
  onInputChange
}: ProfileContactInfoProps) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center space-x-3">
        <MapPin className="h-4 w-4 text-gray-400" />
        {isEditing ? (
          <Input 
            value={location}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="Add location"
            className="border-none bg-transparent p-0 flex-1"
          />
        ) : (
          <span className="text-gray-700">{location || 'Add location'}</span>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <Mail className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700">{email}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Phone className="h-4 w-4 text-gray-400" />
        {isEditing ? (
          <Input 
            value={phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Add phone number"
            className="border-none bg-transparent p-0 flex-1"
          />
        ) : (
          <span className="text-gray-700">{phone || 'Add phone number'}</span>
        )}
      </div>
    </div>
  );
};

export default ProfileContactInfo;
