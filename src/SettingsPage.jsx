import { useState } from 'react';
import { ArrowLeft, Mail, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

export default function SettingsPage({ onBack }) {
  const { profile, user } = useAuth();
  const [resetSending, setResetSending] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleSendOwnReset = async () => {
    setResetError('');
    setResetMessage('');
    setResetSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin,
    });
    setResetSending(false);
    if (error) {
      setResetError(error.message);
      return;
    }
    setResetMessage(`Password reset link sent to ${user.email}.`);
  };

  return (
    <div
      className="min-h-screen w-full text-cream"
      style={{
        background: 'linear-gradient(160deg, #0b1f33 0%, #103a5c 35%, #0F1411 75%, #2a0f1e 100%)',
      }}
    >
      <header className="border-b border-line/60 sticky top-0 bg-ink/70 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg bg-panel border border-line flex items-center justify-center shrink-0 hover:border-gold transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
          </button>
          <div>
            <h1 className="font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              App Settings
            </h1>
            <p className="text-xs text-muted">Base One Etus's Limited</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Account section */}
        <section className="bg-panel/80 backdrop-blur border border-line rounded-xl p-5">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">Your account</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-ink border border-line flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted">{user?.email} · Management</p>
            </div>
          </div>

          <button
            onClick={handleSendOwnReset}
            disabled={resetSending}
            className="flex items-center gap-2 text-sm border border-line rounded-md px-3 py-2 hover:border-gold hover:text-gold transition-colors disabled:opacity-60"
          >
            <Mail className="w-4 h-4" />
            {resetSending ? 'Sending…' : 'Send me a password reset link'}
          </button>

          {resetMessage && (
            <div className="flex items-start gap-2 text-sm text-success bg-[#1B2A1E] border border-[#33452E] rounded-md px-3 py-2 mt-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}
          {resetError && (
            <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2 mt-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}
        </section>

        {/* Branding section */}
        <section className="bg-panel/80 backdrop-blur border border-line rounded-xl p-5">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">Branding & theme</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo.jpg" alt="Company logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Company logo</p>
              <p className="text-xs text-muted">
                The logo is stored in the app's <code>public/logo.jpg</code> file. To change it,
                replace that file in the project's source code and redeploy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted bg-ink border border-line rounded-md px-3 py-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
            <p>
              The background gradient and color theme are set in the app's code (a navy-to-charcoal-to-burgundy
              gradient matching the logo). Changing these requires a code update — ask whoever maintains
              the app's source files to adjust the gradient colors in <code>AuthScreen.jsx</code> and{' '}
              <code>Dashboard.jsx</code>.
            </p>
          </div>
        </section>

        {/* Manage staff section */}
        <section className="bg-panel/80 backdrop-blur border border-line rounded-xl p-5">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">Manage staff</h2>
          <p className="text-sm text-muted">
            To promote a staff member to Management, or to remove an account, open your Supabase
            project's Table Editor and edit the <code>profiles</code> table directly.
          </p>
        </section>
      </main>
    </div>
  );
}
