import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/Admin';
import { LearningArea } from './pages/Learning';
import { ChatArea } from './pages/Chat';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { storageService } from './services/storageService';
import { User, UserRole } from './types';

// Mock routing using state since we can't use React Router easily in this environment
type Page = 'dashboard' | 'admin' | 'learning' | 'chat' | 'login' | 'onboarding';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('login');

  useEffect(() => {
    // Initialize DB
    storageService.init();
    
    // Check for existing session
    const user = storageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setActivePage('dashboard');
    }
  }, []);

  const handleLogin = (username: string) => {
    const user = storageService.login(username);
    if (user) {
      setCurrentUser(user);
      setActivePage('dashboard');
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setActivePage('login');
  };

  const handleNavigation = (page: string) => {
    setActivePage(page as Page);
  };

  // Render Logic
  if (activePage === 'login') {
    return <Login onLogin={handleLogin} onStartOnboarding={() => setActivePage('onboarding')} />;
  }

  if (activePage === 'onboarding') {
    return <Onboarding onComplete={handleLogin} onCancel={() => setActivePage('login')} />;
  }

  if (!currentUser) return null;

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar 
        user={currentUser} 
        activePage={activePage} 
        onNavigate={handleNavigation} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 ml-64 p-4 md:p-6 overflow-y-auto h-screen">
        {activePage === 'dashboard' && <Dashboard user={currentUser} onNavigate={handleNavigation} />}
        {activePage === 'admin' && currentUser.role === UserRole.ADMIN && <AdminPanel />}
        {activePage === 'learning' && <LearningArea />}
        {activePage === 'chat' && <ChatArea user={currentUser} />}
        
        {/* Fallback for unauthorized access */}
        {activePage === 'admin' && currentUser.role !== UserRole.ADMIN && (
           <div className="p-8 text-center text-red-500">Zugriff verweigert. Nur für Administratoren.</div>
        )}
      </main>
    </div>
  );
}