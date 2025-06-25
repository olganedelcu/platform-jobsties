
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Building2, Briefcase, User, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import { Loader2 } from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching application:', error);
        navigate('/tracker');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user?.id, id, navigate]);

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
        <main className="max-w-7xl mx-auto pt-28 py-8 px-6">
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
      
      <main className="max-w-5xl mx-auto pt-28 py-8 px-6">
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{application.job_title}</h1>
              <p className="text-xl text-gray-600 mt-1">{application.company_name}</p>
            </div>
            <JobApplicationStatusBadge status={application.application_status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Date Applied:</span>
                    <span className="font-medium">
                      {format(new Date(application.date_applied), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Company:</span>
                    <span className="font-medium">{application.company_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Position:</span>
                    <span className="font-medium">{application.job_title}</span>
                  </div>
                  
                  {application.interview_stage && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Interview Stage:</span>
                      <Badge variant="outline">{application.interview_stage}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Notes */}
            {application.mentee_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>My Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {application.mentee_notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coach Feedback */}
            {application.coach_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Coach Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {application.coach_notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            {application.recruiter_name && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Recruiter:</span>
                    </div>
                    <p className="font-medium ml-6">{application.recruiter_name}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Application Submitted</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
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
