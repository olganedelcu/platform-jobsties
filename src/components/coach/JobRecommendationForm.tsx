
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useMentees } from '@/hooks/useMentees';
import { format, startOfWeek, addWeeks } from 'date-fns';

interface JobRecommendationFormProps {
  coachId: string;
}

const JobRecommendationForm = ({ coachId }: JobRecommendationFormProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    menteeId: '',
    jobTitle: '',
    jobLink: '',
    companyName: '',
    weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  });

  const { mentees } = useMentees();
  const { addRecommendation } = useJobRecommendations({ userId: coachId, isCoach: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.menteeId || !formData.jobTitle || !formData.jobLink || !formData.companyName) {
      return;
    }

    await addRecommendation({
      menteeId: formData.menteeId,
      jobTitle: formData.jobTitle,
      jobLink: formData.jobLink,
      companyName: formData.companyName,
      weekStartDate: formData.weekStartDate
    });

    // Reset form
    setFormData({
      menteeId: '',
      jobTitle: '',
      jobLink: '',
      companyName: '',
      weekStartDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    });
    setIsFormOpen(false);
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
      <Card>
        <CardContent className="p-6">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Job Recommendation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add Job Recommendation
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
          <div>
            <Label htmlFor="menteeId">Mentee</Label>
            <Select
              value={formData.menteeId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, menteeId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a mentee" />
              </SelectTrigger>
              <SelectContent>
                {mentees.map((mentee) => (
                  <SelectItem key={mentee.id} value={mentee.id}>
                    {mentee.first_name} {mentee.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div>
            <Label htmlFor="jobLink">Job Link</Label>
            <Input
              id="jobLink"
              type="url"
              value={formData.jobLink}
              onChange={(e) => setFormData(prev => ({ ...prev, jobLink: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Recommendation
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

export default JobRecommendationForm;
