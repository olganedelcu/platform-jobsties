
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { useModuleFileUpload } from '@/hooks/useModuleFileUpload';
import { useMentees } from '@/hooks/useMentees';

const ModuleFileUpload = () => {
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { mentees } = useMentees();
  const { uploading, uploadModuleFile } = useModuleFileUpload();

  const moduleOptions = [
    { value: 'cv_optimization', label: 'CV Optimization' },
    { value: 'linkedin', label: 'LinkedIn & Cover Letter' },
    { value: 'job_search_strategy', label: 'Job Search Strategy' },
    { value: 'interview_preparation', label: 'Interview Preparation' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value as 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation');
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedMentee || !selectedModule) {
      return;
    }

    const success = await uploadModuleFile(selectedFile, selectedMentee, selectedModule);
    
    if (success) {
      // Reset form
      setSelectedFile(null);
      setSelectedMentee('');
      setSelectedModule('');
      // Reset file input
      const fileInput = document.getElementById('module-file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Module Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mentee-select">Select Mentee</Label>
            <Select value={selectedMentee} onValueChange={setSelectedMentee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a mentee" />
              </SelectTrigger>
              <SelectContent>
                {mentees.map((mentee) => (
                  <SelectItem key={mentee.id} value={mentee.id}>
                    {mentee.first_name} {mentee.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="module-select">Select Module</Label>
            <Select value={selectedModule} onValueChange={handleModuleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a module" />
              </SelectTrigger>
              <SelectContent>
                {moduleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="module-file-upload">Document File (PDF, DOC, DOCX, TXT)</Label>
          <input
            id="module-file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </div>

        {selectedFile && (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedMentee || !selectedModule || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Module File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleFileUpload;
