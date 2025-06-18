
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import FormspreeConfiguration from '@/components/FormspreeConfiguration';
import PageWrapper from '@/components/layout/PageWrapper';

const NotificationsSettings = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
