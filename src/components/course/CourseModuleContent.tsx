
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, CheckCircle, RotateCcw, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailNotificationService } from '@/services/emailNotificationService';
import MenteeCVFiles from '@/components/MenteeCVFiles';
import ModuleFiles from '@/components/ModuleFiles';

interface CourseModuleContentProps {
  moduleIndex: number;
  userId: string;
  moduleAction?: string | null;
  onBookCall?: () => void;
  onComplete?: () => void;
  onUncomplete?: () => void;
  isCompleted?: boolean;
}

const CourseModuleContent = ({ 
  moduleIndex, 
  userId, 
  moduleAction, 
  onBookCall, 
  onComplete, 
  onUncomplete, 
  isCompleted 
}: CourseModuleContentProps) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please write your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);
    
    try {
      // Get user profile for email
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single();

      if (userProfile?.email) {
        await EmailNotificationService.sendCourseFeedback({
          menteeEmail: userProfile.email,
          menteeName: `${userProfile.first_name} ${userProfile.last_name}`.trim(),
          feedback: feedback.trim(),
        });

        toast({
          title: "Feedback Sent",
          description: "Thank you! Your feedback has been sent successfully.",
        });
        
        setFeedback('');
      } else {
        throw new Error('Unable to find user profile');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  switch (moduleIndex) {
    case 0:
      return (
        <div className="space-y-4">
          <p className="text-gray-700">
            Your coach can upload CV files for you to review and download. These files will be available here once uploaded.
          </p>
          <MenteeCVFiles userId={userId} />
          {moduleAction && (
            <Button 
              className="mt-4 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {moduleAction}
            </Button>
          )}
        </div>
      );
    case 1:
      return (
        <div className="space-y-6">
          <p className="text-gray-700">
            This module will help you optimize your LinkedIn profile and create compelling cover letters. 
            Your coach may upload resources and templates to help you succeed.
          </p>
          <ModuleFiles 
            userId={userId} 
            moduleType="linkedin" 
            title="LinkedIn & Cover Letter" 
          />
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <p className="text-gray-700">
            Learn effective job search strategies, including where to find opportunities, how to network, 
            and how to tailor your applications for maximum impact.
          </p>
          <ModuleFiles 
            userId={userId} 
            moduleType="job_search_strategy" 
            title="Job Search Strategy" 
          />
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <p className="text-gray-700">
            Prepare for interviews with comprehensive guidance on common questions, body language, 
            and how to showcase your skills effectively.
          </p>
          <ModuleFiles 
            userId={userId} 
            moduleType="interview_preparation" 
            title="Interview Preparation" 
          />
          <div className="flex flex-wrap gap-3">
            {moduleAction === 'Book Call' && onBookCall && (
              <Button 
                onClick={onBookCall}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Interview Preparation Call</span>
              </Button>
            )}
            {!isCompleted ? (
              <Button 
                onClick={onComplete}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Complete</span>
              </Button>
            ) : (
              <Button 
                onClick={onUncomplete}
                variant="outline"
                className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Uncomplete</span>
              </Button>
            )}
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-6">
          <p className="text-gray-700">
            Review your progress throughout the course and plan your next steps for continued career development.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Share Your Feedback</h3>
            <p className="text-blue-800 mb-4">
              We'd love to hear about your experience with the career development course. 
              Your feedback helps us improve and better support future mentees.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback" className="text-blue-900">
                  Your Feedback
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts about the course, what you found most valuable, areas for improvement, or any suggestions..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  rows={6}
                />
              </div>
              
              <Button
                onClick={handleFeedbackSubmit}
                disabled={isSubmittingFeedback || !feedback.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {isSubmittingFeedback ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default CourseModuleContent;
