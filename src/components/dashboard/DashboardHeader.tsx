
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';

interface DashboardHeaderProps {
  user: any;
  firstName: string;
}

const DashboardHeader = ({ user, firstName }: DashboardHeaderProps) => {
  const { greeting } = useTimeBasedGreeting(firstName);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}
          </h1>
          <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
