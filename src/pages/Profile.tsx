
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfileData } from '@/hooks/useProfileData';
import Navigation from '@/components/Navigation';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileCard from '@/components/ProfileCard';
import ProfileContactInfo from '@/components/ProfileContactInfo';
import ProfileAbout from '@/components/ProfileAbout';
import ProfileActions from '@/components/ProfileActions';

const Profile = () => {
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const {
    profileData,
    profilePicture,
    isEditing,
    loading: profileLoading,
    setIsEditing,
    handleProfilePictureUpload,
    handleSaveProfile,
    handleInputChange
  } = useProfileData(user);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-4xl mx-auto py-8 px-6">
        <ProfileHeader
          firstName={profileData.firstName}
          lastName={profileData.lastName}
          email={profileData.email}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfileCard
              profileData={profileData}
              profilePicture={profilePicture}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
              onInputChange={handleInputChange}
              onProfilePictureUpload={handleProfilePictureUpload}
            />
            
            {/* Placeholder for future form with questions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Goals & Questions</h3>
              <p className="text-gray-600">This section will contain a form with career-related questions.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* ProfileActions is already included in ProfileCard, so we don't need it here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
