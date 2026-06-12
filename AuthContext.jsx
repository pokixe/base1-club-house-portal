import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
    const [profile, setProfile] = useState(null);
      const [profileLoading, setProfileLoading] = useState(false);

        useEffect(() => {
            supabase.auth.getSession().then(({ data }) => {
                  setSession(data.session ?? null);
                      });

                          const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
                                setSession(newSession);
                                    });

                                        return () => listener.subscription.unsubscribe();
                                          }, []);

                                            useEffect(() => {
                                                if (!session?.user) {
                                                      setProfile(null);
                                                            return;
                                                                }
                                                                    let mounted = true;
                                                                        setProfileLoading(true);
                                                                            supabase
                                                                                  .from('profiles')
                                                                                        .select('id, full_name, role')
                                                                                              .eq('id', session.user.id)
                                                                                                    .single()
                                                                                                          .then(({ data, error }) => {
                                                                                                                  if (!mounted) return;
                                                                                                                          if (error) {
                                                                                                                                    console.error('Failed to load profile', error);
                                                                                                                                              setProfile(null);
                                                                                                                                                      } else {
                                                                                                                                                                setProfile(data);
                                                                                                                                                                        }
                                                                                                                                                                                setProfileLoading(false);
                                                                                                                                                                                      });
                                                                                                                                                                                          return () => { mounted = false; };
                                                                                                                                                                                            }, [session?.user?.id]);

                                                                                                                                                                                              const value = {
                                                                                                                                                                                                  session,
                                                                                                                                                                                                      user: session?.user ?? null,
                                                                                                                                                                                                          profile,
                                                                                                                                                                                                              loading: session === undefined || (session?.user && profileLoading),
                                                                                                                                                                                                                  signOut: () => supabase.auth.signOut(),
                                                                                                                                                                                                                    };

                                                                                                                                                                                                                      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
                                                                                                                                                                                                                      }

                                                                                                                                                                                                                      export function useAuth() {
                                                                                                                                                                                                                        const ctx = useContext(AuthContext);
                                                                                                                                                                                                                          if (!ctx) throw new Error('useAuth must be used within AuthProvider');
                                                                                                                                                                                                                            return ctx;
                                                                                                                                                                                                                            }