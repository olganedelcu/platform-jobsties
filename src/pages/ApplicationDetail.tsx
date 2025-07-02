import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApplicationDetailHeader from '@/components/application/ApplicationDetailHeader';
import ApplicationDetailsCard from '@/components/application/ApplicationDetailsCard';
import ApplicationNotesSection from '@/components/application/ApplicationNotesSection';
import CoachFeedbackSection from '@/components/application/CoachFeedbackSection';
import ContactInformationCard from '@/components/application/ContactInformationCard';
import ApplicationTimelineCard from '@/components/application/ApplicationTimelineCard';
import InterviewStageCard from '@/components/application/InterviewStageCard';

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
    if (!application || !editData || !user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .update(editData)
        .eq('id', application.id)
        .eq('mentee_id', user.id);

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

  const handleEditDataChange = (updates: Partial<JobApplication>) => {
    setEditData(prev => ({ ...prev, ...updates }));
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
          
          <ApplicationDetailHeader
            application={application}
            isEditing={isEditing}
            editData={editData}
            saving={saving}
            onEditClick={() => setIsEditing(true)}
            onSaveClick={handleSave}
            onCancelClick={handleCancel}
            onEditDataChange={handleEditDataChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ApplicationDetailsCard
              application={application}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={handleEditDataChange}
            />

            <ApplicationNotesSection
              application={application}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={handleEditDataChange}
            />

            <CoachFeedbackSection application={application} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContactInformationCard
              application={application}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={handleEditDataChange}
            />

            <InterviewStageCard
              application={application}
              isEditing={isEditing}
              editData={editData}
              onEditDataChange={handleEditDataChange}
            />

            <ApplicationTimelineCard application={application} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;
