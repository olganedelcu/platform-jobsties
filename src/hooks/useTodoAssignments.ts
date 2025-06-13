
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTodoAssignments, 
  updateAssignmentStatus, 
  TodoAssignmentWithDetails 
} from '@/services/todoAssignmentService';

export const useTodoAssignments = (userId: string, isCoach: boolean = false) => {
  const [assignments, setAssignments] = useState<TodoAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const subscriptionRef = useRef<any>(null);

  const loadAssignments = async () => {
    try {
      console.log('Loading assignments for userId:', userId, 'isCoach:', isCoach);
      setLoading(true);
      const data = await fetchTodoAssignments(userId, isCoach);
      console.log('Loaded assignments:', data);
      setAssignments(data);
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
    if (userId) {
      console.log('useEffect triggered with userId:', userId, 'isCoach:', isCoach);
      loadAssignments();
    }

    // Cleanup subscription on unmount or dependency change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
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
