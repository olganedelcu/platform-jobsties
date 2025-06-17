
import React, { memo } from 'react';

const TrackerHeader = memo(() => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Job Application Tracker</h1>
    <p className="text-gray-600 mt-2">Track and manage your job applications</p>
  </div>
));

TrackerHeader.displayName = 'TrackerHeader';

export default TrackerHeader;
