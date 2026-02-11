
import React, { useState, useEffect } from 'react';
import { ViewState, PasswordEntry } from './types';
import { storageService } from './services/storageService';
import SetupScreen from './components/SetupScreen';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!storageService.hasMasterKey()) {
      setView('SETUP');
    } else if (!isAuthenticated) {
      setView('LOGIN');
    } else {
      setView('DASHBOARD');
    }
  }, [isAuthenticated]);

  const handleSetupComplete = (masterKey: string) => {
    storageService.setMasterKey(masterKey);
    setIsAuthenticated(true);
  };

  const handleLogin = (masterKey: string): boolean => {
    if (storageService.validateMasterKey(masterKey)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-0 md:p-4">
      <div className="w-full max-w-md h-[100dvh] md:h-[800px] bg-white md:rounded-3xl md:shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col">
        {view === 'SETUP' && (
          <SetupScreen onComplete={handleSetupComplete} />
        )}
        {view === 'LOGIN' && (
          <LoginScreen onLogin={handleLogin} />
        )}
        {view === 'DASHBOARD' && (
          <Dashboard onLogout={() => setIsAuthenticated(false)} />
        )}
      </div>
    </div>
  );
};

export default App;
