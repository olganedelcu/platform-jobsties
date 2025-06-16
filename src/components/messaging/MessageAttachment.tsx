
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Paperclip } from 'lucide-react';
import { MessageAttachment as MessageAttachmentType } from '@/hooks/useMessages';

interface MessageAttachmentProps {
  attachment: MessageAttachmentType;
  isCurrentUser: boolean;
  onDownload: (attachment: MessageAttachmentType) => void;
}

const MessageAttachment = ({ attachment, isCurrentUser, onDownload }: MessageAttachmentProps) => {
  return (
    <div
      className={`flex items-center gap-1 p-1 rounded text-[10px] ${
        isCurrentUser ? 'bg-blue-700' : 'bg-gray-200'
      }`}
    >
      <Paperclip className="h-3 w-3 flex-shrink-0" />
      <span className="truncate flex-1 min-w-0">
        {attachment.file_name}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className={`h-4 w-4 p-0 flex-shrink-0 ${
          isCurrentUser 
            ? 'hover:bg-blue-800 text-blue-100' 
            : 'hover:bg-gray-300 text-gray-600'
        }`}
        onClick={() => onDownload(attachment)}
      >
        <Download className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
};

export default MessageAttachment;
