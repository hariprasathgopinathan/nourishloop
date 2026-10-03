import { useState } from 'react';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import LandingPage from './pages/LandingPage';

function App() {
  // 'none' | 'donor' | 'ngo'
  const [activeRole, setActiveRole] = useState('none');

  if (activeRole === 'donor') {
    return <DonorDashboard onLogout={() => setActiveRole('none')} />;
  }

  if (activeRole === 'ngo') {
    return <NgoDashboard onLogout={() => setActiveRole('none')} />;
  }

  return (
    <LandingPage 
      onLoginDonor={() => setActiveRole('donor')} 
      onLoginNgo={() => setActiveRole('ngo')} 
    />
  );
}

export default App;
