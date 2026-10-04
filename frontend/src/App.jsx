import { useState } from 'react';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppContent() {
  const { user, profileError, logout } = useAuth();
  
  // 'none' | 'donor' | 'ngo'
  const [activeRole, setActiveRole] = useState('none');
  const [authIntent, setAuthIntent] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setActiveRole('none');
    }
  };

  if (profileError && user && activeRole !== 'none') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Profile Link Required</h2>
          <p className="text-gray-600 mb-8">{profileError}</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Temporarily, we just use activeRole to decide the view.
  // In the future, activeRole will be derived from MongoDB.
  if (activeRole === 'donor') {
    return (
      <ProtectedRoute fallbackAction={() => setActiveRole('none')}>
        <DonorDashboard onLogout={handleLogout} />
      </ProtectedRoute>
    );
  }

  if (activeRole === 'ngo') {
    return (
      <ProtectedRoute fallbackAction={() => setActiveRole('none')}>
        <NgoDashboard onLogout={handleLogout} />
      </ProtectedRoute>
    );
  }

  if (authIntent) {
    return (
      <AuthPage 
        intentRole={authIntent} 
        onBack={() => setAuthIntent(null)} 
        onSuccess={(role) => {
          setAuthIntent(null);
          setActiveRole(role);
        }} 
      />
    );
  }

  return (
    <LandingPage 
      onLoginDonor={() => setAuthIntent('donor')} 
      onLoginNgo={() => setAuthIntent('ngo')} 
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

