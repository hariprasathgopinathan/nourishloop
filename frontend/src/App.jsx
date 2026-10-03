import { useState } from 'react';
import DonorDashboard from './pages/DonorDashboard';
import LandingPage from './pages/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LandingPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DonorDashboard />;
}

export default App;
