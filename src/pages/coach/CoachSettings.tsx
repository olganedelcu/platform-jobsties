
import React, { useState } from 'react';
import CoachNavigation from '@/components/CoachNavigation';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AvailabilitySettings from '@/components/coach/AvailabilitySettings';
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Calendar, 
  Clock,
  Save
} from 'lucide-react';

const CoachSettings = () => {
  const { user, loading: authLoading, handleSignOut } = useAuthState();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Profile Settings
    displayName: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || '',
    bio: '',
    specializations: '',
    hourlyRate: '',
    
    // Notification Settings
    emailNotifications: true,
    sessionReminders: true,
    newMenteeAlerts: true,
    applicationAlerts: true,
    
    // Privacy Settings
    profileVisible: true,
    showContactInfo: true,
    allowDirectBooking: true
  });

  const handleSaveSettings = () => {
    // Here you would normally save to database
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (authLoading) {
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
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CoachNavigation user={user} onSignOut={handleSignOut} />
        
        <main className="max-w-4xl mx-auto py-8 px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your coaching profile and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={settings.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        value={settings.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        placeholder="e.g., 75"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell mentees about your background and expertise..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations</Label>
                    <Input
                      id="specializations"
                      value={settings.specializations}
                      onChange={(e) => handleInputChange('specializations', e.target.value)}
                      placeholder="e.g., Career Transitions, Interview Prep, Tech Leadership"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <AvailabilitySettings coachId={user.id} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications via email</div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Session Reminders</div>
                      <div className="text-sm text-gray-500">Get reminded about upcoming sessions</div>
                    </div>
                    <Switch
                      checked={settings.sessionReminders}
                      onCheckedChange={(checked) => handleInputChange('sessionReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">New Mentee Alerts</div>
                      <div className="text-sm text-gray-500">Notify when new mentees request coaching</div>
                    </div>
                    <Switch
                      checked={settings.newMenteeAlerts}
                      onCheckedChange={(checked) => handleInputChange('newMenteeAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Application Alerts</div>
                      <div className="text-sm text-gray-500">Notify about new job applications from mentees</div>
                    </div>
                    <Switch
                      checked={settings.applicationAlerts}
                      onCheckedChange={(checked) => handleInputChange('applicationAlerts', checked)}
                    />
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Profile Visible</div>
                      <div className="text-sm text-gray-500">Allow mentees to find your profile</div>
                    </div>
                    <Switch
                      checked={settings.profileVisible}
                      onCheckedChange={(checked) => handleInputChange('profileVisible', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Show Contact Information</div>
                      <div className="text-sm text-gray-500">Display email and phone in profile</div>
                    </div>
                    <Switch
                      checked={settings.showContactInfo}
                      onCheckedChange={(checked) => handleInputChange('showContactInfo', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Allow Direct Booking</div>
                      <div className="text-sm text-gray-500">Let mentees book sessions directly</div>
                    </div>
                    <Switch
                      checked={settings.allowDirectBooking}
                      onCheckedChange={(checked) => handleInputChange('allowDirectBooking', checked)}
                    />
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachSettings;
