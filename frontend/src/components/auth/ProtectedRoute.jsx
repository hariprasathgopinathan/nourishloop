import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function ProtectedRoute({ children, fallbackAction }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-500 max-w-md mb-8">
          You must be logged in to view this page. This area is protected by Firebase Authentication.
        </p>
        {fallbackAction && (
          <Button onClick={fallbackAction}>Go to Login</Button>
        )}
      </div>
    );
  }

  return children;
}
