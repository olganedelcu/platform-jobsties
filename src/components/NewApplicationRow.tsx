
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { JobApplicationStatusSelect } from '@/components/JobApplicationStatusSelect';

interface NewApplicationRowProps {
  onSave: (applicationData: any) => void;
  onCancel: () => void;
}

const NewApplicationRow = ({ onSave, onCancel }: NewApplicationRowProps) => {
  const [newApplication, setNewApplication] = useState({
    company_name: '',
    job_title: '',
    job_link: '',
    date_applied: new Date().toISOString().split('T')[0],
    application_status: 'applied' as const,
    interview_stage: '',
    recruiter_name: '',
    mentee_notes: ''
  });

  const handleSave = () => {
    if (newApplication.company_name && newApplication.job_title) {
      onSave(newApplication);
    }
  };

  const isValid = newApplication.company_name.trim() && newApplication.job_title.trim();

  return (
    <TableRow className="bg-blue-50">
      <TableCell>
        <Input
          placeholder="Company name"
          value={newApplication.company_name}
          onChange={(e) => setNewApplication(prev => ({ ...prev, company_name: e.target.value }))}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Job title"
          value={newApplication.job_title}
          onChange={(e) => setNewApplication(prev => ({ ...prev, job_title: e.target.value }))}
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="https://..."
          value={newApplication.job_link}
          onChange={(e) => setNewApplication(prev => ({ ...prev, job_link: e.target.value }))}
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={newApplication.date_applied}
          onChange={(e) => setNewApplication(prev => ({ ...prev, date_applied: e.target.value }))}
          className="min-w-[130px]"
        />
      </TableCell>
      <TableCell>
        <JobApplicationStatusSelect
          value={newApplication.application_status}
          onValueChange={(value) => setNewApplication(prev => ({ ...prev, application_status: value }))}
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Phone, On-site..."
          value={newApplication.interview_stage}
          onChange={(e) => setNewApplication(prev => ({ ...prev, interview_stage: e.target.value }))}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Recruiter name"
          value={newApplication.recruiter_name}
          onChange={(e) => setNewApplication(prev => ({ ...prev, recruiter_name: e.target.value }))}
          className="min-w-[120px]"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Add notes..."
          value={newApplication.mentee_notes}
          onChange={(e) => setNewApplication(prev => ({ ...prev, mentee_notes: e.target.value }))}
          className="min-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={!isValid}
            className="h-7 w-7 p-0"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="h-7 w-7 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NewApplicationRow;
