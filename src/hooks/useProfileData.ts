
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
  website: string;
  about: string;
}

export const useProfileData = (user: any) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    phone: '',
    website: '',
    about: ''
  });

  // Fetch user profile data from database
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // First try to get from user_profiles table
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Error fetching profile:', error);
      }

      if (userProfile) {
        // Use data from database
        setProfileData({
          firstName: userProfile.first_name || '',
          lastName: userProfile.last_name || '',
          email: user.email || '',
          location: userProfile.location || '',
          phone: userProfile.phone || '',
          website: userProfile.website || '',
          about: userProfile.about || ''
        });
        setProfilePicture(userProfile.profile_picture_url);
      } else {
        // Fallback to user metadata for new users
        setProfileData({
          firstName: user?.user_metadata?.first_name || '',
          lastName: user?.user_metadata?.last_name || '',
          email: user?.email || '',
          location: '',
          phone: '',
          website: '',
          about: ''
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const handleSaveProfile = async () => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const profilePayload = {
        user_id: user.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        location: profileData.location,
        phone: profileData.phone,
        website: profileData.website,
        about: profileData.about,
        profile_picture_url: profilePicture
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(profilePayload)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert(profilePayload);

        if (error) throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    profileData,
    profilePicture,
    isEditing,
    loading,
    setIsEditing,
    handleProfilePictureUpload,
    handleSaveProfile,
    handleInputChange
  };
};
