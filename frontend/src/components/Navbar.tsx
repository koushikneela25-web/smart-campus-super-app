import React from 'react';
import { Menu, Shield, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './Badge';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user } = useAuth();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5" />;
      case 'FACULTY':
        return <Briefcase className="w-3.5 h-3.5" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5" />;
    }
  };

  const getRoleBadgeVariant = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'danger' as const;
      case 'FACULTY':
        return 'info' as const;
      default:
        return 'success' as const;
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-white">Smart Campus Portal</h2>
          <p className="text-[11px] text-slate-400 hidden sm:block">Unified Academic & Campus Operations</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <Badge variant={getRoleBadgeVariant()} size="sm" className="gap-1 hidden sm:inline-flex">
            {getRoleIcon()}
            <span>{user.role}</span>
          </Badge>
        )}

        <NotificationDropdown />

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-none">{user?.fullName}</span>
            <span className="text-[10px] text-slate-400 leading-none mt-1">{user?.collegeId}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
