
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const useAvailabilitySettings = (coachId: string) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailability();
    fetchBlockedDates();
  }, [coachId]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .order('day_of_week');

      if (error) {
        console.log('No existing availability found, using defaults');
      }

      if (data && data.length > 0) {
        setAvailability(data);
      } else {
        // Initialize with default availability (9 AM to 5 PM, Monday to Friday)
        const defaultAvailability = Array.from({ length: 7 }, (_, index) => ({
          day_of_week: index,
          start_time: '09:00',
          end_time: '17:00',
          is_available: index >= 1 && index <= 5 // Monday to Friday
        }));
        setAvailability(defaultAvailability);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Note",
        description: "Using default availability settings. You can customize them below.",
      });
      
      // Set default availability even on error
      const defaultAvailability = Array.from({ length: 7 }, (_, index) => ({
        day_of_week: index,
        start_time: '09:00',
        end_time: '17:00',
        is_available: index >= 1 && index <= 5 // Monday to Friday
      }));
      setAvailability(defaultAvailability);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_blocked_dates')
        .select('blocked_date')
        .eq('coach_id', coachId);

      if (error) {
        console.log('No blocked dates found');
        return;
      }
      setBlockedDates(data?.map((item: { blocked_date: string }) => item.blocked_date) || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const updateAvailability = (dayIndex: number, field: string, value: string | boolean) => {
    setAvailability(prev => prev.map((slot, index) => 
      index === dayIndex ? { ...slot, [field]: value } : slot
    ));
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      // Delete existing availability
      await supabase
        .from('coach_availability')
        .delete()
        .eq('coach_id', coachId);

      // Insert new availability
      const availabilityData = availability.map(slot => ({
        ...slot,
        coach_id: coachId
      }));

      const { error } = await supabase
        .from('coach_availability')
        .insert(availabilityData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability settings saved successfully.",
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addBlockedDate = async () => {
    if (!newBlockedDate) return;

    try {
      const { error } = await supabase
        .from('coach_blocked_dates')
        .insert({
          coach_id: coachId,
          blocked_date: newBlockedDate,
          reason: 'Manually blocked'
        });

      if (error) throw error;

      setBlockedDates(prev => [...prev, newBlockedDate]);
      setNewBlockedDate('');
      
      toast({
        title: "Success",
        description: "Date blocked successfully.",
      });
    } catch (error) {
      console.error('Error blocking date:', error);
      toast({
        title: "Error",
        description: "Failed to block date.",
        variant: "destructive",
      });
    }
  };

  const removeBlockedDate = async (dateToRemove: string) => {
    try {
      const { error } = await supabase
        .from('coach_blocked_dates')
        .delete()
        .eq('coach_id', coachId)
        .eq('blocked_date', dateToRemove);

      if (error) throw error;

      setBlockedDates(prev => prev.filter(date => date !== dateToRemove));
      
      toast({
        title: "Success",
        description: "Date unblocked successfully.",
      });
    } catch (error) {
      console.error('Error removing blocked date:', error);
      toast({
        title: "Error",
        description: "Failed to unblock date.",
        variant: "destructive",
      });
    }
  };

  return {
    availability,
    blockedDates,
    newBlockedDate,
    loading,
    saving,
    setNewBlockedDate,
    updateAvailability,
    saveAvailability,
    addBlockedDate,
    removeBlockedDate
  };
};
