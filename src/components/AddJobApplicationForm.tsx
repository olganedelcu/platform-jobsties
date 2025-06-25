
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
    date_applied: '',
    company_name: '',
    job_title: '',
    application_status: 'applied',
    interview_stage: '',
    recruiter_name: '',
    mentee_notes: '',
    job_link: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date_applied || !formData.company_name || !formData.job_title) return;
    
    setLoading(true);
    try {
      await onAddApplication(formData);
      setFormData({
        date_applied: '',
        company_name: '',
        job_title: '',
        application_status: 'applied',
        interview_stage: '',
        recruiter_name: '',
        mentee_notes: '',
        job_link: ''
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
        className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
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
              <Label htmlFor="date_applied">Date Applied *</Label>
              <Input
                id="date_applied"
                type="date"
                value={formData.date_applied}
                onChange={(e) => setFormData(prev => ({ ...prev, date_applied: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title *</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_link">Job Link</Label>
              <Input
                id="job_link"
                value={formData.job_link || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, job_link: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="application_status">Application Status</Label>
              <select
                id="application_status"
                value={formData.application_status}
                onChange={(e) => setFormData(prev => ({ ...prev, application_status: e.target.value as any }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="applied">Applied</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interview_stage">Interview Stage</Label>
              <Input
                id="interview_stage"
                value={formData.interview_stage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, interview_stage: e.target.value }))}
                placeholder="e.g., Phone Screen, Technical Round"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recruiter_name">Recruiter Name</Label>
              <Input
                id="recruiter_name"
                value={formData.recruiter_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, recruiter_name: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mentee_notes">Notes</Label>
            <Textarea
              id="mentee_notes"
              value={formData.mentee_notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, mentee_notes: e.target.value }))}
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
