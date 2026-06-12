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
