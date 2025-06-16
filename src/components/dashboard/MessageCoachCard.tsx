
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail } from 'lucide-react';

const MessageCoachCard = () => {
  const navigate = useNavigate();

  const handleMessageCoach = () => {
    navigate('/messages');
  };

  return (
    <Card className="border border-indigo-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-indigo-900">Get in Touch with Ana</h3>
          <MessageCircle className="h-6 w-6 text-indigo-600" />
        </div>
        
        <div className="space-y-4">
          <p className="text-indigo-700 text-sm">
            Need guidance or have questions about your career journey? Ana is here to help you succeed.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-indigo-900">Ana Nedelcu</p>
              <p className="text-sm text-indigo-600">Your Career Coach</p>
            </div>
          </div>
          
          <Button 
            onClick={handleMessageCoach}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCoachCard;
