
import React from 'react';
import { User } from 'lucide-react';

const MessageThreadSkeleton = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex-shrink-0">
        <div className="text-gray-900 font-medium">Loading messages...</div>
      </div>
      <div className="flex-1 p-6 min-h-0">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageThreadSkeleton;
