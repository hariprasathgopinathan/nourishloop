import { useState } from 'react';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppContent() {
  const { user, logout } = useAuth();
  
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

