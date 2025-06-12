
import React from 'react';

interface ApplicationsStatsCardProps {
  applicationsThisMonth: number;
  onClick: () => void;
}

const ApplicationsStatsCard = ({ applicationsThisMonth, onClick }: ApplicationsStatsCardProps) => {
  return (
    <div className="text-center py-6 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="text-4xl font-bold text-blue-600 mb-2">{applicationsThisMonth}</div>
      <div className="text-sm text-gray-600 mb-4">Applications this month</div>
      <div className="flex justify-center gap-1">
        {[...Array(Math.min(applicationsThisMonth, 12))].map((_, i) => (
          <div key={i} className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsStatsCard;
