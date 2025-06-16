
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, FileText, User } from 'lucide-react';

const DashboardQuickLinks = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: 'Schedule Session',
      icon: Calendar,
      onClick: () => navigate('/sessions'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      onClick: () => navigate('/messages'),
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Job Tracker',
      icon: FileText,
      onClick: () => navigate('/tracker'),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Profile',
      icon: User,
      onClick: () => navigate('/profile'),
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              onClick={link.onClick}
              className="flex flex-col items-center p-4 h-auto hover:bg-gray-50"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${link.color}`}>
                <link.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{link.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickLinks;
