
import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const motivationalMessages: Quote[] = [
  { text: "One day more, one day closer to that offer!", author: "Your JobsTies Team" },
  { text: "Every application is a step forward. Keep going!", author: "Your JobsTies Team" },
  { text: "Today's the perfect day to update your profile and stand out!", author: "Your JobsTies Team" },
  { text: "Your dream job is out there waiting. Let's find it together!", author: "Your JobsTies Team" },
  { text: "Small steps today, big opportunities tomorrow!", author: "Your JobsTies Team" },
  { text: "Ready to make today count? Your next opportunity awaits!", author: "Your JobsTies Team" },
  { text: "Every skill you build brings you closer to success!", author: "Your JobsTies Team" },
  { text: "Don't just wait for opportunities – create them by staying active!", author: "Your JobsTies Team" },
  { text: "Your consistency today becomes your success tomorrow!", author: "Your JobsTies Team" },
  { text: "Time to turn those career goals into career wins!", author: "Your JobsTies Team" },
  { text: "The best time to network was yesterday. The second best time is now!", author: "Your JobsTies Team" },
  { text: "Your future self will thank you for the effort you put in today!", author: "Your JobsTies Team" },
  { text: "Progress over perfection – every action counts!", author: "Your JobsTies Team" },
  { text: "Today's preparation is tomorrow's advantage!", author: "Your JobsTies Team" },
  { text: "Stay active, stay visible, stay unstoppable!", author: "Your JobsTies Team" },
  { text: "Your next breakthrough could be just one application away!", author: "Your JobsTies Team" },
  { text: "Invest in yourself today – complete a course module!", author: "Your JobsTies Team" },
  { text: "Great careers are built one intentional action at a time!", author: "Your JobsTies Team" },
  { text: "Your dedication today shapes your opportunities tomorrow!", author: "Your JobsTies Team" },
  { text: "Ready to level up? Let's make today productive!", author: "Your JobsTies Team" },
  { text: "Success loves consistency. What will you accomplish today?", author: "Your JobsTies Team" },
  { text: "Every expert was once a beginner who refused to give up!", author: "Your JobsTies Team" },
  { text: "Your career transformation starts with today's actions!", author: "Your JobsTies Team" },
  { text: "Don't wait for the perfect moment – make this moment perfect!", author: "Your JobsTies Team" },
  { text: "You're not just finding a job, you're building a career!", author: "Your JobsTies Team" },
  { text: "Active job seekers get the best opportunities. Be active!", author: "Your JobsTies Team" },
  { text: "Your persistence today creates your success story tomorrow!", author: "Your JobsTies Team" },
  { text: "Ready to shine? Update that profile and show your best self!", author: "Your JobsTies Team" },
  { text: "Every day is a chance to get closer to your ideal role!", author: "Your JobsTies Team" },
  { text: "Your journey matters as much as your destination. Keep moving!", author: "Your JobsTies Team" },
  { text: "Today's effort is tomorrow's advantage. Let's get started!", author: "Your JobsTies Team" }
];

export const useQuoteOfTheDay = () => {
  const [todaysQuote, setTodaysQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Get today's date as a seed for consistent daily quotes
    const today = new Date();
    const dateString = today.toDateString();
    
    // Create a simple hash from the date string to get a consistent index
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get a valid index
    const quoteIndex = Math.abs(hash) % motivationalMessages.length;
    setTodaysQuote(motivationalMessages[quoteIndex]);
  }, []);

  return { todaysQuote };
};
