
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, FileText } from 'lucide-react';

interface SessionData {
  date: string;
  time: string;
  duration: string;
  preferredCoach: string;
  notes: string;
}

interface SessionFormProps {
  sessionData: SessionData;
  onSessionDataChange: (data: SessionData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SessionForm = ({ sessionData, onSessionDataChange, onSubmit, onCancel }: SessionFormProps) => {
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            Preferred Date
          </Label>
          <Input
            id="date"
            type="date"
            value={sessionData.date}
            min={today}
            onChange={(e) => onSessionDataChange({...sessionData, date: e.target.value})}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            required
          />
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            Preferred Time
          </Label>
          <Input
            id="time"
            type="time"
            value={sessionData.time}
            onChange={(e) => onSessionDataChange({...sessionData, time: e.target.value})}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            Duration
          </Label>
          <Select value={sessionData.duration} onValueChange={(value) => onSessionDataChange({...sessionData, duration: value})}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="75">75 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Coach Selection */}
        <div className="space-y-2">
          <Label htmlFor="coach" className="text-sm font-medium text-gray-700 flex items-center">
            <User className="h-4 w-4 mr-2 text-blue-500" />
            Preferred Coach
          </Label>
          <Select value={sessionData.preferredCoach} onValueChange={(value) => onSessionDataChange({...sessionData, preferredCoach: value})}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
              <SelectValue placeholder="Select coach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ana Nedelcu">Ana Nedelcu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Any specific topics you'd like to discuss or questions you have..."
          value={sessionData.notes}
          onChange={(e) => onSessionDataChange({...sessionData, notes: e.target.value})}
          className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Schedule Session
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
