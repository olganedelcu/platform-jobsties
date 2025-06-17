
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface CoachMobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CoachMobileMenuToggle = ({ isOpen, onToggle }: CoachMobileMenuToggleProps) => {
  return (
    <div className="md:hidden flex items-center space-x-2">
      <NotificationDropdown />
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default CoachMobileMenuToggle;
