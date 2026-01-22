
import React from 'react';
import { Link } from 'react-router-dom';

const CoachNavigationHeader = () => {
  return (
    <div className="flex items-center">
      <Link to="/coach/mentees" className="flex items-center space-x-2">
        <img
          src="/assets/logo-white.png"
          alt="Logo"
          className="h-8 w-auto"
        />
      </Link>
    </div>
  );
};

export default CoachNavigationHeader;
