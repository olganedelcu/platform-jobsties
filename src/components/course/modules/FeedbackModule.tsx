
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormspreeNotificationHandlers } from '@/utils/formspreeNotificationUtils';

interface FeedbackModuleProps {
  userId: string;
}

const FeedbackModule = ({ userId }: FeedbackModuleProps) => {
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
        await FormspreeNotificationHandlers.courseFeedback({
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
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

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
};

export default FeedbackModule;
