
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Calendar, UserPlus } from 'lucide-react';
import MenteeMultiSelector from './MenteeMultiSelector';
import { format, startOfWeek, addWeeks } from 'date-fns';

interface JobRecommendationAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (menteeIds: string[], weekStartDate: string) => void;
  recommendationTitle?: string;
  companyName?: string;
}

const JobRecommendationAssignmentDialog = ({
  open,
  onClose,
  onAssign,
  recommendationTitle,
  companyName
}: JobRecommendationAssignmentDialogProps) => {
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [weekStartDate, setWeekStartDate] = useState(() => {
    return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });

  const getWeekOptions = () => {
    const options = [];
    const today = new Date();
    
    // Current week and next 4 weeks
    for (let i = 0; i < 5; i++) {
      const weekStart = startOfWeek(addWeeks(today, i), { weekStartsOn: 1 });
      const weekEnd = addWeeks(weekStart, 1);
      
      options.push({
        value: format(weekStart, 'yyyy-MM-dd'),
        label: `Week of ${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
      });
    }
    
    return options;
  };

  const handleSubmit = () => {
    if (selectedMentees.length === 0) return;
    onAssign(selectedMentees, weekStartDate);
    // Reset form
    setSelectedMentees([]);
    setWeekStartDate(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  };

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev => 
      prev.includes(menteeId) 
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Job to Additional Mentees
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {recommendationTitle}
            </h4>
            <p className="text-gray-600">at {companyName}</p>
          </div>

          {/* Week Selection */}
          <div>
            <Label htmlFor="weekStartDate" className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Target Week
            </Label>
            <Select value={weekStartDate} onValueChange={setWeekStartDate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getWeekOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mentee Selection */}
          <div>
            <Label className="mb-3 block">Select Additional Mentees</Label>
            <MenteeMultiSelector
              selectedMentees={selectedMentees}
              onToggleMentee={toggleMenteeSelection}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selectedMentees.length} mentee(s) selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={selectedMentees.length === 0}
              >
                Assign to {selectedMentees.length} Mentee(s)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobRecommendationAssignmentDialog;
