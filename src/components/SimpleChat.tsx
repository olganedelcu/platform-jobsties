
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const SimpleChat = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
        <CardTitle className="text-lg text-gray-500">Chat Feature Removed</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chat functionality has been removed</h3>
        <p className="text-gray-500">This feature is no longer available.</p>
      </CardContent>
    </Card>
  );
};

export default SimpleChat;
