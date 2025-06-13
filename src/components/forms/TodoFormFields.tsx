
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

interface TodoFormFieldsProps {
  formData: TodoFormData;
  onFormDataChange: (data: TodoFormData) => void;
}

const TodoFormFields = ({ formData, onFormDataChange }: TodoFormFieldsProps) => {
  const handleFieldChange = (field: keyof TodoFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <>
      <Input
        placeholder="Todo title"
        value={formData.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
      />
      
      <Textarea
        placeholder="Description (optional)"
        value={formData.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
      />

      <select
        value={formData.priority}
        onChange={(e) => handleFieldChange('priority', e.target.value as 'low' | 'medium' | 'high')}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <Input
        type="date"
        placeholder="Due date (optional)"
        value={formData.due_date}
        onChange={(e) => handleFieldChange('due_date', e.target.value)}
      />
    </>
  );
};

export default TodoFormFields;
