
import React from 'react';
import { User } from 'lucide-react';

interface EmptyMessageStateProps {
  conversationSubject: string | null;
}

const EmptyMessageState = ({ conversationSubject }: EmptyMessageStateProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex-shrink-0">
        <div className="text-gray-900 font-medium flex items-center gap-2">
          <User className="h-5 w-5" />
          {conversationSubject || 'Conversation'}
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 min-h-0">
        <div className="text-center text-gray-500">
          <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-700 font-medium">No messages yet</p>
          <p className="text-sm text-gray-500 mt-1">Start the conversation below</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyMessageState;
