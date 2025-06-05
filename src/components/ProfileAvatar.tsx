
import React from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  isEditing: boolean;
  onProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar = ({
  profilePicture,
  firstName,
  lastName,
  isEditing,
  onProfilePictureUpload
}: ProfileAvatarProps) => {
  return (
    <div className="relative inline-block mb-4">
      {profilePicture ? (
        <img 
          src={profilePicture} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover"
        />
      ) : (
        <div className="w-32 h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {firstName?.[0]}{lastName?.[0]}
          </span>
        </div>
      )}
      
      {isEditing && (
        <label className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full cursor-pointer hover:from-indigo-700 hover:to-purple-700">
          <Camera className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            onChange={onProfilePictureUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ProfileAvatar;
