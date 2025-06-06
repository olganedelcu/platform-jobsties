
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { NewJobApplicationData } from '@/types/jobApplications';

interface AddJobApplicationFormProps {
  onAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
}

const AddJobApplicationForm = ({ onAddApplication }: AddJobApplicationFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewJobApplicationData>({
    dateApplied: '',
    companyName: '',
    jobTitle: '',
    applicationStatus: 'applied',
    interviewStage: '',
    recruiterName: '',
    coachNotes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dateApplied || !formData.companyName || !formData.jobTitle) return;
    
    setLoading(true);
    try {
      await onAddApplication(formData);
      setFormData({
        dateApplied: '',
        companyName: '',
        jobTitle: '',
        applicationStatus: 'applied',
        interviewStage: '',
        recruiterName: '',
        coachNotes: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button 
        onClick={() => setShowForm(true)}
        className="mb-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Job Application
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Job Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied *</Label>
              <Input
                id="dateApplied"
                type="date"
                value={formData.dateApplied}
                onChange={(e) => setFormData(prev => ({ ...prev, dateApplied: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="applicationStatus">Application Status</Label>
              <select
                id="applicationStatus"
                value={formData.applicationStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationStatus: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="applied">Applied</option>
                <option value="in_review">In Review</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer Received</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interviewStage">Interview Stage</Label>
              <Input
                id="interviewStage"
                value={formData.interviewStage}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewStage: e.target.value }))}
                placeholder="e.g., Phone Screen, Technical Round"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recruiterName">Recruiter Name</Label>
              <Input
                id="recruiterName"
                value={formData.recruiterName}
                onChange={(e) => setFormData(prev => ({ ...prev, recruiterName: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coachNotes">Notes</Label>
            <Textarea
              id="coachNotes"
              value={formData.coachNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, coachNotes: e.target.value }))}
              placeholder="Any additional notes about this application..."
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Application'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJobApplicationForm;
