
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useMenteeCVFiles } from '@/hooks/useMenteeCVFiles';
import CVFileItem from '@/components/CVFileItem';
import CVFilesEmptyState from '@/components/CVFilesEmptyState';
import CVFilesLoadingState from '@/components/CVFilesLoadingState';

interface MenteeCVFilesProps {
  userId: string;
}

const MenteeCVFiles = ({ userId }: MenteeCVFilesProps) => {
  const { cvFiles, loading, handleDownload } = useMenteeCVFiles(userId);

  if (loading) {
    return <CVFilesLoadingState />;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Your CV Files</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cvFiles.length === 0 ? (
          <CVFilesEmptyState />
        ) : (
          <div className="space-y-4">
            {cvFiles.map((file) => (
              <CVFileItem
                key={file.id}
                file={file}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteeCVFiles;
