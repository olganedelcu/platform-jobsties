
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { EnhancedBundledNotificationService } from '@/services/enhancedBundledNotificationService';
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
    // Auto-configure the enhanced system
    const formspreeEndpoint = 'https://formspree.io/f/myzjjlvn';
    localStorage.setItem('formspree_endpoint', formspreeEndpoint);
    EnhancedBundledNotificationService.configure(formspreeEndpoint);
    console.log('✅ Enhanced Formspree notification system configured:', formspreeEndpoint);
    
    toast({
      title: "Enhanced Notifications Ready",
      description: "Your enhanced notification system is configured and ready! All mentees will now receive both in-app and email notifications."
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
    EnhancedBundledNotificationService.configure(endpoint);
    setIsConfigured(true);

    toast({
      title: "Success",
      description: "Enhanced notification system updated successfully"
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      console.log('🧪 Starting enhanced notification system test...');
      
      // Test comprehensive notification bundle
      EnhancedBundledNotificationService.addJobRecommendation(
        'test-mentee-enhanced',
        'olga@jobsties.com',
        'Test Mentee User',
        'Senior React Developer - Remote',
        'Tech Innovation Corp'
      );

      EnhancedBundledNotificationService.addMessage(
        'test-mentee-enhanced',
        'olga@jobsties.com', 
        'Test Mentee User',
        'Great progress on your job search! I found some excellent opportunities that match your skills. Let\'s schedule a call to discuss your strategy and next steps.'
      );

      EnhancedBundledNotificationService.addTodoAssignment(
        'test-mentee-enhanced',
        'olga@jobsties.com',
        'Test Mentee User',
        'Update LinkedIn profile with recent projects and skills',
        1
      );

      EnhancedBundledNotificationService.addFileUpload(
        'test-mentee-enhanced',
        'olga@jobsties.com',
        'Test Mentee User',
        'Resume_Template_Tech_2024.pdf'
      );

      // Send immediately for testing
      await EnhancedBundledNotificationService.flushAllNotifications();

      console.log('✅ Enhanced notification system test completed!');

      toast({
        title: "Enhanced Test Email Sent! 🚀",
        description: "A comprehensive test email with enhanced formatting and multiple notification types should arrive at olga@jobsties.com shortly. The new system includes both in-app and email notifications for all users!"
      });
    } catch (error) {
      console.error('❌ Enhanced test failed:', error);
      toast({
        title: "Test Failed",
        description: `Failed to send enhanced test notification: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your configuration.`,
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
      description: "Enhanced notification system configuration has been cleared"
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Enhanced Email Notification System 🚀
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ System Enhanced!</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Dual notifications: In-app + Email for all users</li>
            <li>• No user restrictions - works for everyone</li>
            <li>• Enhanced email templates with better formatting</li>
            <li>• Intelligent bundling (30min delay for better UX)</li>
            <li>• Dynamic subject lines based on content</li>
          </ul>
        </div>
        
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
