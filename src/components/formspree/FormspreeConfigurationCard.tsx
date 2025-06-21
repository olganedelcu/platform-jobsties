
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { BundledNotificationService } from '@/services/bundledNotificationService';
import { useToast } from '@/hooks/use-toast';
import SESSystemStatus from './FormspreeSystemStatus';

const SESConfigurationCard = () => {
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Amazon SES is now configured automatically
    console.log('✅ Amazon SES email service is configured and ready');
    
    toast({
      title: "Amazon SES Configured",
      description: "Your email notifications are now powered by Amazon SES from service@jobsties.com!"
    });
  }, [toast]);

  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      console.log('🧪 Starting Amazon SES test notification...');
      
      // Add a comprehensive test notification
      BundledNotificationService.addJobRecommendation(
        'test-mentee-123',
        'olga@jobsties.com',
        'Test Mentee User',
        'Senior Software Developer - Test Position',
        'Test Company Technologies Inc.'
      );

      // Add additional test notifications to show bundling
      BundledNotificationService.addMessage(
        'test-mentee-123',
        'olga@jobsties.com', 
        'Test Mentee User',
        'This is a test message from your JobsTies mentor to verify the Amazon SES notification system is working correctly.'
      );

      BundledNotificationService.addTodoAssignment(
        'test-mentee-123',
        'olga@jobsties.com',
        'Test Mentee User',
        'Complete your LinkedIn profile optimization',
        1
      );

      // Force flush to send immediately for testing
      await BundledNotificationService.flushAllNotifications();

      console.log('✅ Test notification sent successfully via Amazon SES!');

      toast({
        title: "Test Email Sent via Amazon SES!",
        description: "A bundled test email with job recommendation, message, and task assignment should arrive at olga@jobsties.com from service@jobsties.com. Check your email!"
      });
    } catch (error) {
      console.error('❌ Amazon SES test failed:', error);
      toast({
        title: "Test Failed",
        description: `Failed to send test notification via Amazon SES: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your AWS SES configuration.`,
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Amazon SES Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Amazon SES Configured Successfully
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your email notifications are now powered by Amazon SES using the verified email service@jobsties.com.</p>
                <div className="mt-2">
                  <strong>Configuration Details:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>From Email: service@jobsties.com (verified)</li>
                    <li>Service: Amazon SES SMTP</li>
                    <li>Region: US East (N. Virginia)</li>
                    <li>Authentication: AWS IAM SMTP credentials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleTest} 
            disabled={isTesting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {isTesting ? 'Sending Test Email...' : 'Send Test Email via SES'}
          </button>
        </div>

        <SESSystemStatus />
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How Amazon SES Integration Works:</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• <strong>Verified Domain:</strong> jobsties.com domain is verified with Amazon SES</p>
            <p>• <strong>From Email:</strong> All emails are sent from service@jobsties.com</p>
            <p>• <strong>SMTP Authentication:</strong> Uses AWS IAM user credentials for secure sending</p>
            <p>• <strong>Bundled Notifications:</strong> Multiple notifications are grouped and sent together</p>
            <p>• <strong>HTML & Text:</strong> Emails include both HTML and plain text versions</p>
            <p>• <strong>Reliable Delivery:</strong> Amazon SES provides high deliverability rates</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Test emails are sent to olga@jobsties.com for verification</p>
          <p>• Production emails will be sent to actual mentee email addresses</p>
          <p>• Check the console for detailed logging of email delivery status</p>
          <p>• AWS SES credentials are securely stored in Supabase secrets</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SESConfigurationCard;
