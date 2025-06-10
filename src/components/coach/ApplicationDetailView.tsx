
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Calendar, User, Briefcase, Phone, FileText, Save, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface ApplicationDetailViewProps {
  application: JobApplication;
  onBack: () => void;
  onUpdate?: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
}

const ApplicationDetailView = ({ application, onBack, onUpdate }: ApplicationDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editData, setEditData] = useState<Partial<JobApplication>>({});
  const { toast } = useToast();

  // Storage key for persisting unsaved changes
  const storageKey = `unsaved_changes_${application.id}`;

  // Load any previously unsaved changes from sessionStorage
  useEffect(() => {
    const savedChanges = sessionStorage.getItem(storageKey);
    if (savedChanges) {
      try {
        const parsedChanges = JSON.parse(savedChanges);
        setEditData(parsedChanges);
        setHasUnsavedChanges(true);
        setIsEditing(true);
        toast({
          title: "Unsaved Changes Restored",
          description: "Your previous changes have been restored. Don't forget to save them!",
        });
      } catch (error) {
        console.error('Error parsing saved changes:', error);
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [application.id, storageKey, toast]);

  // Save changes to sessionStorage whenever editData changes
  useEffect(() => {
    if (hasUnsavedChanges && Object.keys(editData).length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(editData));
    }
  }, [editData, hasUnsavedChanges, storageKey]);

  // Clean up sessionStorage when component unmounts without unsaved changes
  useEffect(() => {
    return () => {
      if (!hasUnsavedChanges) {
        sessionStorage.removeItem(storageKey);
      }
    };
  }, [hasUnsavedChanges, storageKey]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditData({
      application_status: application.application_status,
      interview_stage: application.interview_stage,
      recruiter_name: application.recruiter_name,
      coach_notes: application.coach_notes
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setHasUnsavedChanges(false);
    sessionStorage.removeItem(storageKey);
  };

  const handleSave = async () => {
    if (!onUpdate) {
      toast({
        title: "Error",
        description: "Update functionality not available",
        variant: "destructive",
      });
      return;
    }

    try {
      await onUpdate(application.id, editData);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setEditData({});
      sessionStorage.removeItem(storageKey);
      toast({
        title: "Application Updated",
        description: "The application has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving application:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = (field: keyof JobApplication, value: string | null) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get current values (either from editData or original application)
  const currentStatus = editData.application_status || application.application_status;
  const currentInterviewStage = editData.interview_stage !== undefined ? editData.interview_stage : application.interview_stage;
  const currentRecruiterName = editData.recruiter_name !== undefined ? editData.recruiter_name : application.recruiter_name;
  const currentCoachNotes = editData.coach_notes !== undefined ? editData.coach_notes : application.coach_notes;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Button>

        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600 font-medium">
              Unsaved changes
            </span>
          )}
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center space-x-1"
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </>
          ) : (
            onUpdate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                className="flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <User className="h-6 w-6 text-indigo-600" />
                <span>
                  {application.profiles?.first_name} {application.profiles?.last_name}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{application.company_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{application.job_title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Applied: {format(new Date(application.date_applied), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Company</label>
              <p className="text-gray-900">{application.company_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Position</label>
              <p className="text-gray-900">{application.job_title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date Applied</label>
              <p className="text-gray-900">{format(new Date(application.date_applied), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              {isEditing ? (
                <Select
                  value={currentStatus}
                  onValueChange={(value) => handleFieldChange('application_status', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offer">Offer Received</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(currentStatus)}>
                  {currentStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Interview Stage</label>
              {isEditing ? (
                <Input
                  value={currentInterviewStage || ''}
                  onChange={(e) => handleFieldChange('interview_stage', e.target.value || null)}
                  placeholder="e.g., First round, Technical interview, Final round"
                />
              ) : (
                <p className="text-gray-900">{currentInterviewStage || '-'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Recruiter</span>
              </label>
              {isEditing ? (
                <Input
                  value={currentRecruiterName || ''}
                  onChange={(e) => handleFieldChange('recruiter_name', e.target.value || null)}
                  placeholder="Recruiter name"
                />
              ) : (
                <p className="text-gray-900">{currentRecruiterName || '-'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Coach Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={currentCoachNotes || ''}
                onChange={(e) => handleFieldChange('coach_notes', e.target.value || null)}
                placeholder="Add notes about this application..."
                rows={8}
                className="w-full"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md min-h-[200px]">
                {currentCoachNotes ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{currentCoachNotes}</p>
                ) : (
                  <p className="text-gray-500 italic">No notes added yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Application Submitted</p>
                <p className="text-sm text-gray-600">{format(new Date(application.date_applied), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
            {currentStatus !== 'applied' && (
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Status Updated</p>
                  <p className="text-sm text-gray-600">
                    Changed to {currentStatus.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetailView;
