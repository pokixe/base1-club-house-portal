import { useEffect, useState } from 'react';
import {
  Home, Utensils, Sparkles, FolderOpen, LogOut,
  ShieldCheck, User, AlertCircle, ChevronRight,
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

// Map icon name strings (stored in DB) to actual components
const ICONS = {
  Home,
  Utensils,
  Sparkles,
  FolderOpen,
};

export default function Dashboard({ onSelectService }) {
  const { profile, signOut } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isManagement = profile?.role === 'management';

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('id, name, description, icon')
        .order('name', { ascending: true });

      if (!mounted) return;
      if (fetchError) {
        setError(fetchError.message);
        setServices([]);
      } else {
        setServices(data ?? []);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen w-full bg-ink text-cream">
      <header className="border-b border-line sticky top-0 bg-ink/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Base One Etus's Limited
              </h1>
              <p className="text-xs text-muted">Staff portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
              {isManagement ? <ShieldCheck className="w-4 h-4 text-gold" /> : <User className="w-4 h-4" />}
              <span>{profile?.full_name} · {isManagement ? 'Management' : 'Staff'}</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-cream border border-line rounded-md px-3 py-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Services
          </h2>
          <p className="text-sm text-muted mt-1">
            Choose a service to view and manage its files.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted">Loading services…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => {
              const Icon = ICONS[service.icon] || FolderOpen;
              return (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service)}
                  className="flex items-center gap-4 bg-panel border border-line rounded-xl px-4 py-4 text-left hover:border-gold hover:bg-[#1C231E] transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-ink border border-line flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{service.name}</p>
                    {service.description && (
                      <p className="text-xs text-muted truncate">{service.description}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-faint shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {!loading && services.length === 0 && !error && (
          <div className="text-center py-12 border border-line rounded-xl">
            <FolderOpen className="w-8 h-8 text-faint mx-auto mb-2" />
            <p className="text-sm text-muted">No services have been set up yet.</p>
          </div>
        )}
      </main>
    </div>
  );
        }
