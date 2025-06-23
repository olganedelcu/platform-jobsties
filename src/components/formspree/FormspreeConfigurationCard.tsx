
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { EnhancedBundledNotificationService } from '@/services/enhancedBundledNotificationService';
import { useToast } from '@/hooks/use-toast';
import { fetchRealMenteeData, createRealTestNotifications } from '@/utils/testNotificationUtils';
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
      console.log('🧪 Starting enhanced notification system test with real mentee data...');
      
      // Fetch real mentee data
      const realMenteeData = await fetchRealMenteeData('olganedelcuam@gmail.com');
      
      if (!realMenteeData) {
        toast({
          title: "Test Failed",
          description: "Could not find mentee with email 'olganedelcuam@gmail.com'. Please make sure this mentee exists in the system.",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Using real mentee data for test:', realMenteeData);

      // Create personalized test notifications
      const testData = createRealTestNotifications(realMenteeData);

      // Add real job recommendation
      EnhancedBundledNotificationService.addJobRecommendation(
        realMenteeData.id,
        realMenteeData.email,
        realMenteeData.name,
        testData.jobRecommendation.jobTitle,
        testData.jobRecommendation.companyName
      );

      // Add personalized message
      EnhancedBundledNotificationService.addMessage(
        realMenteeData.id,
        realMenteeData.email, 
        realMenteeData.name,
        testData.message
      );

      // Add personalized task
      EnhancedBundledNotificationService.addTodoAssignment(
        realMenteeData.id,
        realMenteeData.email,
        realMenteeData.name,
        testData.todoTitle,
        1
      );

      // Add personalized file upload
      EnhancedBundledNotificationService.addFileUpload(
        realMenteeData.id,
        realMenteeData.email,
        realMenteeData.name,
        testData.fileName
      );

      // Send immediately for testing
      await EnhancedBundledNotificationService.flushAllNotifications();

      console.log('✅ Enhanced notification system test with real data completed!');

      toast({
        title: "Real Data Test Email Sent! 🚀",
        description: `Comprehensive test email sent to ${realMenteeData.name} (${realMenteeData.email}) with personalized content and real mentee data!`
      });
    } catch (error) {
      console.error('❌ Enhanced test with real data failed:', error);
      toast({
        title: "Test Failed",
        description: `Failed to send enhanced test notification with real data: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your configuration.`,
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
            <li>• <strong>Real mentee data testing available</strong></li>
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
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">📧 Real Data Test Details:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Test email will be sent to: <strong>olganedelcuam@gmail.com</strong></li>
            <li>• Uses real mentee data from the database</li>
            <li>• Includes personalized job recommendation, message, task, and file upload</li>
            <li>• Demonstrates the enhanced bundled notification format with real names</li>
            <li>• Should arrive within a few minutes if the mentee exists in the system</li>
          </ul>
        </div>
        
        <FormspreeHowItWorks />
      </CardContent>
    </Card>
  );
};

export default FormspreeConfigurationCard;
