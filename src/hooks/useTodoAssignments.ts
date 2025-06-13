
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTodoAssignments, 
  updateAssignmentStatus, 
  TodoAssignmentWithDetails 
} from '@/services/todoAssignmentService';
import { supabase } from '@/integrations/supabase/client';

export const useTodoAssignments = (userId: string, isCoach: boolean = false) => {
  const [assignments, setAssignments] = useState<TodoAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await fetchTodoAssignments(userId, isCoach);
      setAssignments(data);
      console.log('Assignments loaded:', data);
    } catch (error: any) {
      console.error('Error fetching todo assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch todo assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (assignmentId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateAssignmentStatus(assignmentId, status);
      
      // Update local state
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, status }
            : assignment
        )
      );

      toast({
        title: "Success",
        description: "Assignment status updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating assignment status:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Load initial data
    loadAssignments();

    // Clean up any existing channel
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time subscription
    const channel = supabase
      .channel(`todo_assignments_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentee_todo_assignments',
          filter: isCoach ? `coach_id=eq.${userId}` : `mentee_id=eq.${userId}`
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Reload assignments when changes occur
          loadAssignments();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up channel on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, isCoach]);

  return {
    assignments,
    loading,
    updateStatus,
    refreshAssignments: loadAssignments
  };
};
