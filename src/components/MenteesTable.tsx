
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, MessageSquare } from 'lucide-react';
import { Mentee } from '@/hooks/useMentees';
import { JobApplication } from '@/types/jobApplications';
import { useMenteeProgress } from '@/hooks/useMenteeProgress';
import MenteeNotesCell from './MenteeNotesCell';

interface CVFile {
  id: string;
  file_name: string;
  mentee_id: string;
}

interface MenteesTableProps {
  mentees: Mentee[];
  applications: JobApplication[];
  cvFiles: CVFile[];
  updateNote: (menteeId: string, notes: string) => Promise<void>;
  getNoteForMentee: (menteeId: string) => string;
}

const MenteesTable = ({ mentees, applications, cvFiles, updateNote, getNoteForMentee }: MenteesTableProps) => {
  const menteeIds = mentees.map(m => m.id);
  const { progressData } = useMenteeProgress(menteeIds);

  const getMenteeProgress = (menteeId: string) => {
    return progressData.find(p => p.menteeId === menteeId) || {
      overallProgress: 0,
      completedModules: 0,
      totalModules: 5
    };
  };

  const getMenteeApplications = (menteeId: string) => {
    return applications.filter(app => app.mentee_id === menteeId);
  };

  const getMenteeCVFiles = (menteeId: string) => {
    return cvFiles.filter(cv => cv.mentee_id === menteeId);
  };

  const getStatusCounts = (menteeApplications: JobApplication[]) => {
    const counts = {
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    };

    menteeApplications.forEach(app => {
      if (app.application_status === 'applied') counts.applied++;
      else if (app.application_status === 'interview') counts.interview++;
      else if (app.application_status === 'offer') counts.offer++;
      else if (app.application_status === 'rejected') counts.rejected++;
    });

    return counts;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mentee</TableHead>
              <TableHead>Course Progress</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>CV Files</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentees.map((mentee) => {
              const menteeApplications = getMenteeApplications(mentee.id);
              const menteeCVFiles = getMenteeCVFiles(mentee.id);
              const statusCounts = getStatusCounts(menteeApplications);
              const progress = getMenteeProgress(mentee.id);

              return (
                <TableRow key={mentee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                          {mentee.first_name[0]}{mentee.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {mentee.first_name} {mentee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{mentee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{progress.overallProgress}%</span>
                        <span className="text-xs text-gray-500">
                          {progress.completedModules}/{progress.totalModules} modules
                        </span>
                      </div>
                      <Progress value={progress.overallProgress} className="h-2" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        {menteeApplications.length} total
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {statusCounts.applied > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {statusCounts.applied} Applied
                          </Badge>
                        )}
                        {statusCounts.interview > 0 && (
                          <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                            {statusCounts.interview} Interview
                          </Badge>
                        )}
                        {statusCounts.offer > 0 && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            {statusCounts.offer} Offer
                          </Badge>
                        )}
                        {statusCounts.rejected > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {statusCounts.rejected} Rejected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{menteeCVFiles.length} file{menteeCVFiles.length !== 1 ? 's' : ''}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <MenteeNotesCell
                      menteeId={mentee.id}
                      initialNotes={getNoteForMentee(mentee.id)}
                      onUpdateNote={updateNote}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MenteesTable;
