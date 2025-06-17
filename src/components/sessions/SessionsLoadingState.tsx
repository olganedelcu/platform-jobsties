
import React from 'react';
import { Loader2 } from 'lucide-react';

const SessionsLoadingState = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <span className="ml-2 text-gray-600">Loading sessions...</span>
    </div>
  );
};

export default SessionsLoadingState;
