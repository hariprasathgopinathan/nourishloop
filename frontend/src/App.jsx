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
  const { user, profileError, isProfileMissing, logout, appProfile, loading } = useAuth();

  const [authIntent, setAuthIntent] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-donor"></div>
      </div>
    );
  }

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-xl text-red-600 mb-4 font-semibold">Error Loading Profile</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{profileError}</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300"
        >
          Logout
        </button>
      </div>
    );
  }

  if (isProfileMissing && user) {
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

