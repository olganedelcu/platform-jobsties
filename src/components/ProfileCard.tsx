
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Mail, Phone, Globe, Edit, Camera, Save, X } from 'lucide-react';

interface ProfileCardProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    phone: string;
    website: string;
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
                {profileData.firstName?.[0]}{profileData.lastName?.[0]}
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
        
        {isEditing ? (
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={profileData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                placeholder="First Name"
                className="text-center"
              />
              <Input
                value={profileData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                placeholder="Last Name"
                className="text-center"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
        )}
        
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            {isEditing ? (
              <Input 
                value={profileData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                placeholder="Add location"
                className="border-none bg-transparent p-0 flex-1"
              />
            ) : (
              <span className="text-gray-700">{profileData.location || 'Add location'}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">{profileData.email}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            {isEditing ? (
              <Input 
                value={profileData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="Add phone number"
                className="border-none bg-transparent p-0 flex-1"
              />
            ) : (
              <span className="text-gray-700">{profileData.phone || 'Add phone number'}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Globe className="h-4 w-4 text-gray-400" />
            {isEditing ? (
              <Input 
                value={profileData.website}
                onChange={(e) => onInputChange('website', e.target.value)}
                placeholder="Add website"
                className="border-none bg-transparent p-0 flex-1"
              />
            ) : (
              <span className="text-gray-700">{profileData.website || 'Add website'}</span>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Label className="text-left block text-gray-700 font-medium mb-2">About</Label>
          {isEditing ? (
            <Textarea 
              value={profileData.about}
              onChange={(e) => onInputChange('about', e.target.value)}
              placeholder="Tell us about yourself..." 
              className="min-h-[100px]"
            />
          ) : (
            <div className="text-gray-700 text-left min-h-[100px] p-3 bg-gray-50 rounded-md">
              {profileData.about || 'Tell us about yourself...'}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 mt-6">
          {isEditing ? (
            <>
              <Button 
                onClick={onSave}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
