
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import MenteeCVFiles from '@/components/MenteeCVFiles';
import { uploadCVFile } from '@/utils/cvFileOperations';
import { useMentees } from '@/hooks/useMentees';
import { useToast } from '@/hooks/use-toast';

interface CVOptimizationModuleProps {
  userId: string;
  moduleAction?: string | null;
}

const CVOptimizationModule = ({ userId, moduleAction }: CVOptimizationModuleProps) => {
  const [uploadingFile, setUploadingFile] = useState(false);
  const { mentees } = useMentees();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploadingFile(true);
    
    try {
      await uploadCVFile(
        file,
        userId,
        mentees,
        () => {
          // File uploaded successfully
          console.log('CV file uploaded successfully');
        },
        toast
      );
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        Your coach can upload CV files for you to review and download. You can also upload your own CV files here for feedback.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Your CV</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cv-file-upload">CV File (PDF, DOC, DOCX, TXT)</Label>
            <Input
              id="cv-file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              disabled={uploadingFile}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </div>

          {uploadingFile && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-sm text-gray-600 mt-2">Uploading CV...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <MenteeCVFiles userId={userId} />
      
      {moduleAction && (
        <Button 
          className="mt-4 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {moduleAction}
        </Button>
      )}
    </div>
  );
};

export default CVOptimizationModule;
