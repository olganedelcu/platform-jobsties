
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MenteeNameMap {
  [menteeId: string]: string;
}

export const useMenteeNames = (menteeIds: string[]) => {
  const [menteeNames, setMenteeNames] = useState<MenteeNameMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenteeNames = async () => {
      if (menteeIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', menteeIds);

        if (error) {
          console.error('Error fetching mentee names:', error);
          return;
        }

        const nameMap: MenteeNameMap = {};
        data?.forEach(profile => {
          nameMap[profile.id] = `${profile.first_name} ${profile.last_name}`;
        });

        setMenteeNames(nameMap);
      } catch (error) {
        console.error('Error fetching mentee names:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenteeNames();
  }, [menteeIds]);

  return { menteeNames, loading };
};
