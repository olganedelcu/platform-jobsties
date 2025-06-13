
import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const motivationalQuotes: Quote[] = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Your career is a marathon, not a sprint. Pace yourself and enjoy the journey.", author: "Anonymous" },
  { text: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success. Don't let it stop you.", author: "Anonymous" },
  { text: "It's fine to celebrate success but it is more important to heed the lessons of failure.", author: "Bill Gates" },
  { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },
  { text: "Take up one idea. Make that one idea your life - think of it, dream of it, live on that idea.", author: "Swami Vivekananda" },
  { text: "All our dreams can come true if we have the courage to pursue them.", author: "Walt Disney" },
  { text: "Good things happen to those who hustle.", author: "Anais Nin" },
  { text: "Don't be distracted by criticism. Remember - the only taste of success some people get is to take a bite out of you.", author: "Zig Ziglar" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "I'm not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
  { text: "Every child is an artist. The problem is how to remain an artist once he grows up.", author: "Pablo Picasso" },
  { text: "You can never cross the ocean until you have the courage to lose sight of the shore.", author: "Christopher Columbus" },
  { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" }
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
    const quoteIndex = Math.abs(hash) % motivationalQuotes.length;
    setTodaysQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return { todaysQuote };
};
