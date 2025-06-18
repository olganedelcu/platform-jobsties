
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfileData } from '@/hooks/useProfileData';
import Navigation from '@/components/Navigation';
import ProfileCard from '@/components/ProfileCard';

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
      
      <main className="max-w-7xl mx-auto py-8 px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="p-4">
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
            </div>
          </div>
          
          {/* Content Area - Ready for your form with questions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Career Goals & Questions
              </h3>
              <p className="text-gray-600">
                This section will contain a form with career-related questions for you to answer.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
