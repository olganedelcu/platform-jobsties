
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Mentee } from '@/hooks/useMentees';
import { JobApplication } from '@/types/jobApplications';
import { getMenteeApplications, getMenteeCVFiles } from '@/utils/menteeTableUtils';
import MenteeInfoCell from './MenteeInfoCell';
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
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mentee</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>CV Files</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentees.map((mentee) => {
              const menteeApplications = getMenteeApplications(mentee.id, applications);
              const menteeCVFiles = getMenteeCVFiles(mentee.id, cvFiles);

              return (
                <TableRow key={mentee.id}>
                  <TableCell>
                    <MenteeInfoCell mentee={mentee} />
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
