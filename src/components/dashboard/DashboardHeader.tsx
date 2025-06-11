
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface DashboardHeaderProps {
  user: any;
  firstName: string;
}

const DashboardHeader = ({ user, firstName }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good morning, {firstName}
          </h1>
          <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
        </div>
        <Avatar className="h-14 w-14">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={firstName} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
            <User className="h-7 w-7" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
