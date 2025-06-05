
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, Phone, Globe, Building, GraduationCap, Edit, Camera, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phone: '',
    website: '',
    about: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
        setProfileData({
          firstName: session.user.user_metadata?.first_name || '',
          lastName: session.user.user_metadata?.last_name || '',
          email: session.user.email || '',
          location: '',
          phone: '',
          website: '',
          about: ''
        });
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

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
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
                <div className="relative inline-block mb-4">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full cursor-pointer hover:from-indigo-700 hover:to-purple-700">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                        className="text-center"
                      />
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                        className="text-center"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                )}
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input 
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Add location"
                        className="border-none bg-transparent p-0 flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.location || 'Add location'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{profileData.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input 
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Add phone number"
                        className="border-none bg-transparent p-0 flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.phone || 'Add phone number'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input 
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="Add website"
                        className="border-none bg-transparent p-0 flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{profileData.website || 'Add website'}</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <Label className="text-left block text-gray-700 font-medium mb-2">About</Label>
                  {isEditing ? (
                    <Textarea 
                      value={profileData.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      placeholder="Tell us about yourself..." 
                      className="min-h-[100px]"
                    />
                  ) : (
                    <div className="text-gray-700 text-left min-h-[100px] p-3 bg-gray-50 rounded-md">
                      {profileData.about || 'Tell us about yourself...'}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-6">
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={handleSaveProfile}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
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
                <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
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
                <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
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
