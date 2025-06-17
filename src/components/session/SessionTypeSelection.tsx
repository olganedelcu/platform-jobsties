
import React from 'react';
import { Users } from 'lucide-react';

interface SessionType {
  id: string;
  name: string;
  duration: number;
  description: string;
  icon: any;
  color: string;
}

interface SessionTypeSelectionProps {
  sessionTypes: SessionType[];
  selectedSessionType: string;
  onSessionTypeSelect: (typeId: string) => void;
}

const SessionTypeSelection = ({ 
  sessionTypes, 
  selectedSessionType, 
  onSessionTypeSelect 
}: SessionTypeSelectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Session Type</h2>
      <p className="text-gray-600 mb-8">Select the type of coaching session you'd like to book with Ana</p>
      
      <div className="max-w-md">
        {sessionTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div
              key={type.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-blue-300 rounded-lg p-6"
              onClick={() => onSessionTypeSelect(type.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 ${type.color} text-white rounded-xl`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="text-sm">{type.duration} min</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionTypeSelection;
