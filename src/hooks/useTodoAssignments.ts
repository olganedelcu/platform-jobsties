
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTodoAssignments, 
  updateAssignmentStatus,
  updateAssignmentDetails,
  TodoAssignmentWithDetails 
} from '@/services/todoAssignmentService';

export const useTodoAssignments = (userId: string, isCoach: boolean = false) => {
  const [assignments, setAssignments] = useState<TodoAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadAssignments = async () => {
    try {
      console.log('Loading assignments for user:', userId);
      
      if (!userId) {
        console.log('No userId provided, skipping load');
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchTodoAssignments(userId, isCoach);
      setAssignments(data);
      console.log('Assignments loaded:', data);
    } catch (error: any) {
      console.error('Error fetching todo assignments:', error);
      
      // Only show toast for non-auth errors to avoid spam
      if (!error.message?.includes('Authentication')) {
        toast({
          title: "Error",
          description: "Failed to fetch todo assignments",
          variant: "destructive"
        });
      }
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

  const updateDetails = async (
    assignmentId: string, 
    details: {
      mentee_title?: string;
      mentee_description?: string;
      mentee_due_date?: string;
      mentee_priority?: 'low' | 'medium' | 'high';
    }
  ) => {
    try {
      await updateAssignmentDetails(assignmentId, details);
      
      // Update local state
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, ...details }
            : assignment
        )
      );

      toast({
        title: "Success",
        description: "Assignment details updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating assignment details:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment details",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log('No userId, skipping effect');
      return;
    }

    console.log('Loading todo assignments for user:', userId, 'isCoach:', isCoach);
    loadAssignments();
  }, [userId, isCoach]);

  return {
    assignments,
    loading,
    updateStatus,
    updateDetails,
    refreshAssignments: loadAssignments
  };
};
