
import { useEffect } from 'react';

export const useScrollPosition = (storageKey: string) => {
  // Restore scroll position on mount
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem(storageKey);
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);
    }
  }, [storageKey]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      try {
        localStorage.setItem(storageKey, window.scrollY.toString());
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Failed to clean up scroll position:', error);
      }
    };
  }, [storageKey]);
};
