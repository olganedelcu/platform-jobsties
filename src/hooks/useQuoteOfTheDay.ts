
import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const motivationalMessages: Quote[] = [
  { text: "One day more, one day closer to that offer!", author: "Keep Going" },
  { text: "Every application is a step forward. Keep going!", author: "Keep Going" },
  { text: "Today's the perfect day to update your profile and stand out!", author: "Keep Going" },
  { text: "Your dream job is out there waiting. Let's find it together!", author: "Keep Going" },
  { text: "Small steps today, big opportunities tomorrow!", author: "Keep Going" },
  { text: "Ready to make today count? Your next opportunity awaits!", author: "Keep Going" },
  { text: "Every skill you build brings you closer to success!", author: "Keep Going" },
  { text: "Don't just wait for opportunities – create them by staying active!", author: "Keep Going" },
  { text: "Your consistency today becomes your success tomorrow!", author: "Keep Going" },
  { text: "Time to turn those career goals into career wins!", author: "Keep Going" },
  { text: "The best time to network was yesterday. The second best time is now!", author: "Keep Going" },
  { text: "Your future self will thank you for the effort you put in today!", author: "Keep Going" },
  { text: "Progress over perfection – every action counts!", author: "Keep Going" },
  { text: "Today's preparation is tomorrow's advantage!", author: "Keep Going" },
  { text: "Stay active, stay visible, stay unstoppable!", author: "Keep Going" },
  { text: "Your next breakthrough could be just one application away!", author: "Keep Going" },
  { text: "Invest in yourself today – complete a course module!", author: "Keep Going" },
  { text: "Great careers are built one intentional action at a time!", author: "Keep Going" },
  { text: "Your dedication today shapes your opportunities tomorrow!", author: "Keep Going" },
  { text: "Ready to level up? Let's make today productive!", author: "Keep Going" },
  { text: "Success loves consistency. What will you accomplish today?", author: "Keep Going" },
  { text: "Every expert was once a beginner who refused to give up!", author: "Keep Going" },
  { text: "Your career transformation starts with today's actions!", author: "Keep Going" },
  { text: "Don't wait for the perfect moment – make this moment perfect!", author: "Keep Going" },
  { text: "You're not just finding a job, you're building a career!", author: "Keep Going" },
  { text: "Live your life with a spirit of excellence.", author: "Keep Going" },
  { text: "Be a \"can do\" person", author: "Keep Going" },
  { text: "Live a big life, be full of vision", author: "Keep Going" },
  { text: "People and places are better because you are there, Be a person who adds value", author: "Keep Going" },
  { text: "What you feed grows - feed your spirit and mind on good things.", author: "Keep Going" },
  { text: "Your persistence today creates your success story tomorrow!", author: "Keep Going" },
  { text: "Ready to shine? Update that profile and show your best self!", author: "Keep Going" },
  { text: "Every day is a chance to get closer to your ideal role!", author: "Keep Going" },
  { text: "Your journey matters as much as your destination. Keep moving!", author: "Keep Going" },
  { text: "Today's effort is tomorrow's advantage. Let's get started!", author: "Keep Going" }
];

export const useQuoteOfTheDay = () => {
  const [todaysQuote, setTodaysQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Create a date-based index to ensure the same quote appears for the entire day
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    // Create a simple hash from the date to get a consistent index
    const dateHash = year * 10000 + month * 100 + day;
    const quoteIndex = dateHash % motivationalMessages.length;
    
    setTodaysQuote(motivationalMessages[quoteIndex]);
  }, []);

  return { todaysQuote };
};
