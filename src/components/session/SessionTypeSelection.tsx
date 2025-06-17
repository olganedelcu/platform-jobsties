
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';

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
  onSelectSessionType: (sessionTypeId: string) => void;
  onCancel: () => void;
}

const SessionTypeSelection = ({ sessionTypes, onSelectSessionType, onCancel }: SessionTypeSelectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Calendar className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Schedule Your Session</h1>
            <p className="text-blue-100 mt-2">Book a personalized coaching session with Ana Nedelcu</p>
          </div>
        </div>
      </div>

      {/* Smart Scheduling Banner */}
      <div className="p-8 bg-gray-50 border-b">
        <div className="flex items-start space-x-4 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-blue-900">Smart Scheduling</h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Cal.com Integration</Badge>
            </div>
            <p className="text-blue-700 mb-3">
              Your session will be automatically added to both your calendar and Ana's calendar. Availability
              is synced in real-time with Ana's Cal.com calendar to ensure accurate scheduling.
            </p>
            <div className="flex items-center space-x-4 text-sm text-blue-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Real-time availability</span>
              </div>
              <span>•</span>
              <span>Calendar sync</span>
              <span>•</span>
              <span>Video call setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Type */}
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Session Type</h2>
        <p className="text-gray-600 mb-8">Select the type of coaching session you'd like to book</p>
        
        <div className="max-w-md">
          {sessionTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card 
                key={type.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-blue-300"
                onClick={() => onSelectSessionType(type.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 ${type.color} text-white rounded-xl`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{type.duration} min</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="p-8 border-t bg-gray-50">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SessionTypeSelection;
