
import { useEffect } from 'react';
import { useMenteeDataLoader } from './useMenteeDataLoader';

export interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useMentees = () => {
  const { mentees, loading, fetchMentees } = useMenteeDataLoader();

  useEffect(() => {
    fetchMentees();
  }, []);

  return { mentees, loading, fetchMentees };
};
