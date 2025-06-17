
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { BundledNotificationService } from '@/services/bundledNotificationService';
import { useToast } from '@/hooks/use-toast';
import FormspreeStatusAlert from './FormspreeStatusAlert';
import FormspreeEndpointForm from './FormspreeEndpointForm';
import FormspreeActions from './FormspreeActions';
import FormspreeSystemStatus from './FormspreeSystemStatus';
import FormspreeTestDetails from './FormspreeTestDetails';
import FormspreeHowItWorks from './FormspreeHowItWorks';

const FormspreeConfigurationCard = () => {
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
        'This is a test message from your JobsTies mentor to verify the notification system is working correctly.'
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

      console.log('✅ Test notification sent successfully!');

      toast({
        title: "Test Email Sent!",
        description: "A bundled test email with job recommendation, message, and task assignment should arrive at olga@jobsties.com shortly via your Formspree form. Check your email!"
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
        <FormspreeStatusAlert />
        
        <div className="space-y-4">
          <FormspreeEndpointForm 
            endpoint={endpoint} 
            onEndpointChange={setEndpoint} 
          />
          
          <FormspreeActions 
            onUpdate={handleUpdate}
            onTest={handleTest}
            onReset={handleReset}
            isTesting={isTesting}
          />
        </div>

        <FormspreeSystemStatus />
        <FormspreeTestDetails />
        <FormspreeHowItWorks />
      </CardContent>
    </Card>
  );
};

export default FormspreeConfigurationCard;
