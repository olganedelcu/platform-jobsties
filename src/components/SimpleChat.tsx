
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SimpleChatProps {
  user: any;
}

const SimpleChat = ({ user }: SimpleChatProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send email notification to Ana
      const { error } = await supabase.functions.invoke('send-chat-notification', {
        body: {
          menteeEmail: user.email,
          menteeName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 'User',
          message: message.trim()
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message sent!",
        description: "Your message has been sent to Ana's email. She'll respond to you directly via email.",
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <Mail className="h-5 w-5 mr-2 text-indigo-600" />
        <CardTitle className="text-lg">Send Message to Ana</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex items-start space-x-3">
            <MessageCircle className="h-5 w-5 text-indigo-600 mt-1" />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">How it works:</h4>
              <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                <li>Type your message in the box below</li>
                <li>Ana will receive your message via email</li>
                <li>She'll respond to you directly via email</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[150px]"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !message.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto float-right"
          >
            {isLoading ? 
              "Sending..." : 
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleChat;
