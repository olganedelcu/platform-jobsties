
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
  const { profile, loading: profileLoading, updateProfile } = useProfileData(user);

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
        <ProfileHeader user={user} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfileCard user={user} profile={profile} />
            <ProfileContactInfo profile={profile} onUpdate={updateProfile} />
            <ProfileAbout profile={profile} onUpdate={updateProfile} />
            
            {/* Placeholder for future form with questions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Goals & Questions</h3>
              <p className="text-gray-600">This section will contain a form with career-related questions.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <ProfileActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
