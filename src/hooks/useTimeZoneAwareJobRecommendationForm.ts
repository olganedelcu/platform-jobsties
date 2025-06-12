
import { useState, useEffect } from 'react';
import { format, startOfWeek } from 'date-fns';

interface JobRecommendation {
  id: string;
  jobTitle: string;
  jobLink: string;
  companyName: string;
}

export const useTimeZoneAwareJobRecommendationForm = () => {
  const [selectedMentee, setSelectedMentee] = useState<string>('');
  const [weekStartDate, setWeekStartDate] = useState<string>('');
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([
    { id: '1', jobTitle: '', jobLink: '', companyName: '' }
  ]);
  const [coachTimeZone, setCoachTimeZone] = useState<string>('');

  useEffect(() => {
    // Set coach's timezone and current week
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCoachTimeZone(timeZone);
    
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setWeekStartDate(format(currentWeekStart, 'yyyy-MM-dd'));
  }, []);

  const addNewRecommendation = () => {
    const newRec = {
      id: Date.now().toString(),
      jobTitle: '',
      jobLink: '',
      companyName: ''
    };
    setJobRecommendations([...jobRecommendations, newRec]);
  };

  const removeRecommendation = (id: string) => {
    if (jobRecommendations.length > 1) {
      setJobRecommendations(jobRecommendations.filter(rec => rec.id !== id));
    }
  };

  const updateRecommendation = (id: string, field: keyof JobRecommendation, value: string) => {
    setJobRecommendations(jobRecommendations.map(rec => 
      rec.id === id ? { ...rec, [field]: value } : rec
    ));
  };

  const resetForm = () => {
    setSelectedMentee('');
    setJobRecommendations([{ id: '1', jobTitle: '', jobLink: '', companyName: '' }]);
    // Reset to current week
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setWeekStartDate(format(currentWeekStart, 'yyyy-MM-dd'));
  };

  const getWeekOptions = () => {
    const options = [];
    const today = new Date();
    
    // Current week
    const currentWeek = startOfWeek(today, { weekStartsOn: 1 });
    options.push({
      value: format(currentWeek, 'yyyy-MM-dd'),
      label: `This Week (${format(currentWeek, 'MMM dd, yyyy')})`
    });
    
    // Next 3 weeks
    for (let i = 1; i <= 3; i++) {
      const futureWeek = new Date(currentWeek);
      futureWeek.setDate(futureWeek.getDate() + (i * 7));
      options.push({
        value: format(futureWeek, 'yyyy-MM-dd'),
        label: `Week of ${format(futureWeek, 'MMM dd, yyyy')}`
      });
    }
    
    return options;
  };

  const getValidRecommendations = () => {
    return jobRecommendations.filter(rec => 
      rec.jobTitle.trim() && rec.jobLink.trim() && rec.companyName.trim()
    );
  };

  return {
    selectedMentee,
    setSelectedMentee,
    weekStartDate,
    setWeekStartDate,
    jobRecommendations,
    addNewRecommendation,
    removeRecommendation,
    updateRecommendation,
    resetForm,
    getWeekOptions,
    getValidRecommendations,
    coachTimeZone
  };
};
