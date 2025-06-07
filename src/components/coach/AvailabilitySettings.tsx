
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Save, Plus, X } from 'lucide-react';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface AvailabilitySettingsProps {
  coachId: string;
}

const AvailabilitySettings = ({ coachId }: AvailabilitySettingsProps) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

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

      if (error) throw error;

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
        title: "Error",
        description: "Failed to load availability settings.",
        variant: "destructive",
      });
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

      if (error) throw error;
      setBlockedDates(data?.map(item => item.blocked_date) || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const updateAvailability = (dayIndex: number, field: string, value: any) => {
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

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-lg">Loading availability settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availability.map((slot, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-24">
                <span className="font-medium">{daysOfWeek[index]}</span>
              </div>
              
              <Switch
                checked={slot.is_available}
                onCheckedChange={(checked) => updateAvailability(index, 'is_available', checked)}
              />
              
              {slot.is_available && (
                <>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <Input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateAvailability(index, 'start_time', e.target.value)}
                      className="w-24"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateAvailability(index, 'end_time', e.target.value)}
                      className="w-24"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          
          <Button 
            onClick={saveAvailability} 
            disabled={saving}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Availability'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocked Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex-1"
            />
            <Button onClick={addBlockedDate} disabled={!newBlockedDate}>
              <Plus className="h-4 w-4 mr-2" />
              Block Date
            </Button>
          </div>
          
          {blockedDates.length > 0 && (
            <div className="space-y-2">
              {blockedDates.map((date) => (
                <div key={date} className="flex items-center justify-between p-2 border rounded">
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBlockedDate(date)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilitySettings;
