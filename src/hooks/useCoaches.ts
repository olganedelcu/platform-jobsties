
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Coach {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'coach')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching coaches:', error);
        toast({
          title: "Error",
          description: "Failed to load coaches. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setCoaches(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading coaches.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return {
    coaches,
    loading,
    refetchCoaches: fetchCoaches
  };
};
