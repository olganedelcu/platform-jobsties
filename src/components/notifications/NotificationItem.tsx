
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check, FileText, MessageCircle, Briefcase, CheckSquare, Calendar } from 'lucide-react';
import { InAppNotification } from '@/hooks/useInAppNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: InAppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'job_recommendation':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'file_upload':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-orange-500" />;
      case 'todo_assignment':
        return <CheckSquare className="h-4 w-4 text-purple-500" />;
      case 'session':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
