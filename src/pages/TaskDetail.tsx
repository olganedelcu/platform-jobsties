import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Save, X, ExternalLink, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMenteeTodosAuth } from '@/hooks/useMenteeTodosAuth';
import Navigation from '@/components/Navigation';

interface TodoData {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  mentee_id?: string;
  coach_id?: string;
  // For assignments
  mentee_title?: string | null;
  mentee_description?: string | null;
  mentee_due_date?: string | null;
  mentee_priority?: 'low' | 'medium' | 'high' | null;
  assigned_at?: string;
  coach_todo?: {
    title: string;
    description: string | null;
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
  };
}

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, handleSignOut } = useMenteeTodosAuth();
  
  const [task, setTask] = useState<TodoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isAssignment, setIsAssignment] = useState(false);
  const [editData, setEditData] = useState<Partial<TodoData>>({});

  useEffect(() => {
    if (user && id) {
      fetchTask();
    }
  }, [user, id]);

  const fetchTask = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);

      // First try to fetch as a personal todo
      const { data: personalTodo, error: personalError } = await supabase
        .from('mentee_todos')
        .select('*')
        .eq('id', id)
        .eq('mentee_id', user.id)
        .single();

      if (personalTodo && !personalError) {
        const typedTodo: TodoData = {
          ...personalTodo,
          status: personalTodo.status as 'pending' | 'in_progress' | 'completed',
          priority: personalTodo.priority as 'low' | 'medium' | 'high'
        };
        setTask(typedTodo);
        setIsAssignment(false);
        setEditData(typedTodo);
        return;
      }

      // If not found, try to fetch as an assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('mentee_todo_assignments')
        .select(`
          *,
          coach_todos!inner(
            id,
            title,
            description,
            priority,
            due_date
          )
        `)
        .eq('id', id)
        .eq('mentee_id', user.id)
        .single();

      if (assignment && !assignmentError) {
        const transformedTask: TodoData = {
          id: assignment.id,
          title: assignment.mentee_title || assignment.coach_todos.title,
          description: assignment.mentee_description || assignment.coach_todos.description,
          status: assignment.status as 'pending' | 'in_progress' | 'completed',
          priority: (assignment.mentee_priority || assignment.coach_todos.priority) as 'low' | 'medium' | 'high',
          due_date: assignment.mentee_due_date || assignment.coach_todos.due_date,
          created_at: assignment.created_at,
          updated_at: assignment.updated_at,
          assigned_at: assignment.assigned_at,
          mentee_title: assignment.mentee_title,
          mentee_description: assignment.mentee_description,
          mentee_due_date: assignment.mentee_due_date,
          mentee_priority: assignment.mentee_priority as 'low' | 'medium' | 'high' | null,
          coach_todo: {
            title: assignment.coach_todos.title,
            description: assignment.coach_todos.description,
            priority: assignment.coach_todos.priority as 'low' | 'medium' | 'high',
            due_date: assignment.coach_todos.due_date
          }
        };
        setTask(transformedTask);
        setIsAssignment(true);
        setEditData(transformedTask);
        return;
      }

      // If neither found, show error
      toast({
        title: "Error",
        description: "Task not found",
        variant: "destructive"
      });
      navigate('/todos');
    } catch (error) {
      console.error('Error fetching task:', error);
      toast({
        title: "Error",
        description: "Failed to fetch task details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!task || !user) return;

    try {
      setLoading(true);

      if (isAssignment) {
        // Update assignment
        const { error } = await supabase
          .from('mentee_todo_assignments')
          .update({
            status: editData.status,
            mentee_title: editData.title !== task.coach_todo?.title ? editData.title : null,
            mentee_description: editData.description !== task.coach_todo?.description ? editData.description : null,
            mentee_due_date: editData.due_date !== task.coach_todo?.due_date ? editData.due_date : null,
            mentee_priority: editData.priority !== task.coach_todo?.priority ? editData.priority : null,
          })
          .eq('id', task.id);

        if (error) throw error;
      } else {
        // Update personal todo
        const { error } = await supabase
          .from('mentee_todos')
          .update({
            title: editData.title,
            description: editData.description,
            status: editData.status,
            priority: editData.priority,
            due_date: editData.due_date
          })
          .eq('id', task.id);

        if (error) throw error;
      }

      setTask({ ...task, ...editData });
      setEditing(false);
      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <a
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {part}
                </a>
              </div>
            );
          }
          return part ? (
            <p key={index} className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {part}
            </p>
          ) : null;
        })}
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation user={user} onSignOut={handleSignOut} />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Task not found</p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/todos')}
                  className="mt-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tasks
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} onSignOut={handleSignOut} />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/todos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
            
            <div className="flex items-center gap-3">
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Task
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setEditData(task);
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Task Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editing ? (
                    <Input
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="text-xl font-semibold border-0 px-0 focus:ring-0"
                      placeholder="Task title"
                    />
                  ) : (
                    <CardTitle className="text-2xl text-gray-900 mb-4">
                      {task.title}
                    </CardTitle>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    {isAssignment && (
                      <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                        <User className="h-3 w-3 mr-1" />
                        Coach Assignment
                      </Badge>
                    )}
                    
                    {editing ? (
                      <Select
                        value={editData.priority || task.priority}
                        onValueChange={(value) => setEditData({ ...editData, priority: value as 'low' | 'medium' | 'high' })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={`${getPriorityColor(task.priority)} px-3 py-1`}>
                        {task.priority} priority
                      </Badge>
                    )}
                    
                    {editing ? (
                      <Select
                        value={editData.status || task.status}
                        onValueChange={(value) => setEditData({ ...editData, status: value as 'pending' | 'in_progress' | 'completed' })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={`${getStatusColor(task.status)} px-3 py-1`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {task.status === 'completed' && (
                  <CheckCircle className="h-8 w-8 text-green-600 mt-2" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                {editing ? (
                  <Textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Task description..."
                    className="min-h-[200px] resize-none"
                  />
                ) : (
                  <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-blue-200 min-h-[120px]">
                    {task.description ? (
                      renderTextWithLinks(task.description)
                    ) : (
                      <p className="text-gray-500 italic">No description provided</p>
                    )}
                  </div>
                )}
              </div>

              {/* Due Date */}
              {(task.due_date || editing) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Due Date</h3>
                  {editing ? (
                    <Input
                      type="date"
                      value={editData.due_date || ''}
                      onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                      className="w-48"
                    />
                  ) : task.due_date ? (
                    <div className="flex items-center gap-2 text-gray-700 p-3 bg-yellow-50 rounded-lg border border-yellow-200 w-fit">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Due:</span>
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Original Coach Assignment (for assignments) */}
              {isAssignment && task.coach_todo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Coach Assignment</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">{task.coach_todo.title}</h4>
                    {task.coach_todo.description && (
                      <div className="text-blue-800 text-sm">
                        {renderTextWithLinks(task.coach_todo.description)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className={getPriorityColor(task.coach_todo.priority)}>
                        {task.coach_todo.priority} priority
                      </Badge>
                      {task.coach_todo.due_date && (
                        <span className="text-xs text-blue-600">
                          Due: {new Date(task.coach_todo.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Task Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                  {isAssignment && task.assigned_at && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Assigned: {new Date(task.assigned_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;