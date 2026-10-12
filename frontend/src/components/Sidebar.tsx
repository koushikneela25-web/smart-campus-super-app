import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  QrCode,
  CalendarDays,
  CalendarCheck2,
  Search,
  Bell,
  Megaphone,
  User,
  Users,
  GraduationCap,
  FileSpreadsheet,
  ShieldAlert,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const studentLinks = [
    { to: '/student', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/student/attendance', label: 'My Attendance', icon: <QrCode className="w-4 h-4" /> },
    { to: '/student/timetable', label: 'Timetable', icon: <CalendarDays className="w-4 h-4" /> },
    { to: '/student/events', label: 'Campus Events', icon: <CalendarCheck2 className="w-4 h-4" /> },
    { to: '/student/lost-found', label: 'Lost & Found', icon: <Search className="w-4 h-4" /> },
    { to: '/announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { to: '/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const facultyLinks = [
    { to: '/faculty', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/faculty/attendance', label: 'Start Attendance', icon: <QrCode className="w-4 h-4" /> },
    { to: '/faculty/timetable', label: 'Assigned Schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { to: '/faculty/events', label: 'Manage Events', icon: <CalendarCheck2 className="w-4 h-4" /> },
    { to: '/student/lost-found', label: 'Lost & Found', icon: <Search className="w-4 h-4" /> },
    { to: '/announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { to: '/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Analytics Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/admin/users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/academics', label: 'Academics & Rooms', icon: <GraduationCap className="w-4 h-4" /> },
    { to: '/admin/timetable', label: 'Timetable Builder', icon: <CalendarDays className="w-4 h-4" /> },
    { to: '/admin/attendance', label: 'Attendance Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { to: '/admin/lost-found', label: 'Lost & Found Desk', icon: <Search className="w-4 h-4" /> },
    { to: '/admin/announcements', label: 'Publish Broadcasts', icon: <Megaphone className="w-4 h-4" /> },
    { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/profile', label: 'Admin Profile', icon: <User className="w-4 h-4" /> },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'FACULTY' ? facultyLinks : studentLinks;

  return (
    <aside className="w-64 h-full flex flex-col bg-[#0B132B] border-r border-slate-800/80 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-blue-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">Smart Campus</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-teal-400">Super App</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {role} Workspace
        </div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/student' || link.to === '/faculty' || link.to === '/admin'}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070D1E]/40">
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.collegeId}</p>
          </div>
          <button
            onClick={() => logout()}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
