
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, Trash2, Loader2 } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface EducationSectionProps {
  educations: Education[];
  onAddEducation: () => void;
  onDeleteEducation: (id: string) => void;
  loading?: boolean;
}

const EducationSection = ({ educations, onAddEducation, onDeleteEducation, loading }: EducationSectionProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          <span>Education</span>
        </CardTitle>
        <Button 
          variant="outline" 
          className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
          onClick={onAddEducation}
          disabled={loading}
        >
          Add Education
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading education records...</span>
          </div>
        ) : educations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No education added yet. Click "Add Education" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div key={edu.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                    <p className="text-indigo-600 font-medium">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteEducation(edu.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
