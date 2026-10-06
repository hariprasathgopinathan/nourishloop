import { useState } from 'react';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OnboardingPage from './pages/OnboardingPage';
import MapDemoPage from './pages/MapDemoPage';

function AppContent() {
  const { user, profileError, logout, appProfile } = useAuth();
  
  const [authIntent, setAuthIntent] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (window.location.pathname === '/map-demo') {
    return <MapDemoPage />;
  }

  if (profileError && user) {
    return <OnboardingPage onLogout={handleLogout} onSuccess={() => {
      // The profile is refreshed in OnboardingPage so appProfile will be populated shortly.
      // We don't need to do anything here because AuthContext updates.
    }} />;
  }

  // If user is authenticated and has a profile, show the correct dashboard
  if (user && appProfile) {
    const role = appProfile.role.toLowerCase();
    if (role === 'donor') {
      return (
        <ProtectedRoute fallbackAction={handleLogout}>
          <DonorDashboard onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }
    
    if (role === 'ngo') {
      return (
        <ProtectedRoute fallbackAction={handleLogout}>
          <NgoDashboard onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }
  }

  if (authIntent) {
    return (
      <AuthPage 
        intentRole={authIntent} 
        onBack={() => setAuthIntent(null)} 
        onSuccess={() => {
          setAuthIntent(null);
          // Wait for AuthContext to resolve the profile via subscribeToAuthState
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
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

