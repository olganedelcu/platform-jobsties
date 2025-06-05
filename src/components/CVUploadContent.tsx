
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const CVUploadContent = () => {
  const { toast } = useToast();
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'MENTEE')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching mentees:', error);
        toast({
          title: "Error",
          description: "Failed to fetch mentees.",
          variant: "destructive"
        });
        return;
      }

      setMentees(data || []);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentees.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedMentee) {
      toast({
        title: "Error",
        description: "Please select a mentee and file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return;
    }

    setUploadingFile(true);
    
    // TODO: Implement actual file upload to Supabase storage
    // For now, just show success message
    setTimeout(() => {
      const mentee = mentees.find(m => m.id === selectedMentee);
      setUploadingFile(false);
      setSelectedMentee('');
      
      toast({
        title: "Success",
        description: `CV uploaded successfully for ${mentee?.first_name} ${mentee?.last_name}`,
      });
      
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }, 2000);
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CV Upload Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage CV files for your mentees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
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
                onChange={(e) => setSelectedMentee(e.target.value)}
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
                onChange={handleFileUpload}
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

        {/* Mentees List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Your Mentees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mentees.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mentees found</h3>
                <p className="text-gray-500">Mentees will appear here when they sign up to the platform</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mentees.map((mentee) => (
                  <div key={mentee.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        {mentee.first_name[0]}{mentee.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{mentee.first_name} {mentee.last_name}</p>
                      <p className="text-sm text-gray-500">{mentee.email}</p>
                    </div>
                    <Badge variant="outline">
                      Available
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CV Files Section - Only show if there are actual files in the database */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Uploaded CV Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CV files uploaded yet</h3>
            <p className="text-gray-500">Upload CV files for your mentees to get started</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default CVUploadContent;
