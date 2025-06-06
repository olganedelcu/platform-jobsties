
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Video } from 'lucide-react';
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

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

  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);
  const { isConnected: isCalendarConnected } = useGoogleCalendar(userId || null);

  // Updated session types - removed Career Planning, LinkedIn Optimization, and General Mentoring
  const sessionTypes = [
    'CV Review',
    'Interview Preparation', 
    'Job Search Strategy'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Calendly JavaScript
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Calendly badge widget for CV Review
      if (window.Calendly) {
        window.Calendly.initBadgeWidget({ 
          url: 'https://calendly.com/ana-jobsties/review-cv', 
          text: 'Schedule CV Review', 
          color: '#0069ff', 
          textColor: '#ffffff' 
        });
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(sessionData);
  };

  const renderCalendlyWidget = () => {
    if (sessionData.sessionType === 'CV Review') {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">CV Review & LinkedIn Optimization</h3>
            <p className="text-blue-700 text-sm mb-3">
              Schedule your CV review and LinkedIn optimization session with Ana using Calendly below.
            </p>
          </div>
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/ana-jobsties/cv-linkedin" 
            style={{ minWidth: '320px', height: '600px' }}
          />
        </div>
      );
    }
    return null;
  };

  // If CV Review is selected, show Calendly widget
  if (sessionData.sessionType === 'CV Review') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <span>Schedule a CV Review Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSessionData({ ...sessionData, sessionType: '' })}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ← Back to Session Types
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
            {renderCalendlyWidget()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span>Schedule a Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Google Calendar Integration Section */}
          {userId && (
            <div className="space-y-4">
              {!showCalendarIntegration && !isCalendarConnected && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-800 font-medium">Want automatic calendar sync?</p>
                      <p className="text-amber-600 text-sm">Connect Google Calendar to automatically create events for your sessions.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCalendarIntegration(true)}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              )}

              {showCalendarIntegration && (
                <GoogleCalendarIntegration
                  userId={userId}
                  onConnectionChange={(connected) => {
                    if (connected) {
                      setShowCalendarIntegration(false);
                    }
                  }}
                />
              )}

              {isCalendarConnected && !showCalendarIntegration && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Google Calendar connected</p>
                      <p>Your session will be automatically added to your calendar</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionType">Session Type</Label>
              <Select value={sessionData.sessionType} onValueChange={(value) => setSessionData({...sessionData, sessionType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {sessionTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredCoach">Coach</Label>
              <Select 
                value={sessionData.preferredCoach} 
                onValueChange={(value) => setSessionData({...sessionData, preferredCoach: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Ana Nedelcu">Ana Nedelcu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Regular form fields for other session types */}
          {sessionData.sessionType && sessionData.sessionType !== 'CV Review' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={sessionData.date}
                    onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
                    className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={sessionData.time} onValueChange={(value) => setSessionData({...sessionData, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={sessionData.duration} onValueChange={(value) => setSessionData({...sessionData, duration: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific topics you'd like to discuss or preparation you've done..."
                  value={sessionData.notes}
                  onChange={(e) => setSessionData({...sessionData, notes: e.target.value})}
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                <Video className="h-5 w-5 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Session will be conducted via video call</p>
                  <p>You'll receive a meeting link once your session is confirmed</p>
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={!sessionData.sessionType}
            >
              Schedule Session
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleSession;
