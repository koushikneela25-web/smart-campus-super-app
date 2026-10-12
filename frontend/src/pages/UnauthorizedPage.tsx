import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-xl">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">403 — Access Denied</h1>
      <p className="text-sm text-slate-400 max-w-md mt-2 mb-8 leading-relaxed">
        You do not possess the required permissions or role privileges to view this university resource.
      </p>
      <Link to="/">
        <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Portal Home
        </Button>
      </Link>
    </div>
  );
};
