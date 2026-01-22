
import { useEffect, useCallback } from 'react';

export const usePerformanceOptimization = () => {
  // Preload critical resources
  const preloadResources = useCallback(() => {
    // Preload commonly used images or icons
    const imageUrls = [
      '/assets/favicon.png'
    ];

    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  // Optimize scroll performance
  const optimizeScrolling = useCallback(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Any scroll-related optimizations can go here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Debounce function for search and form inputs
  const debounce = useCallback(<T extends unknown[]>(func: (...args: T) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Throttle function for high-frequency events
  const throttle = useCallback(<T extends unknown[]>(func: (...args: T) => void, delay: number) => {
    let lastCall = 0;
    return (...args: T) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }, []);

  useEffect(() => {
    preloadResources();
    const cleanup = optimizeScrolling();
    
    return cleanup;
  }, [preloadResources, optimizeScrolling]);

  return {
    debounce,
    throttle,
    preloadResources
  };
};
