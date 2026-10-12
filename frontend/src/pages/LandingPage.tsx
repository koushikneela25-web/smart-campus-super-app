import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import {
  QrCode,
  CalendarDays,
  CalendarCheck2,
  Search,
  Bell,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (identifier: string, pass: string, targetPath: string) => {
    try {
      await login(identifier, pass);
      navigate(targetPath);
    } catch (err: any) {
      alert('Demo login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 px-6 sm:px-12 flex items-center justify-between border-b border-slate-800/80 bg-[#0B132B]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block">Smart Campus</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400 block -mt-1">Super App Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              onClick={() => {
                if (user?.role === 'ADMIN') navigate('/admin');
                else if (user?.role === 'FACULTY') navigate('/faculty');
                else navigate('/student');
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Go to {user?.role} Dashboard
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:py-28 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Complete Java 21 + Spring Boot 3 + React Full-Stack Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight sm:leading-none">
          Unified Digital Operations for <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Smart University Campuses</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Manage dynamic QR & geofenced attendance, academic timetables with conflict detection, campus event RSVP, lost & found claims, and role-based analytics — all in one unified system.
        </p>

        {/* Demo One-Click Sign-in Box */}
        <div className="mt-10 p-6 glass-panel rounded-2xl border border-slate-700/80 max-w-2xl w-full text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">⚡ Evaluator Quick-Start One-Click Demo Logins</p>
          <p className="text-xs text-slate-400 mb-4">Click any profile below to log in immediately with real seeded MySQL credentials:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleQuickDemoLogin('student.rahul@campus.edu', 'Student@123', '/student')}
              className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition-all text-left group"
            >
              <span className="block text-xs font-bold text-white group-hover:text-blue-400">Student Portal</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">student.rahul@campus.edu</span>
              <span className="block text-[10px] text-teal-400 mt-2 font-mono">Pass: Student@123</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('prof.sharma@campus.edu', 'Faculty@123', '/faculty')}
              className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition-all text-left group"
            >
              <span className="block text-xs font-bold text-white group-hover:text-teal-400">Faculty Portal</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">prof.sharma@campus.edu</span>
              <span className="block text-[10px] text-teal-400 mt-2 font-mono">Pass: Faculty@123</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('admin@campus.edu', 'Admin@123', '/admin')}
              className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition-all text-left group"
            >
              <span className="block text-xs font-bold text-white group-hover:text-rose-400">Admin Console</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">admin@campus.edu</span>
              <span className="block text-[10px] text-teal-400 mt-2 font-mono">Pass: Admin@123</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="px-6 py-16 bg-[#0B132B]/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Full-Stack University Architecture</h2>
            <p className="text-sm text-slate-400 mt-2">Enterprise-grade layers separating client rendering, REST APIs, and relational persistence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-4 border border-blue-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Frontend Web Layer</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                React 18, TypeScript, Vite, Tailwind CSS, Lucide React, and TanStack Query. Prepared for Vercel deployment with client-side SPA routing rewrites.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-4 border border-teal-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Spring Boot 3 REST API</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Java 21, Spring Security with stateless JWT tokens, BCrypt password hashing, Spring Data JPA, and Flyway database migrations. Dockerized for Railway.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-4 border border-indigo-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">MySQL Database Layer</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Strict MySQL (<code className="text-teal-300">smart_campus_db</code>) on 127.0.0.1:3306 with transactional conflict detection and relational integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Core Modules Included</h2>
          <p className="text-sm text-slate-400 mt-2">Engineered with real business logic and relational database tables.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 glass-panel rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">QR & Geofence Attendance</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dynamic expiring QR tokens, duplicate check-in prevention, optional GPS distance calculation, and CSV report exports.
              </p>
            </div>
          </div>

          <div className="p-5 glass-panel rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Timetable Management</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Weekly & daily class scheduling with automatic backend validation for faculty, room, and section collisions.
              </p>
            </div>
          </div>

          <div className="p-5 glass-panel rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Campus Events & RSVP</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Event registration with real-time capacity locking, duplicate RSVP prevention, category filters, and confirmation alerts.
              </p>
            </div>
          </div>

          <div className="p-5 glass-panel rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Campus Lost & Found</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Categorized lost/found reporting, ownership claim verification workflow, and resolution status moderation.
              </p>
            </div>
          </div>

          <div className="p-5 glass-panel rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">In-App Notifications</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Database-backed user notifications, unread badges, mark-read actions, and university broadcast announcements.
              </p>
            </div>
          </div>

          <div className="p-5 glass-panel rounded-xl border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Security & Audit Logs</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Role-based access control, BCrypt password hashing, rate protection, and persistent audit logging of all sensitive operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-slate-800/80 bg-[#0B132B]/80 text-center text-xs text-slate-500">
        <p>Smart Campus Super App — Individual BTech Engineering Full-Stack Project</p>
        <p className="mt-1">Java 21 Spring Boot REST API &bull; React + TypeScript Frontend &bull; MySQL Database</p>
      </footer>
    </div>
  );
};
