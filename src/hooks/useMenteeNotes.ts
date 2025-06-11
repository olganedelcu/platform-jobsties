
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MenteeNote {
  id: string;
  coach_id: string;
  mentee_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useMenteeNotes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<MenteeNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        return;
      }

      const { data, error } = await supabase
        .from('mentee_notes')
        .select('*')
        .eq('coach_id', user.id);

      if (error) {
        console.error('Error fetching mentee notes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch mentee notes.",
          variant: "destructive"
        });
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching mentee notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentee notes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (menteeId: string, noteText: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('mentee_notes')
        .upsert({
          coach_id: user.id,
          mentee_id: menteeId,
          notes: noteText
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating mentee note:', error);
        toast({
          title: "Error",
          description: "Failed to update note.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setNotes(prev => {
        const existingIndex = prev.findIndex(note => note.mentee_id === menteeId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });

      toast({
        title: "Success",
        description: "Note updated successfully.",
      });
    } catch (error) {
      console.error('Error updating mentee note:', error);
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive"
      });
    }
  };

  const getNoteForMentee = (menteeId: string): string => {
    const note = notes.find(n => n.mentee_id === menteeId);
    return note?.notes || '';
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, loading, updateNote, getNoteForMentee, fetchNotes };
};
