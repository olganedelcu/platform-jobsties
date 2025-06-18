
import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfileData } from '@/hooks/useProfileData';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import PageWrapper from '@/components/layout/PageWrapper';

const CoachProfile = () => {
  const { user, loading: authLoading } = useAuthState();
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
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-7xl mx-auto py-8 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1">
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
            
            {/* Content Area - Ready for your form with questions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Coming Soon
                </h3>
                <p className="text-gray-600">
                  This area will contain a form with questions for you to answer.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachProfile;
