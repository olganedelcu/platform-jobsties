
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import BackupManagement from '@/components/BackupManagement';
import BackupErrorBoundary from '@/components/BackupErrorBoundary';
import PageWrapper from '@/components/layout/PageWrapper';

const BackupManagementPage = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-7xl mx-auto py-8 px-6">
          <BackupErrorBoundary>
            <BackupManagement />
          </BackupErrorBoundary>
        </main>
      </div>
    </ProtectedCoachRoute>
  );
};

export default BackupManagementPage;
