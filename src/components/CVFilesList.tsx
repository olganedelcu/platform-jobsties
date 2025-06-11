
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, FileType } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CVFile {
  id: string;
  mentee_id: string;
  coach_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  mentee_name?: string;
}

interface CVFilesListProps {
  cvFiles: CVFile[];
  onDeleteCV: (cvId: string, filePath: string) => void;
}

const CVFilesList = ({ cvFiles, onDeleteCV }: CVFilesListProps) => {
  const { toast } = useToast();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return { type: 'PDF', color: 'bg-red-100 text-red-800', icon: 'text-red-500' };
      case 'doc':
      case 'docx':
        return { type: 'DOC', color: 'bg-blue-100 text-blue-800', icon: 'text-blue-500' };
      case 'txt':
        return { type: 'TXT', color: 'bg-gray-100 text-gray-800', icon: 'text-gray-500' };
      default:
        return { type: 'FILE', color: 'bg-gray-100 text-gray-800', icon: 'text-gray-500' };
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      console.log('Downloading file from path:', filePath);
      
      // Get the file from Supabase storage
      const { data, error } = await supabase.storage
        .from('cv-files')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        toast({
          title: "Error",
          description: "Failed to download file. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('File downloaded successfully, creating blob URL');

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Group files by mentee
  const filesByMentee: Record<string, {name: string, files: CVFile[]}> = {};
  cvFiles.forEach(file => {
    const menteeId = file.mentee_id;
    const menteeName = file.mentee_name || 'Unknown';
    
    if (!filesByMentee[menteeId]) {
      filesByMentee[menteeId] = {
        name: menteeName,
        files: []
      };
    }
    filesByMentee[menteeId].files.push(file);
  });

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileType className="h-5 w-5" />
          <span>Uploaded Documents</span>
          {cvFiles.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {cvFiles.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cvFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
            <p className="text-gray-500">Upload documents for your mentees to get started</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filesByMentee).map(([menteeId, menteeData]) => (
              <div key={menteeId} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 bg-indigo-100">
                      <AvatarFallback className="text-indigo-700">
                        {menteeData.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{menteeData.name}</h3>
                      <p className="text-sm text-gray-500">{menteeData.files.length} document(s)</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {menteeData.files.map((cvFile) => {
                    const fileType = getFileType(cvFile.file_name);
                    return (
                      <div key={cvFile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <FileText className={`h-8 w-8 ${fileType.icon}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {cvFile.file_name}
                              </p>
                              <Badge className={fileType.color}>
                                {fileType.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span>{formatFileSize(cvFile.file_size)}</span>
                              <span>Uploaded {format(new Date(cvFile.uploaded_at), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(cvFile.file_url, cvFile.file_name)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteCV(cvFile.id, cvFile.file_url)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVFilesList;
