import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-xl">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mt-2 mb-8 leading-relaxed">
        The campus page or URL you requested does not exist or may have been relocated.
      </p>
      <Link to="/">
        <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
