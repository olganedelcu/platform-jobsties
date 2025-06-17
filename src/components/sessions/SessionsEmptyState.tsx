
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface SessionsEmptyStateProps {
  onScheduleClick: () => void;
}

const SessionsEmptyState = ({ onScheduleClick }: SessionsEmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
      <h3 className="text-xl font-medium text-gray-900 mb-3">No sessions scheduled</h3>
      <p className="text-gray-500 mb-8">Get started by scheduling your first coaching session</p>
      <Button 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3"
        onClick={onScheduleClick}
      >
        <Plus className="h-4 w-4 mr-2" />
        Schedule Your First Session
      </Button>
    </div>
  );
};

export default SessionsEmptyState;
