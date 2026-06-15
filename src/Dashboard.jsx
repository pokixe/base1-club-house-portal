import { useState, useEffect } from 'react';
import { AlertCircle, ShieldCheck, UserPlus, Mail } from 'lucide-react';
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

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

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
    setSignupError(''); setSignupSuccess('');
    if (!suName.trim() || !suEmail.trim() || !suPassword) { setSignupError('Please fill in all fields.'); return; }
    if (suPassword !== suConfirm) { setSignupError('Passwords do not match.'); return; }
    if (suPassword.length < 6) { setSignupError('Password must be at least 6 characters.'); return; }
    setSignupLoading(true);
    const { error } = await supabase.auth.signUp({ email: suEmail.trim(), password: suPassword, options: { data: { full_name: suName.trim() } } });
    setSignupLoading(false);
    if (error) { setSignupError(error.message); return; }
    setSignupSuccess('Account created. Check your email to confirm, then sign in.');
    setSuName(''); setSuEmail(''); setSuPassword(''); setSuConfirm('');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError(''); setResetSuccess('');
    if (!resetEmail.trim()) { setResetError('Please enter your email address.'); return; }
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), { redirectTo: window.location.origin });
    setResetLoading(false);
    if (error) { setResetError(error.message); return; }
    setResetSuccess('If an account exists, a reset link has been sent.');
    setResetEmail('');
  };

  const inputStyle = {
    width: '100%', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#E8E4DC', padding: '10px 14px', fontSize: 13,
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  };

  const labelStyle = { display: 'block', fontSize: 10, color: '#7A9180', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(175deg, #0A1628 0%, #0f2240 40%, #111918 70%, #1C0A14 100%)',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    }}>
      <style>{`
        @keyframes orb { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-15px) scale(1.04)} 66%{transform:translate(-10px,10px) scale(0.97)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes logoPulse { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0.4)} 50%{box-shadow:0 0 0 12px rgba(212,168,67,0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .auth-fade { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .d1{animation-delay:0s} .d2{animation-delay:0.08s} .d3{animation-delay:0.16s} .d4{animation-delay:0.24s}
        .logo-pulse { animation: logoPulse 2.5s ease-in-out infinite; }
        .gold-text {
          background: linear-gradient(90deg, #D4A843 0%, #F0CC6E 50%, #D4A843 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 4s linear infinite;
        }
        .auth-input:focus { border-color: rgba(212,168,67,0.5) !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.08) !important; }
        .auth-btn { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease; }
        .auth-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,168,67,0.25); }
        .auth-btn:active:not(:disabled) { transform: scale(0.98); }
        .spinner { animation: spin 0.7s linear infinite; }
        .tab-btn { transition: background 0.2s, color 0.2s; }
      `}</style>

      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #D4A843, transparent 70%)', opacity: 0.07, animation: 'orb 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle at 60% 60%, #1a4a8a, transparent 70%)', opacity: 0.06, animation: 'orb 18s ease-in-out infinite reverse' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease' }}>

        {/* Logo + brand */}
        <div className="auth-fade d1 text-center" style={{ marginBottom: 28 }}>
          <div className="logo-pulse" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, borderRadius: '50%', background: 'white', overflow: 'hidden', border: '3px solid #D4A843', marginBottom: 16 }}>
            <img src="/logo.jpg" alt="Base One General Mercantile" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 className="gold-text" style={{ fontSize: 20, fontFamily: 'Georgia, serif', fontWeight: 700, marginBottom: 4 }}>
              Base One General Mercantile
            </h1>
            <div style={{ fontSize: 10, color: '#4A6055', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Staff Portal · BN033142
            </div>
          </div>
        </div>

        {/* Tabs */}
        {mode !== 'reset' && (
          <div className="auth-fade d2" style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
            {[['login', 'Sign in'], ['signup', 'Create account']].map(([m, label]) => (
              <button key={m} className="tab-btn" onClick={() => { setMode(m); setLoginError(''); setSignupError(''); setSignupSuccess(''); }}
                style={{ flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', border: 'none', cursor: 'pointer', background: mode === m ? '#D4A843' : 'transparent', color: mode === m ? '#0A1628' : '#7A9180' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="auth-fade d3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, backdropFilter: 'blur(20px)' }}>

          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Email address', value: email, onChange: setEmail, type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
                { label: 'Password', value: password, onChange: setPassword, type: 'password', placeholder: '••••••••', autoComplete: 'current-password' },
              ].map(({ label, value, onChange, type, placeholder, autoComplete }) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
                    className="auth-input" style={inputStyle} />
                </div>
              ))}
              {loginError && <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#E08E6D', background: 'rgba(42,31,24,0.8)', border: '1px solid #4A3324', borderRadius: 8, padding: '8px 12px' }}><AlertCircle style={{ width: 13, height: 13, marginTop: 1, flexShrink: 0 }} />{loginError}</div>}
              <button type="submit" disabled={loginLoading} className="auth-btn"
                style={{ width: '100%', background: '#D4A843', color: '#0A1628', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: loginLoading ? 'wait' : 'pointer', opacity: loginLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {loginLoading ? <><svg className="spinner" style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Signing in…</> : 'Sign in'}
              </button>
              <button type="button" onClick={() => { setMode('reset'); setLoginError(''); }}
                style={{ background: 'none', border: 'none', color: '#4A6055', fontSize: 11, cursor: 'pointer', textAlign: 'center', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#D4A843'} onMouseLeave={e => e.currentTarget.style.color = '#4A6055'}>
                Forgot your password?
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7A9180', marginBottom: 2 }}>
                <UserPlus style={{ width: 12, height: 12, color: '#D4A843' }} />New accounts start with Staff role
              </div>
              {[
                { label: 'Full name', value: suName, onChange: setSuName, type: 'text', placeholder: 'e.g. Daniel Okafor' },
                { label: 'Email address', value: suEmail, onChange: setSuEmail, type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', value: suPassword, onChange: setSuPassword, type: 'password', placeholder: 'At least 6 characters' },
                { label: 'Confirm password', value: suConfirm, onChange: setSuConfirm, type: 'password', placeholder: '••••••••' },
              ].map(({ label, value, onChange, type, placeholder }) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    className="auth-input" style={inputStyle} />
                </div>
              ))}
              {signupError && <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#E08E6D', background: 'rgba(42,31,24,0.8)', border: '1px solid #4A3324', borderRadius: 8, padding: '8px 12px' }}><AlertCircle style={{ width: 13, height: 13, marginTop: 1, flexShrink: 0 }} />{signupError}</div>}
              {signupSuccess && <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#9FCB8D', background: 'rgba(27,42,30,0.8)', border: '1px solid #33452E', borderRadius: 8, padding: '8px 12px' }}><ShieldCheck style={{ width: 13, height: 13, marginTop: 1, flexShrink: 0 }} />{signupSuccess}</div>}
              <button type="submit" disabled={signupLoading} className="auth-btn"
                style={{ width: '100%', background: '#D4A843', color: '#0A1628', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: signupLoading ? 'wait' : 'pointer', opacity: signupLoading ? 0.7 : 1, marginTop: 2 }}>
                {signupLoading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7A9180', marginBottom: 2 }}>
                <Mail style={{ width: 12, height: 12, color: '#D4A843' }} />Password reset
              </div>
              <p style={{ fontSize: 12, color: '#4A6055', margin: 0 }}>Enter your email and we'll send a reset link.</p>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@example.com"
                  className="auth-input" style={inputStyle} />
              </div>
              {resetError && <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#E08E6D', background: 'rgba(42,31,24,0.8)', border: '1px solid #4A3324', borderRadius: 8, padding: '8px 12px' }}><AlertCircle style={{ width: 13, height: 13, marginTop: 1, flexShrink: 0 }} />{resetError}</div>}
              {resetSuccess && <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#9FCB8D', background: 'rgba(27,42,30,0.8)', border: '1px solid #33452E', borderRadius: 8, padding: '8px 12px' }}><ShieldCheck style={{ width: 13, height: 13, marginTop: 1, flexShrink: 0 }} />{resetSuccess}</div>}
              <button type="submit" disabled={resetLoading} className="auth-btn"
                style={{ width: '100%', background: '#D4A843', color: '#0A1628', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: resetLoading ? 'wait' : 'pointer', opacity: resetLoading ? 0.7 : 1 }}>
                {resetLoading ? 'Sending…' : 'Send reset link'}
              </button>
              <button type="button" onClick={() => { setMode('login'); setResetError(''); setResetSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#4A6055', fontSize: 11, cursor: 'pointer', textAlign: 'center', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#D4A843'} onMouseLeave={e => e.currentTarget.style.color = '#4A6055'}>
                Back to sign in
              </button>
            </form>
          )}
        </div>

        <div className="auth-fade d4" style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: '#2A3A2A', letterSpacing: '0.1em' }}>
          BASE ONE GENERAL MERCANTILE · BN033142
        </div>
      </div>
    </div>
  );
    }
          
