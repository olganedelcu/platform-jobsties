
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface JobApplicationStatusBadgeProps {
  status: string;
}

const JobApplicationStatusBadge = ({ status }: JobApplicationStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};

export default JobApplicationStatusBadge;
