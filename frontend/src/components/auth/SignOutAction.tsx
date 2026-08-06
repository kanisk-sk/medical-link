import React from 'react';
import { useClerk } from '@clerk/react';
import { LogOut } from 'lucide-react';
import { Button } from '../common/Button';

export const SignOutAction: React.FC<{ className?: string }> = ({ className }) => {
  const { signOut } = useClerk();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      icon={<LogOut className="w-4 h-4" />}
      className={className}
      onClick={() => signOut({ redirectUrl: '/' })}
    >
      Sign Out
    </Button>
  );
};