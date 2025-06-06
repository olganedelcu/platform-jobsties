
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface CVFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  coach_name?: string;
}

interface MenteeCVFilesProps {
  userId: string;
}

const MenteeCVFiles = ({ userId }: MenteeCVFilesProps) => {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCVFiles();
  }, [userId]);

  const fetchCVFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cv_files')
        .select(`
          *,
          profiles:coach_id (
            first_name,
            last_name
          )
        `)
        .eq('mentee_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching CV files:', error);
        toast({
          title: "Error",
          description: "Failed to load CV files. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const formattedFiles = data?.map((file: any) => ({
        ...file,
        coach_name: file.profiles ? `${file.profiles.first_name} ${file.profiles.last_name}` : 'Unknown Coach'
      })) || [];

      setCvFiles(formattedFiles);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <p className="text-sm text-gray-600 mt-2">Loading CV files...</p>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your CV Files</CardTitle>
      </CardHeader>
      <CardContent>
        {cvFiles.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No CV files available yet. Your coach will upload them here.</p>
        ) : (
          <div className="space-y-4">
            {cvFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{file.file_name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-gray-500">
                      <span>Uploaded by: {file.coach_name}</span>
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>
                        {format(new Date(file.uploaded_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file.file_url, file.file_name)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteeCVFiles;
