import { useEffect, useState } from 'react';
import {
  Home, Utensils, Sparkles, FolderOpen, LogOut,
  ShieldCheck, User, AlertCircle, ChevronRight, Settings, FileText, Clock,
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const ICONS = { Home, Utensils, Sparkles, FolderOpen };

function formatRelativeTime(ts) {
  const diffMs = Date.now() - new Date(ts).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Dashboard({ onSelectService, onOpenSettings }) {
  const { profile, signOut } = useAuth();
  const [services, setServices] = useState([]);
  const [fileStats, setFileStats] = useState({});
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  const isManagement = profile?.role === 'management';

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');

      const [servicesRes, filesRes] = await Promise.all([
        supabase.from('services').select('id, name, description, icon').order('name', { ascending: true }),
        supabase.from('files').select('id, name, service_id, created_at, profiles(full_name)').order('created_at', { ascending: false }),
      ]);

      if (!mounted) return;

      if (servicesRes.error) {
        setError(servicesRes.error.message);
        setServices([]);
      } else {
        setServices(servicesRes.data ?? []);
      }

      if (!filesRes.error) {
        const allFiles = filesRes.data ?? [];
        const stats = {};
        for (const f of allFiles) {
          if (!stats[f.service_id]) stats[f.service_id] = { count: 0, lastUpload: f.created_at };
          stats[f.service_id].count += 1;
        }
        setFileStats(stats);
        setRecentFiles(allFiles.slice(0, 5));
      }

      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div
      className="min-h-screen w-full text-cream"
      style={{ background: 'linear-gradient(160deg, #0b1f33 0%, #103a5c 35%, #0F1411 75%, #2a0f1e 100%)' }}
    >
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C8A24A, transparent)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #103a5c, transparent)', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2a0f1e, transparent)', animation: 'float 12s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .stagger-1 { animation-delay: 0.05s; opacity: 0; }
        .stagger-2 { animation-delay: 0.1s; opacity: 0; }
        .stagger-3 { animation-delay: 0.15s; opacity: 0; }
        .stagger-4 { animation-delay: 0.2s; opacity: 0; }
        .stagger-5 { animation-delay: 0.25s; opacity: 0; }
        .stagger-6 { animation-delay: 0.3s; opacity: 0; }
        .card-hover { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .card-hover:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 8px 30px rgba(200,162,74,0.15); border-color: #C8A24A; }
        .card-hover:active { transform: translateY(-1px) scale(0.99); }
      `}</style>

      <header className="border-b border-line/60 sticky top-0 bg-ink/70 backdrop-blur z-10 fade-in">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0"
              style={{ boxShadow: '0 0 0 2px #C8A24A44' }}>
              <img src="/logo.jpg" alt="Base One General Mercantile logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Base One General Mercantile
              </h1>
              <p className="text-xs text-muted">Staff portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
              {isManagement ? <ShieldCheck className="w-4 h-4 text-gold" /> : <User className="w-4 h-4" />}
              <span>{profile?.full_name} · {isManagement ? 'Management' : 'Staff'}</span>
            </div>
            {isManagement && (
              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-md border border-line flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-all duration-300 hover:rotate-45"
                title="App settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-cream border border-line rounded-md px-3 py-1.5 transition-all duration-200 hover:border-muted"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 relative">
        <div className={`mb-6 fade-in-up stagger-1 ${visible ? '' : 'opacity-0'}`}>
          <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Services
          </h2>
          <p className="text-sm text-muted mt-1">Choose a service to view and manage its files.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2 mb-4 fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 bg-panel/50 border border-line rounded-xl px-4 py-4 animate-pulse">
                <div className="w-11 h-11 rounded-lg bg-line shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-line rounded" />
                  <div className="h-2 w-32 bg-line/70 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service, idx) => {
              const Icon = ICONS[service.icon] || FolderOpen;
              const stats = fileStats[service.id];
              return (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service)}
                  className={`card-hover flex items-center gap-4 bg-panel/80 backdrop-blur border border-line rounded-xl px-4 py-4 text-left fade-in-up stagger-${idx + 2} ${visible ? '' : 'opacity-0'}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-ink border border-line flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{service.name}</p>
                      {stats?.count > 0 && (
                        <span className="text-xs bg-ink border border-line rounded-full px-2 py-0.5 text-gold shrink-0">
                          {stats.count}
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-xs text-muted truncate">{service.description}</p>
                    )}
                    {stats?.lastUpload && (
                      <p className="text-xs text-faint mt-0.5">Last upload {formatRelativeTime(stats.lastUpload)}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-faint shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {!loading && services.length === 0 && !error && (
          <div className="text-center py-12 border border-line rounded-xl fade-in">
            <FolderOpen className="w-8 h-8 text-faint mx-auto mb-2" />
            <p className="text-sm text-muted">No services have been set up yet.</p>
          </div>
        )}

        {/* Recent Activity */}
        {!loading && recentFiles.length > 0 && (
          <div className={`mt-8 fade-in-up ${visible ? '' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gold" />
              <h2 className="text-sm font-medium text-muted uppercase tracking-wide">Recent activity</h2>
            </div>
            <div className="bg-panel/80 backdrop-blur border border-line rounded-xl divide-y divide-line overflow-hidden">
              {recentFiles.map((f, idx) => {
                const service = services.find((s) => s.id === f.service_id);
                const Icon = service ? (ICONS[service.icon] || FolderOpen) : FileText;
                return (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-ink/40"
                    style={{ animationDelay: `${0.45 + idx * 0.05}s` }}
                  >
                    <div className="w-8 h-8 rounded-md bg-ink border border-line flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-xs text-muted truncate">
                        {service?.name ?? 'Unknown'} · {f.profiles?.full_name ?? 'Unknown'} · {formatRelativeTime(f.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
      }
