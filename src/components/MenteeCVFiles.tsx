
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
      // Fetch CV files where mentee_id matches the current user
      const { data, error } = await supabase
        .from('cv_files')
        .select('*')
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

      // After getting CV files, fetch coach information for each file
      const filesWithCoachInfo = await Promise.all(
        (data || []).map(async (file) => {
          // Get coach information from profiles table
          const { data: coachData, error: coachError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', file.coach_id)
            .single();

          if (coachError && coachError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching coach profile:', coachError);
          }

          return {
            ...file,
            coach_name: coachData 
              ? `${coachData.first_name} ${coachData.last_name}` 
              : 'Unknown Coach'
          };
        })
      );

      setCvFiles(filesWithCoachInfo);
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
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Your CV Files</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cvFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CV files available yet</h3>
            <p className="text-gray-500">Your coach will upload them here once they're ready</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cvFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.file_name}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 gap-1 sm:gap-3">
                      <span className="flex items-center">Uploaded by: {file.coach_name}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatFileSize(file.file_size)}</span>
                      <span className="hidden sm:inline">•</span>
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
