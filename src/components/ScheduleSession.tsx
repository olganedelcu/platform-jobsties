
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import SessionTypeSelector from '@/components/session/SessionTypeSelector';
import SessionForm from '@/components/session/SessionForm';
import CalendarIntegrationBanner from '@/components/session/CalendarIntegrationBanner';
import CalComBookingInterface from '@/components/session/CalComBookingInterface';

interface ScheduleSessionProps {
  onSchedule: (sessionData: any) => void;
  onCancel: () => void;
  userId?: string;
}

const ScheduleSession = ({ onSchedule, onCancel, userId }: ScheduleSessionProps) => {
  const [sessionData, setSessionData] = useState({
    sessionType: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
    preferredCoach: 'Ana Nedelcu'
  });
  const [showCalComInterface, setShowCalComInterface] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting session data:', sessionData);
    
    // Validate required fields
    if (!sessionData.sessionType || !sessionData.date || !sessionData.time) {
      console.error('Missing required fields:', {
        sessionType: sessionData.sessionType,
        date: sessionData.date,
        time: sessionData.time
      });
      return;
    }
    
    onSchedule(sessionData);
  };

  const handleCalComBooking = (bookingData: any) => {
    console.log('Cal.com booking data:', bookingData);
    onSchedule(bookingData);
  };

  const handleProceedToBooking = () => {
    if (sessionData.sessionType) {
      setShowCalComInterface(true);
    }
  };

  // Show Cal.com booking interface if session type is selected and user chose to proceed
  if (showCalComInterface) {
    return (
      <CalComBookingInterface
        onBookSession={handleCalComBooking}
        onBack={() => setShowCalComInterface(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-8">
          <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <span>Schedule Your Session</span>
          </CardTitle>
          <p className="text-blue-100 mt-2">
            Book a personalized coaching session with Ana Nedelcu
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Calendar Integration Banner */}
          <CalendarIntegrationBanner />

          {/* Session Type Selection */}
          <SessionTypeSelector
            value={sessionData.sessionType}
            onChange={(value) => {
              console.log('Session type changed to:', value);
              setSessionData({...sessionData, sessionType: value});
            }}
          />

          {/* Enhanced booking options */}
          {sessionData.sessionType && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Booking Method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card 
                  className="cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-blue-200 bg-blue-50"
                  onClick={handleProceedToBooking}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600 text-white rounded-lg">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-700">Calendar Booking</h4>
                        <p className="text-sm text-blue-600">Modern calendar interface</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-600 text-white rounded-lg">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Quick Form</h4>
                        <p className="text-sm text-gray-600">Traditional form booking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <SessionForm
                sessionData={sessionData}
                onSessionDataChange={(newData) => {
                  console.log('Session data changed:', newData);
                  setSessionData(newData);
                }}
                onSubmit={handleSubmit}
                onCancel={onCancel}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleSession;
