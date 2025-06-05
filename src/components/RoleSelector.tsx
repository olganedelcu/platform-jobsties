
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface RoleSelectorProps {
  selectedRole: 'COACH' | 'MENTEE';
  onRoleChange: (role: 'COACH' | 'MENTEE') => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-gray-700">Role</Label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant={selectedRole === 'MENTEE' ? 'default' : 'outline'}
          onClick={() => onRoleChange('MENTEE')}
          className={`flex-1 ${
            selectedRole === 'MENTEE' 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          Mentee
        </Button>
        <Button
          type="button"
          variant={selectedRole === 'COACH' ? 'default' : 'outline'}
          onClick={() => onRoleChange('COACH')}
          className={`flex-1 ${
            selectedRole === 'COACH' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'border-purple-200 text-purple-600 hover:bg-purple-50'
          }`}
        >
          Coach
        </Button>
      </div>
    </div>
  );
};

export default RoleSelector;
