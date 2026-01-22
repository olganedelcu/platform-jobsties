
import { useState, useEffect, useCallback } from 'react';
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

  const loadAssignments = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchTodoAssignments(userId, isCoach);
      setAssignments(data);
    } catch (error: unknown) {
      console.error('Error loading assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, isCoach, toast]);

  const updateStatus = useCallback(async (assignmentId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateAssignmentStatus(assignmentId, status);
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
    } catch (error: unknown) {
      console.error('Error updating assignment status:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive"
      });
    }
  }, [toast]);

  const updateDetails = useCallback(async (assignmentId: string, updates: {
    mentee_title?: string;
    mentee_description?: string;
    mentee_due_date?: string;
    mentee_priority?: 'low' | 'medium' | 'high';
  }) => {
    try {
      await updateAssignmentDetails(assignmentId, updates);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, ...updates }
            : assignment
        )
      );
      toast({
        title: "Success",
        description: "Assignment updated successfully"
      });
    } catch (error: unknown) {
      console.error('Error updating assignment details:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  return {
    assignments,
    loading,
    updateStatus,
    updateDetails,
    refreshAssignments: loadAssignments
  };
};
