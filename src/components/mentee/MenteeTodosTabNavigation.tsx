
import React from 'react';

interface MenteeTodosTabNavigationProps {
  activeTab: 'assignments' | 'personal';
  onTabChange: (tab: 'assignments' | 'personal') => void;
  assignmentsCount: number;
  todosCount: number;
}

const MenteeTodosTabNavigation = ({ 
  activeTab, 
  onTabChange, 
  assignmentsCount, 
  todosCount 
}: MenteeTodosTabNavigationProps) => {
  return (
    <div className="flex space-x-1 mb-6">
      <button
        onClick={() => onTabChange('assignments')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'assignments'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Coach Assignments ({assignmentsCount})
      </button>
      <button
        onClick={() => onTabChange('personal')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'personal'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Personal Todos ({todosCount})
      </button>
    </div>
  );
};

export default MenteeTodosTabNavigation;
