
import React from 'react';
import CareerSuccessVisualization from '@/components/CareerSuccessVisualization';
import JobTrackingDashboard from '@/components/JobTrackingDashboard';

const VisualizationSection = () => {
  return (
    <>
      {/* Career Success Visualization */}
      <div className="flex justify-center mb-16">
        <CareerSuccessVisualization />
      </div>

      {/* Job Tracking Dashboard */}
      <div className="flex justify-center">
        <JobTrackingDashboard />
      </div>
    </>
  );
};

export default VisualizationSection;
