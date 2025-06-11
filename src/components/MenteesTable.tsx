
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Mentee } from '@/hooks/useMentees';
import { JobApplication } from '@/types/jobApplications';
import { useMenteeProgress } from '@/hooks/useMenteeProgress';
import { getMenteeApplications, getMenteeCVFiles } from '@/utils/menteeTableUtils';
import MenteeInfoCell from './MenteeInfoCell';
import MenteeProgressCell from './MenteeProgressCell';
import MenteeApplicationsCell from './MenteeApplicationsCell';
import MenteeCVFilesCell from './MenteeCVFilesCell';
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
    const data = progressData.find(p => p.menteeId === menteeId);
    return data || {
      overallProgress: 0,
      completedModules: 0,
      totalModules: 5,
      hasRealData: false,
      emailConfirmed: false
    };
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
              const menteeApplications = getMenteeApplications(mentee.id, applications);
              const menteeCVFiles = getMenteeCVFiles(mentee.id, cvFiles);
              const progress = getMenteeProgress(mentee.id);

              return (
                <TableRow key={mentee.id}>
                  <TableCell>
                    <MenteeInfoCell mentee={mentee} />
                  </TableCell>
                  
                  <TableCell>
                    <MenteeProgressCell 
                      overallProgress={progress.overallProgress}
                      completedModules={progress.completedModules}
                      totalModules={progress.totalModules}
                      hasRealData={progress.hasRealData}
                      emailConfirmed={progress.emailConfirmed}
                    />
                  </TableCell>

                  <TableCell>
                    <MenteeApplicationsCell applications={menteeApplications} />
                  </TableCell>

                  <TableCell>
                    <MenteeCVFilesCell cvFiles={menteeCVFiles} />
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
      </CardContent>
    </Card>
  );
};

export default MenteesTable;
