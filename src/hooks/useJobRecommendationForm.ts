
import { useState } from 'react';
import { format, startOfWeek, addWeeks } from 'date-fns';

export interface JobRecommendation {
  id: string;
  jobTitle: string;
  jobLink: string;
  companyName: string;
  description: string;
}

export const useJobRecommendationForm = () => {
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [weekStartDate, setWeekStartDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([
    { id: '1', jobTitle: '', jobLink: '', companyName: '', description: '' }
  ]);

  const addNewRecommendation = () => {
    const newId = Date.now().toString();
    setJobRecommendations(prev => [
      ...prev,
      { id: newId, jobTitle: '', jobLink: '', companyName: '', description: '' }
    ]);
  };

  const removeRecommendation = (id: string) => {
    if (jobRecommendations.length > 1) {
      setJobRecommendations(prev => prev.filter(rec => rec.id !== id));
    }
  };

  const updateRecommendation = (id: string, field: keyof Omit<JobRecommendation, 'id'>, value: string) => {
    setJobRecommendations(prev => prev.map(rec => 
      rec.id === id ? { ...rec, [field]: value } : rec
    ));
  };

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev => 
      prev.includes(menteeId)
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  const resetForm = () => {
    setJobRecommendations([{ id: '1', jobTitle: '', jobLink: '', companyName: '', description: '' }]);
    setSelectedMentees([]);
    setWeekStartDate(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  };

  const getWeekOptions = () => {
    const options = [];
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Current week and next 3 weeks
    for (let i = 0; i < 4; i++) {
      const week = addWeeks(currentWeek, i);
      const weekStr = format(week, 'yyyy-MM-dd');
      const displayStr = format(week, 'MMM dd, yyyy');
      options.push({ value: weekStr, label: `Week of ${displayStr}` });
    }
    
    return options;
  };

  const getValidRecommendations = () => {
    return jobRecommendations.filter(rec => 
      rec.jobTitle.trim() && rec.jobLink.trim() && rec.companyName.trim()
    );
  };

  return {
    selectedMentees,
    setSelectedMentees,
    toggleMenteeSelection,
    weekStartDate,
    setWeekStartDate,
    jobRecommendations,
    addNewRecommendation,
    removeRecommendation,
    updateRecommendation,
    resetForm,
    getWeekOptions,
    getValidRecommendations
  };
};
