
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import CoachNavigation from '@/components/CoachNavigation';
import FormspreeConfiguration from '@/components/FormspreeConfiguration';

const NotificationsSettings = () => {
  const { user, loading, handleSignOut } = useAuthState();

  if (loading) {
    return <div className="min-h-screen bg-gray-50 animate-pulse" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications Settings</h1>
          <p className="text-gray-600 mt-2">Configure email notifications for your mentees</p>
        </div>
        
        <FormspreeConfiguration />
      </main>
    </div>
  );
};

export default NotificationsSettings;
