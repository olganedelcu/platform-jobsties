
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Briefcase, FileText, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Mentee } from '@/hooks/useMentees';
import { JobApplication } from '@/types/jobApplications';
import { CVFile } from '@/hooks/useCVFiles';
import MenteeNotesCell from '@/components/MenteeNotesCell';
import MenteesEmptyState from '@/components/MenteesEmptyState';
import { getMenteeStats } from '@/utils/menteeStatsHelpers';

interface MenteesTableProps {
  mentees: Mentee[];
  applications: JobApplication[];
  cvFiles: CVFile[];
  updateNote: (menteeId: string, note: string) => void;
  getNoteForMentee: (menteeId: string) => string;
}

const MenteesTable = ({ 
  mentees, 
  applications, 
  cvFiles, 
  updateNote, 
  getNoteForMentee 
}: MenteesTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>All Mentees ({mentees.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mentees.length === 0 ? (
          <MenteesEmptyState type="no-search-results" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Applications</TableHead>
                  <TableHead className="text-center">Active/Interviews</TableHead>
                  <TableHead className="text-center">CV Files</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead className="min-w-[250px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentees.map((mentee) => {
                  const stats = getMenteeStats(mentee.id, applications, cvFiles);
                  const progressPercentage = stats.totalApplications > 0 
                    ? Math.round((stats.interviewStage / stats.totalApplications) * 100) 
                    : 0;
                  
                  return (
                    <TableRow key={mentee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm">
                              {mentee.first_name[0]}{mentee.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {mentee.first_name} {mentee.last_name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{mentee.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-blue-600">{stats.totalApplications}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant={stats.activeApplications > 0 ? "default" : "secondary"} className="text-xs">
                            {stats.activeApplications} Active
                          </Badge>
                          <Badge variant={stats.interviewStage > 0 ? "default" : "outline"} className="text-xs">
                            {stats.interviewStage} Interviews
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <FileText className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-green-600">{stats.cvCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold text-purple-600">{progressPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <MenteeNotesCell
                          menteeId={mentee.id}
                          initialNote={getNoteForMentee(mentee.id)}
                          onSave={updateNote}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteesTable;
