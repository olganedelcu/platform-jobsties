
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachMessages = () => {
  const navigate = useNavigate();

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Coach Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-6">
          <div className="text-sm text-gray-500 mb-3">No new messages</div>
          <Button
            size="sm"
            onClick={() => navigate('/messages')}
            className="flex items-center space-x-2"
          >
            <span>View Messages</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachMessages;
