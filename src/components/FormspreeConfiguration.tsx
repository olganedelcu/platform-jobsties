
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
  const [endpoint, setEndpoint] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved endpoint
    const savedEndpoint = localStorage.getItem('formspree_endpoint');
    if (savedEndpoint) {
      setEndpoint(savedEndpoint);
      setIsConfigured(true);
      BundledNotificationService.configure(savedEndpoint);
    }
  }, []);

  const handleSave = () => {
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
      description: "Formspree configuration saved successfully"
    });
  };

  const handleTest = async () => {
    if (!endpoint.trim()) {
      toast({
        title: "Error",
        description: "Please save the configuration first",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Add a test notification to trigger the bundling system
      BundledNotificationService.addJobRecommendation(
        'test-mentee-id',
        'test@example.com',
        'Test Mentee',
        'Software Developer',
        'Test Company'
      );

      // Force flush to send immediately for testing
      await BundledNotificationService.flushAllNotifications();

      toast({
        title: "Test Sent",
        description: "Test notification has been sent via Formspree"
      });
    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "Test Failed",
        description: "Failed to send test notification. Please check your endpoint.",
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
          <AlertDescription>
            Configure Formspree.io to send bundled email notifications to mentees. 
            Notifications will be automatically grouped and sent every 5 minutes when there are pending items.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="formspree-endpoint">Formspree Form Endpoint</Label>
            <Input
              id="formspree-endpoint"
              type="url"
              placeholder="https://formspree.io/f/YOUR_FORM_ID"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Get your endpoint from your Formspree dashboard after creating a form
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            
            {isConfigured && (
              <Button 
                onClick={handleTest} 
                variant="outline"
                disabled={isTesting}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {isTesting ? 'Testing...' : 'Send Test'}
              </Button>
            )}

            {isConfigured && (
              <Button onClick={handleReset} variant="destructive">
                Reset
              </Button>
            )}
          </div>

          {isConfigured && (
            <Alert>
              <AlertDescription className="text-green-700">
                ✅ Formspree is configured and ready to send bundled notifications!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Notifications are collected and bundled together for each mentee</li>
            <li>• Emails are automatically sent every 5 minutes if there are pending notifications</li>
            <li>• Multiple notification types are grouped together in a single email</li>
            <li>• Includes job recommendations, file uploads, messages, and task assignments</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Setup Instructions:</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Go to <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">formspree.io</a> and create an account</li>
            <li>2. Create a new form in your Formspree dashboard</li>
            <li>3. Copy the form endpoint (looks like: https://formspree.io/f/YOUR_FORM_ID)</li>
            <li>4. Paste it above and click "Save Configuration"</li>
            <li>5. Use "Send Test" to verify everything works</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormspreeConfiguration;
