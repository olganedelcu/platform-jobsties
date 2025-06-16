
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
}

export const useDashboardTaskBoard = (userId: string) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Fetch personal todos for the mentee
      const { data, error } = await supabase
        .from('mentee_todos')
        .select('*')
        .eq('mentee_id', userId)
        .order('created_at', { ascending: false })
        .limit(6); // Show only recent tasks on dashboard

      if (error) throw error;

      const transformedTasks: TaskItem[] = (data || []).map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || undefined,
        status: todo.status as 'pending' | 'in_progress' | 'completed',
        priority: todo.priority as 'low' | 'medium' | 'high',
        due_date: todo.due_date || undefined,
        created_at: todo.created_at
      }));

      setTasks(transformedTasks);
    } catch (error: any) {
      console.error('Error fetching dashboard tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('mentee_todos')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      );

      toast({
        title: "Success",
        description: "Task status updated"
      });
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  return {
    tasks,
    loading,
    updateTaskStatus,
    refetchTasks: fetchTasks
  };
};
