
import { useState, useEffect } from 'react';

interface TimeBasedGreeting {
  greeting: string;
  timeZone: string;
  currentTime: Date;
}

export const useTimeBasedGreeting = (firstName: string): TimeBasedGreeting => {
  const [greeting, setGreeting] = useState('Good morning');
  const [timeZone, setTimeZone] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const getGreetingByHour = (hour: number): string => {
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hour = now.getHours();
      
      setCurrentTime(now);
      setTimeZone(userTimeZone);
      setGreeting(getGreetingByHour(hour));
    };

    // Update immediately
    updateGreeting();

    // Update every minute to catch time changes
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    greeting: `${greeting}, ${firstName}`,
    timeZone,
    currentTime
  };
};
