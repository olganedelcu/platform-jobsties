
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

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
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Uploaded CV Files</span>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CV files uploaded yet</h3>
            <p className="text-gray-500">Upload CV files for your mentees to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cvFiles.map((cvFile) => (
              <div key={cvFile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {cvFile.file_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mentee: {cvFile.mentee_name}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVFilesList;
