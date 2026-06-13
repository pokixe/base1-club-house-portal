import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import AuthScreen from './AuthScreen';
import Dashboard from './Dashboard';
import FilePortal from './FilePortal';
import SettingsPage from './SettingsPage';

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-ink text-cream">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-ink text-cream p-4">
        <div className="max-w-sm text-center">
          <p className="text-sm text-muted">
            Your account is signed in but has no profile yet. If you just signed up, confirm your
            email and refresh this page. If the problem continues, contact Management.
          </p>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />;
  }

  if (selectedService) {
    return (
      <FilePortal
        service={selectedService}
        onBack={() => setSelectedService(null)}
      />
    );
  }

  return (
    <Dashboard
      onSelectService={setSelectedService}
      onOpenSettings={() => setShowSettings(true)}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
