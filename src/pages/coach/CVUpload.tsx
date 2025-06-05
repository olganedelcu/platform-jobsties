
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CoachNavigation from '@/components/CoachNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CVUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const [mentees] = useState([
    { id: '1', name: 'John Smith', email: 'john.smith@email.com', avatar: null },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', avatar: null },
    { id: '3', name: 'Michael Brown', email: 'michael.brown@email.com', avatar: null }
  ]);

  const [cvFiles, setCvFiles] = useState([
    {
      id: 1,
      menteeId: '1',
      menteeName: 'John Smith',
      fileName: 'John_Smith_CV_v2.pdf',
      uploadDate: '2024-06-10',
      fileSize: '245 KB'
    },
    {
      id: 2,
      menteeId: '2',
      menteeName: 'Sarah Johnson',
      fileName: 'Sarah_Johnson_Resume.pdf',
      uploadDate: '2024-06-08',
      fileSize: '189 KB'
    }
  ]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
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
    
    // Simulate file upload
    setTimeout(() => {
      const mentee = mentees.find(m => m.id === selectedMentee);
      const newFile = {
        id: cvFiles.length + 1,
        menteeId: selectedMentee,
        menteeName: mentee?.name || '',
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${Math.round(file.size / 1024)} KB`
      };
      
      setCvFiles([...cvFiles, newFile]);
      setUploadingFile(false);
      setSelectedMentee('');
      
      toast({
        title: "Success",
        description: `CV uploaded successfully for ${mentee?.name}`,
      });
    }, 2000);
  };

  const handleDeleteFile = (fileId: number) => {
    setCvFiles(cvFiles.filter(file => file.id !== fileId));
    toast({
      title: "File Deleted",
      description: "CV file has been removed successfully.",
    });
  };

  const handleDownloadFile = (fileName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavigation user={user} onSignOut={handleSignOut} />
      
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
                      {mentee.name} ({mentee.email})
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
                <span>Quick Mentee Reference</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mentees.map((mentee) => (
                  <div key={mentee.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mentee.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        {mentee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{mentee.name}</p>
                      <p className="text-sm text-gray-500">{mentee.email}</p>
                    </div>
                    <Badge variant="outline">
                      {cvFiles.filter(f => f.menteeId === mentee.id).length} CV(s)
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uploaded Files */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Uploaded CV Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cvFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No CV files uploaded</h3>
                <p className="text-gray-500">Upload CV files for your mentees to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cvFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{file.fileName}</h4>
                        <p className="text-sm text-gray-500">
                          {file.menteeName} • {file.fileSize} • {file.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFile(file.fileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
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
      </main>
    </div>
  );
};

export default CVUpload;
