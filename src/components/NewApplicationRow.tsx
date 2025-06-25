
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { NewJobApplicationData } from '@/types/jobApplications';

interface NewApplicationRowProps {
  newApplicationData: NewJobApplicationData;
  setNewApplicationData: React.Dispatch<React.SetStateAction<NewJobApplicationData>>;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const NewApplicationRow = ({ 
  newApplicationData, 
  setNewApplicationData, 
  onSave, 
  onCancel 
}: NewApplicationRowProps) => {
  return (
    <TableRow className="bg-blue-50">
      <TableCell className="w-32">
        <Input
          type="date"
          value={newApplicationData.dateApplied}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, dateApplied: e.target.value }))}
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={newApplicationData.companyName}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, companyName: e.target.value }))}
          placeholder="Company name"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={newApplicationData.jobTitle}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, jobTitle: e.target.value }))}
          placeholder="Job title"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-32">
        <Select
          value={newApplicationData.applicationStatus}
          onValueChange={(value) => setNewApplicationData(prev => ({ ...prev, applicationStatus: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="to_be_considered">To Be Considered</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offer">Offer Received</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="w-32">
        <Input
          value={newApplicationData.interviewStage || ''}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, interviewStage: e.target.value }))}
          placeholder="Interview stage"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          value={newApplicationData.recruiterName || ''}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, recruiterName: e.target.value }))}
          placeholder="Recruiter name"
          className="w-full"
        />
      </TableCell>
      <TableCell className="w-64">
        <Textarea
          value={newApplicationData.menteeNotes || ''}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, menteeNotes: e.target.value }))}
          placeholder="Add your notes..."
          className="w-full min-h-[60px]"
        />
      </TableCell>
      <TableCell className="w-64">
        <Textarea
          value={newApplicationData.coachNotes || ''}
          onChange={(e) => setNewApplicationData(prev => ({ ...prev, coachNotes: e.target.value }))}
          placeholder="Coach notes"
          className="w-full min-h-[60px]"
        />
      </TableCell>
      <TableCell className="w-24">
        <div className="flex gap-1">
          <Button size="sm" onClick={onSave}>
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NewApplicationRow;
