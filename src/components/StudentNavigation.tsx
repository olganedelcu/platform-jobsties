import React, { useState } from 'react';
import CoachNavigationHeader from './navigation/CoachNavigationHeader';
import StudentDesktopNavigation from './navigation/StudentDesktopNavigation';
import CoachUserProfile from './navigation/CoachUserProfile';
import CoachMobileMenuToggle from './navigation/CoachMobileMenuToggle';
import StudentMobileNavigation from './navigation/StudentMobileNavigation';

interface StudentNavigationProps {
  user: any;
  onSignOut: () => void;
}

const StudentNavigation = ({ user, onSignOut }: StudentNavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <CoachNavigationHeader />

          {/* Desktop Navigation */}
          <StudentDesktopNavigation />
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <CoachUserProfile user={user} onSignOut={onSignOut} />
          </div>

          {/* Mobile menu button */}
          <CoachMobileMenuToggle 
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <StudentMobileNavigation 
          user={user}
          onSignOut={onSignOut}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default StudentNavigation;
