
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Briefcase, Send } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useMentees } from '@/hooks/useMentees';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';

const ApplicationsJobRecommendations = () => {
  const { user } = useAuthState();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobLink: '',
    companyName: '',
    weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  });

  const { mentees } = useMentees();
  const { addRecommendation } = useJobRecommendations({ 
    userId: user?.id || '', 
    isCoach: true 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobTitle || !formData.jobLink || !formData.companyName || selectedMentees.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields and select at least one mentee.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Send recommendations to all selected mentees
      const promises = selectedMentees.map(menteeId => 
        addRecommendation({
          menteeId,
          jobTitle: formData.jobTitle,
          jobLink: formData.jobLink,
          companyName: formData.companyName,
          weekStartDate: formData.weekStartDate
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `Job recommendation sent to ${selectedMentees.length} mentee(s) successfully.`,
      });

      // Reset form
      setFormData({
        jobTitle: '',
        jobLink: '',
        companyName: '',
        weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
      });
      setSelectedMentees([]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error sending recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to send job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMenteeToggle = (menteeId: string, checked: boolean) => {
    if (checked) {
      setSelectedMentees(prev => [...prev, menteeId]);
    } else {
      setSelectedMentees(prev => prev.filter(id => id !== menteeId));
    }
  };

  const handleSelectAll = () => {
    if (selectedMentees.length === mentees.length) {
      setSelectedMentees([]);
    } else {
      setSelectedMentees(mentees.map(m => m.id));
    }
  };

  const getWeekOptions = () => {
    const options = [];
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Current week and next 3 weeks
    for (let i = 0; i < 4; i++) {
      const week = addWeeks(currentWeek, i);
      const weekStr = format(week, 'yyyy-MM-dd');
      const displayStr = format(week, 'MMM dd, yyyy');
      options.push({ value: weekStr, label: `Week of ${displayStr}` });
    }
    
    return options;
  };

  if (!isFormOpen) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Briefcase className="h-4 w-4" />
            Send Job Recommendation to Mentees
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Send Job Recommendation
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFormOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g. Google"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="jobLink">Job Application Link</Label>
            <Input
              id="jobLink"
              type="url"
              value={formData.jobLink}
              onChange={(e) => setFormData(prev => ({ ...prev, jobLink: e.target.value }))}
              placeholder="https://company.com/careers/job-posting"
              required
            />
          </div>

          <div>
            <Label htmlFor="weekStartDate">Week</Label>
            <Select
              value={formData.weekStartDate}
              onValueChange={(value) => setFormData(prev => ({ ...prev, weekStartDate: value }))}
            >
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Mentees</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedMentees.length === mentees.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
              {mentees.length === 0 ? (
                <p className="text-sm text-gray-500">No mentees found</p>
              ) : (
                mentees.map((mentee) => (
                  <div key={mentee.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mentee-${mentee.id}`}
                      checked={selectedMentees.includes(mentee.id)}
                      onCheckedChange={(checked) => handleMenteeToggle(mentee.id, checked as boolean)}
                    />
                    <Label 
                      htmlFor={`mentee-${mentee.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {mentee.first_name} {mentee.last_name}
                    </Label>
                  </div>
                ))
              )}
            </div>
            
            {selectedMentees.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedMentees.length} mentee(s) selected
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={selectedMentees.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to {selectedMentees.length} Mentee(s)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApplicationsJobRecommendations;
