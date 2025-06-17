
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Video, MessageSquare, Target, Calendar } from 'lucide-react';

interface SessionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SessionTypeSelector = ({ value, onChange }: SessionTypeSelectorProps) => {
  const sessionTypes = [
    {
      id: 'General Coaching',
      title: 'General Coaching',
      description: 'Comprehensive career guidance and support',
      duration: '60 min',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: 'Interview Preparation',
      title: 'Interview Preparation', 
      description: 'Practice interviews and feedback',
      duration: '45 min',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    },
    {
      id: 'CV Review',
      title: 'CV Review',
      description: 'Professional resume optimization',
      duration: '30 min', 
      icon: Target,
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600'
    },
    {
      id: 'Mock Interview',
      title: 'Mock Interview',
      description: 'Realistic interview simulation',
      duration: '60 min',
      icon: Video,
      color: 'bg-gradient-to-br from-blue-600 to-blue-700'
    },
    {
      id: 'Career Planning',
      title: 'Career Planning',
      description: 'Long-term career strategy discussion',
      duration: '75 min',
      icon: Calendar,
      color: 'bg-gradient-to-br from-slate-500 to-slate-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Session Type</h3>
        <p className="text-sm text-gray-600">Select the type of coaching session you'd like to book</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sessionTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.id;
          
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                isSelected 
                  ? 'border-blue-500 shadow-lg shadow-blue-100 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onChange(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${type.color} text-white flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {type.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {type.duration}
                      </Badge>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SessionTypeSelector;
