
import { useEffect, useCallback } from 'react';

export const usePagePerformance = (pageName: string) => {
  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    // Preload commonly used icons and assets
    const criticalAssets = [
      '/lovable-uploads/187c9aad-b772-4ca0-99ab-6bd2978bb1c2.png'
    ];

    criticalAssets.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  // Track page load time
  const trackPageLoad = useCallback(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      console.log(`${pageName} page loaded in ${loadTime.toFixed(2)}ms`);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }
  }, [pageName]);

  useEffect(() => {
    preloadCriticalResources();
    trackPageLoad();
  }, [preloadCriticalResources, trackPageLoad]);

  return {
    preloadCriticalResources
  };
};
