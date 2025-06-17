
import React, { memo } from 'react';
import Navigation from '@/components/Navigation';
import { Loader2 } from 'lucide-react';

interface TrackerLayoutProps {
  user: any;
  onSignOut: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

const TrackerLayout = memo(({ user, onSignOut, loading, children }: TrackerLayoutProps) => {
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={onSignOut} />
      {children}
    </div>
  );
});

TrackerLayout.displayName = 'TrackerLayout';

export default TrackerLayout;
