
import { useState } from 'react';

interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

export const useTodoFormState = () => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [assignToMentees, setAssignToMentees] = useState(false);

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev => 
      prev.includes(menteeId)
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    });
    setSelectedMentees([]);
    setAssignToMentees(false);
  };

  return {
    formData,
    setFormData,
    selectedMentees,
    setSelectedMentees,
    assignToMentees,
    setAssignToMentees,
    toggleMenteeSelection,
    resetForm
  };
};
