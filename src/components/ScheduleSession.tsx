import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Video, Loader2 } from 'lucide-react';
import { useCoaches } from '@/hooks/useCoaches';

interface ScheduleSessionProps {
  onSchedule: (sessionData: any) => void;
  onCancel: () => void;
}

const ScheduleSession = ({ onSchedule, onCancel }: ScheduleSessionProps) => {
  const [sessionData, setSessionData] = useState({
    sessionType: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
    preferredCoach: ''
  });

  const { coaches, loading: coachesLoading } = useCoaches();

  const sessionTypes = [
    'CV Review',
    'Interview Preparation',
    'Career Planning',
    'LinkedIn Optimization',
    'Job Search Strategy',
    'General Mentoring'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(sessionData);
  };

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
              <Label htmlFor="preferredCoach">Preferred Coach</Label>
              <Select 
                value={sessionData.preferredCoach} 
                onValueChange={(value) => setSessionData({...sessionData, preferredCoach: value})}
                disabled={coachesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={coachesLoading ? "Loading coaches..." : "Select coach"} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {coachesLoading ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading coaches...
                      </div>
                    </SelectItem>
                  ) : coaches.length === 0 ? (
                    <SelectItem value="no-coaches" disabled>
                      No coaches available
                    </SelectItem>
                  ) : (
                    coaches.map((coach) => (
                      <SelectItem key={coach.id} value={`${coach.first_name} ${coach.last_name}`}>
                        {coach.first_name} {coach.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

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

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
