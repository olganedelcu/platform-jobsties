
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, Phone, Globe, Building, GraduationCap, Edit } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl font-bold">
                    {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </h2>
                <p className="text-gray-600 mb-6">{user?.email}</p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Add location" className="border-none bg-transparent p-0" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Add phone number" className="border-none bg-transparent p-0" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Add website" className="border-none bg-transparent p-0" />
                  </div>
                </div>
                
                <div className="mt-8">
                  <Label className="text-left block text-gray-700 font-medium mb-2">About</Label>
                  <Textarea 
                    placeholder="Tell us about yourself..." 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Experience and Education */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-indigo-600" />
                  <span>Experience</span>
                </CardTitle>
                <Button variant="outline" className="text-indigo-600 border-indigo-600">
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  No experience added yet. Click "Add Experience" to get started.
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  <span>Education</span>
                </CardTitle>
                <Button variant="outline" className="text-indigo-600 border-indigo-600">
                  Add Education
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  No education added yet. Click "Add Education" to get started.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
