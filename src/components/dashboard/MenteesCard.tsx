
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface MenteesCardProps {
  mentees: Mentee[];
  loading: boolean;
  onViewAll: () => void;
}

const MenteesCard = ({ mentees, loading, onViewAll }: MenteesCardProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>My Mentees</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500">Loading mentees...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedMentees = mentees.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>My Mentees</span>
          </CardTitle>
          <Badge variant="outline">
            {mentees.length} assigned
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {mentees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No assigned mentees</p>
            <p className="text-sm text-gray-400">Contact your administrator to get mentees assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {displayedMentees.map((mentee) => (
                <div key={mentee.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm">
                      {mentee.first_name[0]}{mentee.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {mentee.first_name} {mentee.last_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{mentee.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {mentees.length > 3 && (
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500 text-center mb-3">
                  +{mentees.length - 3} more mentee{mentees.length - 3 !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={onViewAll}
            >
              View All Mentees
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteesCard;
