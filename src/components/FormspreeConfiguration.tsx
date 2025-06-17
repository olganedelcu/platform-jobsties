
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, TestTube, ExternalLink } from 'lucide-react';
import { BundledNotificationService } from '@/services/bundledNotificationService';
import { useToast } from '@/hooks/use-toast';

const FormspreeConfiguration = () => {
  const [endpoint, setEndpoint] = useState('https://formspree.io/f/myzjjlvn');
  const [isConfigured, setIsConfigured] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Save the provided endpoint immediately
    const formspreeEndpoint = 'https://formspree.io/f/myzjjlvn';
    localStorage.setItem('formspree_endpoint', formspreeEndpoint);
    BundledNotificationService.configure(formspreeEndpoint);
    console.log('✅ Formspree endpoint configured automatically:', formspreeEndpoint);
    
    // Show success message
    toast({
      title: "Formspree Configured",
      description: "Your Formspree endpoint has been automatically configured and is ready to send notifications!"
    });
  }, [toast]);

  const handleUpdate = () => {
    if (!endpoint.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Formspree endpoint",
        variant: "destructive"
      });
      return;
    }

    if (!endpoint.includes('formspree.io')) {
      toast({
        title: "Warning",
        description: "Please make sure you're using a valid Formspree.io endpoint",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('formspree_endpoint', endpoint);
    BundledNotificationService.configure(endpoint);
    setIsConfigured(true);

    toast({
      title: "Success",
      description: "Formspree configuration updated successfully"
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      console.log('🧪 Starting Formspree test notification...');
      
      // Add a comprehensive test notification
      BundledNotificationService.addJobRecommendation(
        'test-mentee-123',
        'test@example.com',
        'Test Mentee User',
        'Senior Software Developer - Test Position',
        'Test Company Technologies Inc.'
      );

      // Add additional test notifications to show bundling
      BundledNotificationService.addMessage(
        'test-mentee-123',
        'test@example.com', 
        'Test Mentee User',
        'This is a test message from your JobsTies mentor to verify the notification system is working correctly.'
      );

      BundledNotificationService.addTodoAssignment(
        'test-mentee-123',
        'test@example.com',
        'Test Mentee User',
        'Complete your LinkedIn profile optimization',
        1
      );

      // Force flush to send immediately for testing
      await BundledNotificationService.flushAllNotifications();

      console.log('✅ Test notification sent successfully!');

      toast({
        title: "Test Email Sent!",
        description: "A bundled test email with job recommendation, message, and task assignment should arrive at test@example.com shortly via your Formspree form. Check your email!"
      });
    } catch (error) {
      console.error('❌ Test failed:', error);
      toast({
        title: "Test Failed",
        description: `Failed to send test notification: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your endpoint and try again.`,
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('formspree_endpoint');
    setEndpoint('');
    setIsConfigured(false);
    
    toast({
      title: "Configuration Reset",
      description: "Formspree configuration has been cleared"
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Formspree Email Notifications Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-green-700">
            ✅ <strong>Configuration Complete!</strong> Your Formspree endpoint has been automatically configured and is ready to send bundled email notifications to mentees.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="formspree-endpoint">Formspree Form Endpoint</Label>
            <Input
              id="formspree-endpoint"
              type="url"
              placeholder="https://formspree.io/f/myzjjlvn"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your endpoint is configured and active
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleUpdate} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Update Configuration
            </Button>
            
            <Button 
              onClick={handleTest} 
              variant="outline"
              disabled={isTesting}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isTesting ? 'Sending Test...' : 'Send Test Email'}
            </Button>

            <Button onClick={handleReset} variant="destructive">
              Reset
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">✅ System Status:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Formspree endpoint configured: https://formspree.io/f/myzjjlvn</li>
            <li>• Notification bundling active (sends every 2 hours)</li>
            <li>• Ready to send job recommendations, file uploads, messages, and task assignments</li>
            <li>• Test function available to verify email delivery</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">📧 Test Email Details:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Test email will be sent to: test@example.com</li>
            <li>• Will include sample job recommendation, message, and task assignment</li>
            <li>• Demonstrates the bundled notification format</li>
            <li>• Should arrive within a few minutes if Formspree is working correctly</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Notifications are collected and bundled together for each mentee</li>
            <li>• Emails are automatically sent every 2 hours if there are pending notifications</li>
            <li>• Multiple notification types are grouped together in a single email</li>
            <li>• Includes job recommendations, file uploads, messages, and task assignments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormspreeConfiguration;
