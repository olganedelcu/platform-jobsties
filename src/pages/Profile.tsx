
import React from 'react';
import Navigation from '@/components/Navigation';
import AddExperience from '@/components/AddExperience';
import AddEducation from '@/components/AddEducation';
import ProfileCard from '@/components/ProfileCard';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfileData } from '@/hooks/useProfileData';
import { useExperienceData } from '@/hooks/useExperienceData';
import { useEducationData } from '@/hooks/useEducationData';

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
  
  const {
    experiences,
    showAddExperience,
    setShowAddExperience,
    handleAddExperience,
    handleDeleteExperience,
    loading: experiencesLoading
  } = useExperienceData(user);
  
  const {
    educations,
    showAddEducation,
    setShowAddEducation,
    handleAddEducation,
    handleDeleteEducation,
    loading: educationsLoading
  } = useEducationData(user);

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
          
          {/* Experience and Education */}
          <div className="lg:col-span-2 space-y-6">
            <ExperienceSection
              experiences={experiences}
              onAddExperience={() => setShowAddExperience(true)}
              onDeleteExperience={handleDeleteExperience}
              loading={experiencesLoading}
            />
            
            <EducationSection
              educations={educations}
              onAddEducation={() => setShowAddEducation(true)}
              onDeleteEducation={handleDeleteEducation}
              loading={educationsLoading}
            />
          </div>
        </div>
      </main>

      {/* Add Experience Dialog */}
      <AddExperience
        isOpen={showAddExperience}
        onClose={() => setShowAddExperience(false)}
        onAdd={handleAddExperience}
      />

      {/* Add Education Dialog */}
      <AddEducation
        isOpen={showAddEducation}
        onClose={() => setShowAddEducation(false)}
        onAdd={handleAddEducation}
      />
    </div>
  );
};

export default Profile;
