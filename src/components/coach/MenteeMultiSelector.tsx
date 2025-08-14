
import React, { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Search } from 'lucide-react';
import { useMentees } from '@/hooks/useMentees';

interface MenteeMultiSelectorProps {
  selectedMentees: string[];
  onToggleMentee: (menteeId: string) => void;
}

const MenteeMultiSelector = ({ selectedMentees, onToggleMentee }: MenteeMultiSelectorProps) => {
  const { mentees, loading } = useMentees();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentees = useMemo(() => {
    if (!searchTerm.trim()) return mentees;
    
    const searchLower = searchTerm.toLowerCase();
    return mentees.filter(mentee => 
      mentee.first_name.toLowerCase().includes(searchLower) ||
      mentee.last_name.toLowerCase().includes(searchLower) ||
      mentee.email.toLowerCase().includes(searchLower)
    );
  }, [mentees, searchTerm]);

  if (loading) {
    return (
      <div>
        <Label className="text-base font-medium mb-3 block">Select Mentees</Label>
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-gray-500">Loading mentees...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mentees.length === 0) {
    return (
      <div>
        <Label className="text-base font-medium mb-3 block">Select Mentees</Label>
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No mentees available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Label className="text-base font-medium mb-3 block">
        Select Mentees ({selectedMentees.length} selected)
      </Label>
      <Card>
        <CardContent className="p-4">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mentees List */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filteredMentees.length === 0 && searchTerm.trim() ? (
              <div className="text-center text-gray-500 py-4">
                <User className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No mentees found matching "{searchTerm}"</p>
              </div>
            ) : (
              filteredMentees.map((mentee) => (
                <div key={mentee.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mentee-${mentee.id}`}
                    checked={selectedMentees.includes(mentee.id)}
                    onCheckedChange={() => onToggleMentee(mentee.id)}
                  />
                  <label
                    htmlFor={`mentee-${mentee.id}`}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-600">
                          {mentee.first_name[0]}{mentee.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{mentee.first_name} {mentee.last_name}</p>
                        <p className="text-xs text-gray-500">{mentee.email}</p>
                      </div>
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenteeMultiSelector;
