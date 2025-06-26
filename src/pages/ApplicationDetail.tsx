
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Building2, Briefcase, User, Edit, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user?.id || !id) return;

      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('id', id)
          .eq('mentee_id', user.id)
          .single();

        if (error) throw error;
        setApplication(data);
        setEditData(data);
      } catch (error) {
        console.error('Error fetching application:', error);
        navigate('/tracker');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user?.id, id, navigate]);

  const handleSave = async () => {
    if (!application || !editData) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .update(editData)
        .eq('id', application.id);

      if (error) throw error;

      setApplication({ ...application, ...editData });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Application updated successfully",
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(application || {});
    setIsEditing(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading application...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to access this page.</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onSignOut={handleSignOut} />
        <main className="max-w-7xl mx-auto pt-20 py-8 px-4">
          <div className="text-center">
            <div className="text-lg">Application not found</div>
            <Button onClick={() => navigate('/tracker')} className="mt-4">
              Back to Tracker
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-6xl mx-auto pt-20 py-6 px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/tracker')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracker
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editData.job_title || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, job_title: e.target.value }))}
                    className="text-2xl font-bold p-3 h-auto"
                    placeholder="Job Title"
                  />
                  <Input
                    value={editData.company_name || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="text-lg p-2 h-auto"
                    placeholder="Company"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{application.job_title}</h1>
                  <p className="text-xl text-gray-600 mt-1">{application.company_name}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <JobApplicationStatusBadge status={isEditing ? (editData.application_status || '') : application.application_status} />
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600 min-w-[80px]">Date Applied:</span>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.date_applied || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, date_applied: e.target.value }))}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">
                        {format(new Date(application.date_applied), 'MMMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 min-w-[80px]">Status:</span>
                    {isEditing ? (
                      <Select
                        value={editData.application_status || ''}
                        onValueChange={(value) => setEditData(prev => ({ ...prev, application_status: value }))}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="to_be_considered">To Be Considered</SelectItem>
                          <SelectItem value="interviewing">Interviewing</SelectItem>
                          <SelectItem value="offer">Offer Received</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <JobApplicationStatusBadge status={application.application_status} />
                    )}
                  </div>
                  
                  {/* Interview Stage - Highlighted in Red */}
                  <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm font-medium text-red-700 min-w-[100px]">Interview Stage:</span>
                    {isEditing ? (
                      <Input
                        value={editData.interview_stage || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, interview_stage: e.target.value }))}
                        className="flex-1 border-red-300 focus:border-red-500"
                        placeholder="e.g., Phone Screen, Technical Interview"
                      />
                    ) : (
                      <span className="font-medium text-red-800">
                        {application.interview_stage || 'Not specified'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 min-w-[80px]">Job Link:</span>
                    {isEditing ? (
                      <Input
                        value={editData.job_link || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, job_link: e.target.value }))}
                        className="flex-1"
                        placeholder="Job posting URL"
                      />
                    ) : (
                      application.job_link ? (
                        <a 
                          href={application.job_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Job Posting
                        </a>
                      ) : (
                        <span className="text-gray-500">Not provided</span>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Notes */}
            <Card>
              <CardHeader>
                <CardTitle>My Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editData.mentee_notes || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, mentee_notes: e.target.value }))}
                    className="min-h-[120px] bg-green-50 border-green-200 focus:border-green-400"
                    placeholder="Add your notes about this application..."
                  />
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 min-h-[120px]">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {application.mentee_notes || 'No notes added yet.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coach Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Coach Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 min-h-[120px]">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {application.coach_notes || 'No coach feedback yet.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information - Recruiter Highlighted in Red */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">Recruiter:</span>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editData.recruiter_name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, recruiter_name: e.target.value }))}
                      className="border-red-300 focus:border-red-500"
                      placeholder="Recruiter name"
                    />
                  ) : (
                    <p className="font-medium ml-6 text-red-800">
                      {application.recruiter_name || 'Not specified'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm font-medium">Application Submitted</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(application.updated_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;
