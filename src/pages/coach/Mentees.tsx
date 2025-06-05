
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CoachNavigation from '@/components/CoachNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';

const Mentees = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mentees] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      avatar: null,
      location: 'New York, NY',
      phone: '+1 (555) 123-4567',
      website: 'johnsmith.dev',
      about: 'Experienced software developer with 5 years in web development. Looking to transition into senior roles and expand my leadership skills.',
      progress: 75,
      status: 'Active',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: null,
      location: 'San Francisco, CA',
      phone: '+1 (555) 987-6543',
      website: 'sarahjohnson.com',
      about: 'Marketing professional with 3 years of experience. Seeking to advance into digital marketing strategy and brand management.',
      progress: 60,
      status: 'Active',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      avatar: null,
      location: 'Chicago, IL',
      phone: '+1 (555) 456-7890',
      website: null,
      about: 'Recent graduate with a degree in Computer Science. Looking for entry-level opportunities in software development.',
      progress: 45,
      status: 'Active',
      lastActive: '3 hours ago'
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
          <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-600 mt-2">Manage and track your mentees' progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mentees.map((mentee) => (
            <Card key={mentee.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentee.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg">
                      {mentee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{mentee.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={mentee.status === 'Active' ? 'default' : 'secondary'}>
                        {mentee.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Last active: {mentee.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{mentee.email}</span>
                  </div>
                  {mentee.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{mentee.location}</span>
                    </div>
                  )}
                  {mentee.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{mentee.phone}</span>
                    </div>
                  )}
                  {mentee.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span>{mentee.website}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">About</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {mentee.about}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Progress</span>
                    <span className="text-sm text-gray-500">{mentee.progress}%</span>
                  </div>
                  <Progress value={mentee.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Mentees;
