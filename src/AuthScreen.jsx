import { useState, useEffect } from 'react';
import { Lock, AlertCircle, ShieldCheck, UserPlus, Mail } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginLoading(false);
    if (error) setLoginError(error.message);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    if (!suName.trim() || !suEmail.trim() || !suPassword) { setSignupError('Please fill in all fields.'); return; }
    if (suPassword !== suConfirm) { setSignupError('Passwords do not match.'); return; }
    if (suPassword.length < 6) { setSignupError('Password must be at least 6 characters.'); return; }
    setSignupLoading(true);
    const { error } = await supabase.auth.signUp({
      email: suEmail.trim(),
      password: suPassword,
      options: { data: { full_name: suName.trim() } },
    });
    setSignupLoading(false);
    if (error) { setSignupError(error.message); return; }
    setSignupSuccess('Account created. Check your email to confirm, then sign in.');
    setSuName(''); setSuEmail(''); setSuPassword(''); setSuConfirm('');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (!resetEmail.trim()) { setResetError('Please enter your email address.'); return; }
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: window.location.origin,
    });
    setResetLoading(false);
    if (error) { setResetError(error.message); return; }
    setResetSuccess('If an account exists, a password reset link has been sent.');
    setResetEmail('');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0b1f33 0%, #103a5c 35%, #0F1411 75%, #2a0f1e 100%)' }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(200,162,74,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(200,162,74,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-card { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .logo-pulse { animation: logoPulse 2.5s ease-in-out infinite; }
        .input-field { transition: all 0.2s ease; }
        .input-field:focus { transform: scale(1.01); }
        .btn-primary { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 20px rgba(200,162,74,0.3); }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .spinner { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* Animated background orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8A24A, transparent)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #103a5c, transparent)', animation: 'float 10s ease-in-out infinite reverse' }} />

      <div
        className="w-full max-w-sm relative"
        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div className="auth-card text-center mb-8">
          <div
            className="logo-pulse inline-flex items-center justify-center w-24 h-24 rounded-full bg-white mb-5 overflow-hidden"
            style={{ border: '3px solid #C8A24A' }}
          >
            <img src="/logo.jpg" alt="Base One General Mercantile logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-cream tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Base One General Mercantile
          </h1>
          <p className="text-muted text-sm mt-1">Staff portal — sign in to continue</p>
        </div>

        {mode !== 'reset' && (
          <div className="auth-card flex border border-line rounded-lg overflow-hidden mb-4" style={{ animationDelay: '0.1s' }}>
            <button
              onClick={() => { setMode('login'); setSignupError(''); setSignupSuccess(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-all duration-200 ${mode === 'login' ? 'bg-gold text-ink' : 'bg-panel text-muted hover:text-cream'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode('signup'); setLoginError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-all duration-200 ${mode === 'signup' ? 'bg-gold text-ink' : 'bg-panel text-muted hover:text-cream'}`}
            >
              Create staff account
            </button>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-card bg-panel border border-line rounded-xl p-6 space-y-4" style={{ animationDelay: '0.15s' }}>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="input-field w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="input-field w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="current-password" />
            </div>
            {loginError && (
              <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{loginError}</span>
              </div>
            )}
            <button type="submit" disabled={loginLoading}
              className="btn-primary w-full rounded-md bg-gold text-ink font-medium py-2.5 text-sm disabled:opacity-60 flex items-center justify-center gap-2">
              {loginLoading ? (
                <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>Signing in…</>
              ) : 'Sign in'}
            </button>
            <button type="button" onClick={() => { setMode('reset'); setLoginError(''); }}
              className="w-full text-center text-xs text-muted hover:text-gold transition-colors duration-200">
              Forgot your password?
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="auth-card bg-panel border border-line rounded-xl p-6 space-y-4" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <UserPlus className="w-4 h-4 text-gold" /><span>New staff accounts get the Staff role</span>
            </div>
            {[
              { label: 'Full name', value: suName, onChange: setSuName, placeholder: 'e.g. Daniel Okafor', type: 'text' },
              { label: 'Email', value: suEmail, onChange: setSuEmail, placeholder: 'you@example.com', type: 'email' },
              { label: 'Password', value: suPassword, onChange: setSuPassword, placeholder: 'At least 6 characters', type: 'password' },
              { label: 'Confirm password', value: suConfirm, onChange: setSuConfirm, placeholder: '••••••••', type: 'password' },
            ].map(({ label, value, onChange, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">{label}</label>
                <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
                  className="input-field w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint" />
              </div>
            ))}
            {signupError && (
              <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{signupError}</span>
              </div>
            )}
            {signupSuccess && (
              <div className="flex items-start gap-2 text-sm text-success bg-[#1B2A1E] border border-[#33452E] rounded-md px-3 py-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" /><span>{signupSuccess}</span>
              </div>
            )}
            <button type="submit" disabled={signupLoading}
              className="btn-primary w-full rounded-md bg-gold text-ink font-medium py-2.5 text-sm disabled:opacity-60 flex items-center justify-center gap-2">
              {signupLoading ? (
                <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>Creating…</>
              ) : 'Create account'}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="auth-card bg-panel border border-line rounded-xl p-6 space-y-4" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Mail className="w-4 h-4 text-gold" /><span>Reset your password</span>
            </div>
            <p className="text-xs text-muted">Enter your email and we'll send a reset link.</p>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="you@example.com"
                className="input-field w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint" />
            </div>
            {resetError && (
              <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{resetError}</span>
              </div>
            )}
            {resetSuccess && (
              <div className="flex items-start gap-2 text-sm text-success bg-[#1B2A1E] border border-[#33452E] rounded-md px-3 py-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" /><span>{resetSuccess}</span>
              </div>
            )}
            <button type="submit" disabled={resetLoading}
              className="btn-primary w-full rounded-md bg-gold text-ink font-medium py-2.5 text-sm disabled:opacity-60">
              {resetLoading ? 'Sending…' : 'Send reset link'}
            </button>
            <button type="button" onClick={() => { setMode('login'); setResetError(''); setResetSuccess(''); }}
              className="w-full text-center text-xs text-muted hover:text-gold transition-colors duration-200">
              Back to sign in
            </button>
          </form>
        )}

        <p className="text-xs text-faint text-center mt-4">
          Management can promote a staff account in the Supabase dashboard
          (table: <code>profiles</code>, set <code>role</code> to <code>management</code>).
        </p>
      </div>
    </div>
  );
}
