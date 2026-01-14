"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  session: Session | null;
  authState: AuthState;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ isLoading: true, error: null });

  // Helper to update auth state
  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // Checks for an existing session on initial load
      setSession(session);
      updateAuthState({ isLoading: false });
    });

    // Listens for changes to auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      updateAuthState({ isLoading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    updateAuthState({ isLoading: true, error: null });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      updateAuthState({ isLoading: false, error: error.message });
    }
  };

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    authState,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext<AuthContextType | null>(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
