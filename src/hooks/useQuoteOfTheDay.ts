
import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const inspirationalQuotes: Quote[] = [
  { text: "Faith is taking the first step even when you don't see the whole staircase.", author: "Martin Luther King Jr." },
  { text: "In the depths of winter, I finally learned that there was in me an invincible summer.", author: "Albert Camus" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "Everything you need is inside you – you just need to access it.", author: "Buddha" },
  { text: "Trust in dreams, for in them is hidden the gate to eternity.", author: "Khalil Gibran" },
  { text: "The quieter you become, the more able you are to hear.", author: "Rumi" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "The best way to find out if you can trust somebody is to trust them.", author: "Ernest Hemingway" },
  { text: "Faith consists in believing when it is beyond the power of reason to believe.", author: "Voltaire" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi" },
  { text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" },
  { text: "What we plant in the soil of contemplation, we shall reap in the harvest of action.", author: "Meister Eckhart" },
  { text: "The privilege of a lifetime is being who you are.", author: "Joseph Campbell" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "Yesterday is history, tomorrow is a mystery, today is a gift, which is why we call it the present.", author: "Bill Keane" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.", author: "Christian D. Larson" },
  { text: "Your purpose in life is to find your purpose and give your whole heart and soul to it.", author: "Buddha" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Hope is the thing with feathers that perches in the soul and sings the tune without the words and never stops at all.", author: "Emily Dickinson" },
  { text: "Trust the process. Your time is coming. Just do the work and the results will handle themselves.", author: "Tony Gaskins" },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "The present moment is the only time over which we have dominion.", author: "Thich Nhat Hanh" },
  { text: "Inner peace begins the moment you choose not to allow another person or event to control your emotions.", author: "Pema Chödrön" },
  { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins" }
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
    const quoteIndex = Math.abs(hash) % inspirationalQuotes.length;
    setTodaysQuote(inspirationalQuotes[quoteIndex]);
  }, []);

  return { todaysQuote };
};
