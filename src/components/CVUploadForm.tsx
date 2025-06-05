
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CVUploadFormProps {
  mentees: Mentee[];
  selectedMentee: string;
  onMenteeSelect: (menteeId: string) => void;
  onFileUpload: (file: File) => void;
  uploadingFile: boolean;
}

const CVUploadForm = ({ 
  mentees, 
  selectedMentee, 
  onMenteeSelect, 
  onFileUpload, 
  uploadingFile 
}: CVUploadFormProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload New CV</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="mentee-select">Select Mentee</Label>
          <select
            id="mentee-select"
            value={selectedMentee}
            onChange={(e) => onMenteeSelect(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose a mentee...</option>
            {mentees.map((mentee) => (
              <option key={mentee.id} value={mentee.id}>
                {mentee.first_name} {mentee.last_name} ({mentee.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="cv-file">CV File (PDF only)</Label>
          <Input
            id="cv-file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={!selectedMentee || uploadingFile}
            className="mt-1"
          />
        </div>

        {uploadingFile && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <p className="text-sm text-gray-600 mt-2">Uploading CV...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVUploadForm;
