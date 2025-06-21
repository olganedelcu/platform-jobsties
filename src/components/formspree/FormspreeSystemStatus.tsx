
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, Mail } from 'lucide-react';
import { BundledNotificationService } from '@/services/bundledNotificationService';
import { useToast } from '@/hooks/use-toast';

const SESSystemStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [isFlushingAll, setIsFlushingAll] = useState(false);
  const { toast } = useToast();

  const refreshStatus = () => {
    const currentStatus = BundledNotificationService.getStatus();
    setStatus(currentStatus);
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFlushAll = async () => {
    setIsFlushingAll(true);
    try {
      console.log('🚀 Manual flush triggered from UI (Amazon SES)');
      await BundledNotificationService.flushAllNotifications();
      toast({
        title: "Notifications Sent",
        description: "All pending notifications have been sent via Amazon SES."
      });
      refreshStatus();
    } catch (error) {
      console.error('❌ Manual flush failed:', error);
      toast({
        title: "Send Failed",
        description: `Failed to send notifications via Amazon SES: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsFlushingAll(false);
    }
  };

  if (!status) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 animate-spin" />
            <span>Loading notification status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Amazon SES Notification System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span>Email Service:</span>
            <Badge variant="default">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Amazon SES
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Configuration:</span>
            <Badge variant={status.configured ? "default" : "destructive"}>
              {status.configured ? (
                <><CheckCircle2 className="h-3 w-3 mr-1" /> Configured</>
              ) : (
                <><AlertCircle className="h-3 w-3 mr-1" /> Not Configured</>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Pending Mentees:</span>
            <Badge variant={status.pendingMentees > 0 ? "secondary" : "outline"}>
              {status.pendingMentees}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Total Notifications:</span>
            <Badge variant={status.totalNotifications > 0 ? "secondary" : "outline"}>
              {status.totalNotifications}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Bundle Delay:</span>
            <Badge variant="outline">30 seconds</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>From Email:</span>
            <Badge variant="outline">service@jobsties.com</Badge>
          </div>
        </div>

        {status.pendingDetails && status.pendingDetails.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Pending Notifications:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {status.pendingDetails.map((detail: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <span>Mentee {detail.menteeId.slice(0, 8)}...</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {detail.notificationCount} notifications
                    </Badge>
                    {detail.hasTimer && (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Scheduled
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={refreshStatus} 
            variant="outline" 
            size="sm"
          >
            Refresh Status
          </Button>
          
          {status.totalNotifications > 0 && (
            <Button 
              onClick={handleFlushAll}
              disabled={isFlushingAll}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isFlushingAll ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send All Now (SES)
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Notifications are bundled and sent every 30 seconds via Amazon SES</p>
          <p>• Emails are sent from service@jobsties.com (verified domain)</p>
          <p>• Uses AWS SES SMTP for reliable email delivery</p>
          <p>• Check the console for detailed logging of notification delivery</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SESSystemStatus;
