import { useState } from 'react';
import { Lock, AlertCircle, ShieldCheck, UserPlus, Mail } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'

  // login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // signup state
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

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

    if (!suName.trim() || !suEmail.trim() || !suPassword) {
      setSignupError('Please fill in all fields.');
      return;
    }
    if (suPassword !== suConfirm) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (suPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }

    setSignupLoading(true);
    const { error } = await supabase.auth.signUp({
      email: suEmail.trim(),
      password: suPassword,
      options: {
        data: { full_name: suName.trim() },
      },
    });
    setSignupLoading(false);

    if (error) {
      setSignupError(error.message);
      return;
    }

    setSignupSuccess(
      'Account created. Check your email to confirm your address, then sign in. New accounts start with the Staff role.'
    );
    setSuName('');
    setSuEmail('');
    setSuPassword('');
    setSuConfirm('');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: window.location.origin,
    });
    setResetLoading(false);

    if (error) {
      setResetError(error.message);
      return;
    }

    setResetSuccess('If an account exists for this email, a password reset link has been sent.');
    setResetEmail('');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(160deg, #0b1f33 0%, #103a5c 35%, #0F1411 75%, #2a0f1e 100%)',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4 overflow-hidden shadow-lg">
            <img src="/logo.jpg" alt="Base One General Mercantile logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-cream tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Base One Etus's Limited
          </h1>
          <p className="text-muted text-sm mt-1">Staff portal — sign in to continue</p>
        </div>

        {mode !== 'reset' && (
          <div className="flex border border-line rounded-lg overflow-hidden mb-4">
            <button
              onClick={() => { setMode('login'); setSignupError(''); setSignupSuccess(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-gold text-ink' : 'bg-panel text-muted hover:text-cream'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode('signup'); setLoginError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-gold text-ink' : 'bg-panel text-muted hover:text-cream'}`}
            >
              Create staff account
            </button>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="bg-panel border border-line rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-md bg-gold text-ink font-medium py-2.5 text-sm hover:bg-goldLight transition-colors disabled:opacity-60"
            >
              {loginLoading ? 'Signing in…' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={() => { setMode('reset'); setLoginError(''); }}
              className="w-full text-center text-xs text-muted hover:text-gold transition-colors"
            >
              Forgot your password?
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="bg-panel border border-line rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <UserPlus className="w-4 h-4 text-gold" />
              <span>New staff accounts get the Staff role</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Full name</label>
              <input
                type="text"
                value={suName}
                onChange={(e) => setSuName(e.target.value)}
                placeholder="e.g. Daniel Okafor"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={suEmail}
                onChange={(e) => setSuEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={suPassword}
                onChange={(e) => setSuPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Confirm password</label>
              <input
                type="password"
                value={suConfirm}
                onChange={(e) => setSuConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="new-password"
              />
            </div>

            {signupError && (
              <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}
            {signupSuccess && (
              <div className="flex items-start gap-2 text-sm text-success bg-[#1B2A1E] border border-[#33452E] rounded-md px-3 py-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{signupSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={signupLoading}
              className="w-full rounded-md bg-gold text-ink font-medium py-2.5 text-sm hover:bg-goldLight transition-colors disabled:opacity-60"
            >
              {signupLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="bg-panel border border-line rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Mail className="w-4 h-4 text-gold" />
              <span>Reset your password</span>
            </div>
            <p className="text-xs text-muted">
              Enter the email address on your account and we'll send you a link to reset your password.
            </p>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md bg-ink border border-line text-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-faint"
                autoComplete="email"
              />
            </div>

            {resetError && (
              <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}
            {resetSuccess && (
              <div className="flex items-start gap-2 text-sm text-success bg-[#1B2A1E] border border-[#33452E] rounded-md px-3 py-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full rounded-md bg-gold text-ink font-medium py-2.5 text-sm hover:bg-goldLight transition-colors disabled:opacity-60"
            >
              {resetLoading ? 'Sending…' : 'Send reset link'}
            </button>

            <button
              type="button"
              onClick={() => { setMode('login'); setResetError(''); setResetSuccess(''); }}
              className="w-full text-center text-xs text-muted hover:text-gold transition-colors"
            >
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
