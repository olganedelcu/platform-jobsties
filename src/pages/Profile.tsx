
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import AddExperience from '@/components/AddExperience';
import AddEducation from '@/components/AddEducation';
import ProfileCard from '@/components/ProfileCard';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
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

  const handleAddExperience = (experience: Experience) => {
    setExperiences([...experiences, experience]);
  };

  const handleAddEducation = (education: Education) => {
    setEducations([...educations, education]);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    toast({
      title: "Experience Deleted",
      description: "Work experience has been removed from your profile.",
    });
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
    toast({
      title: "Education Deleted", 
      description: "Education has been removed from your profile.",
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
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <ProfileCard
              profileData={profileData}
              profilePicture={profilePicture}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
              onInputChange={handleInputChange}
              onProfilePictureUpload={handleProfilePictureUpload}
            />
          </div>
          
          {/* Experience and Education */}
          <div className="lg:col-span-2 space-y-6">
            <ExperienceSection
              experiences={experiences}
              onAddExperience={() => setShowAddExperience(true)}
              onDeleteExperience={handleDeleteExperience}
            />
            
            <EducationSection
              educations={educations}
              onAddEducation={() => setShowAddEducation(true)}
              onDeleteEducation={handleDeleteEducation}
            />
          </div>
        </div>
      </main>

      {/* Add Experience Dialog */}
      <AddExperience
        isOpen={showAddExperience}
        onClose={() => setShowAddExperience(false)}
        onAdd={handleAddExperience}
      />

      {/* Add Education Dialog */}
      <AddEducation
        isOpen={showAddEducation}
        onClose={() => setShowAddEducation(false)}
        onAdd={handleAddEducation}
      />
    </div>
  );
};

export default Profile;
