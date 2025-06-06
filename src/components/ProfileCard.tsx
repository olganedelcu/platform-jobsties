
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileAvatar from '@/components/ProfileAvatar';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileContactInfo from '@/components/ProfileContactInfo';
import ProfileAbout from '@/components/ProfileAbout';
import ProfileActions from '@/components/ProfileActions';

interface ProfileCardProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    phone: string;
    about: string;
  };
  profilePicture: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: string, value: string) => void;
  onProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileCard = ({
  profileData,
  profilePicture,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onProfilePictureUpload
}: ProfileCardProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <ProfileAvatar
          profilePicture={profilePicture}
          firstName={profileData.firstName}
          lastName={profileData.lastName}
          isEditing={isEditing}
          onProfilePictureUpload={onProfilePictureUpload}
        />
        
        <ProfileHeader
          firstName={profileData.firstName}
          lastName={profileData.lastName}
          email={profileData.email}
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
        
        <ProfileContactInfo
          location={profileData.location}
          email={profileData.email}
          phone={profileData.phone}
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
        
        <ProfileAbout
          about={profileData.about}
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
        
        <ProfileActions
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
