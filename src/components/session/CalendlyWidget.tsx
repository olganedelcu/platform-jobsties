
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface CalendlyWidgetProps {
  onBack: () => void;
  onCancel: () => void;
}

const CalendlyWidget = ({ onBack, onCancel }: CalendlyWidgetProps) => {
  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Calendly JavaScript
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Calendly badge widget for CV Review
      if (window.Calendly) {
        window.Calendly.initBadgeWidget({ 
          url: 'https://calendly.com/ana-jobsties/review-cv', 
          text: 'Schedule CV Review', 
          color: '#0069ff', 
          textColor: '#ffffff' 
        });
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span>Schedule a CV Review Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Back to Session Types
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">CV Review & LinkedIn Optimization</h3>
              <p className="text-blue-700 text-sm mb-3">
                Schedule your CV review and LinkedIn optimization session with Ana using Calendly below.
              </p>
            </div>
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/ana-jobsties/cv-linkedin" 
              style={{ minWidth: '320px', height: '600px' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendlyWidget;
