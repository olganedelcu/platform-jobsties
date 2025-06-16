
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  sending: boolean;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, sending, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t bg-white p-4 flex-shrink-0">
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Attachments:</p>
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <Paperclip className="h-4 w-4 text-blue-600" />
              <span className="text-sm flex-1 truncate text-blue-900">{file.name}</span>
              <span className="text-xs text-blue-600">{formatFileSize(file.size)}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={disabled || sending}
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileSelect}
            disabled={disabled || sending}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={disabled || sending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={disabled || sending || (!message.trim() && attachments.length === 0)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
