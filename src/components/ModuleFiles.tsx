
import React from 'react';
import { useModuleFiles } from '@/hooks/useModuleFiles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ModuleFilesProps {
  userId: string;
  moduleType: 'linkedin' | 'job_search_strategy' | 'interview_preparation';
  title: string;
}

const ModuleFiles = ({ userId, moduleType, title }: ModuleFilesProps) => {
  const { files, loading, downloadFile } = useModuleFiles({ userId, moduleType });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title} Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading files...</div>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title} Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No files uploaded yet</p>
            <p className="text-sm">Your coach will upload relevant files for this module</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title} Files ({files.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.file_name}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                    </span>
                    {file.file_size && (
                      <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => downloadFile(file)}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleFiles;
