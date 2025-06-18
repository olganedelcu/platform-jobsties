
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CVUploadContent from '@/components/CVUploadContent';
import PageWrapper from '@/components/layout/PageWrapper';

const CVUpload = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <PageWrapper loading={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CVUploadContent />
      </div>
    </ProtectedCoachRoute>
  );
};

export default CVUpload;
