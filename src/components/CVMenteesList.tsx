
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CVMenteesListProps {
  mentees: Mentee[];
}

const CVMenteesList = ({ mentees }: CVMenteesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Your Mentees</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mentees.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentees found</h3>
            <p className="text-gray-500">Mentees will appear here when they sign up to the platform</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mentees.map((mentee) => (
              <div key={mentee.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    {mentee.first_name[0]}{mentee.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{mentee.first_name} {mentee.last_name}</p>
                  <p className="text-sm text-gray-500">{mentee.email}</p>
                </div>
                <Badge variant="outline">
                  Available
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVMenteesList;
