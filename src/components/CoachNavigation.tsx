
import React, { useState } from 'react';
import CoachNavigationHeader from './navigation/CoachNavigationHeader';
import CoachDesktopNavigation from './navigation/CoachDesktopNavigation';
import CoachUserProfile from './navigation/CoachUserProfile';
import CoachMobileMenuToggle from './navigation/CoachMobileMenuToggle';
import CoachMobileNavigation from './navigation/CoachMobileNavigation';

interface CoachNavigationProps {
  user: any;
  onSignOut: () => void;
}

const CoachNavigation = ({ user, onSignOut }: CoachNavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <CoachNavigationHeader />

          {/* Desktop Navigation */}
          <CoachDesktopNavigation />
          
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
        <CoachMobileNavigation 
          user={user}
          onSignOut={onSignOut}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default CoachNavigation;
