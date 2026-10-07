"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  verified: boolean;
  rating: number;
  ads_count: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured || !supabase) {
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [configured, supabase]);

  async function fetchProfile(userId: string) {
    if (!configured || !supabase) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) setProfile(data as Profile);
  }

  async function signInWithPhone(phone: string) {
    if (!configured || !supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone.replace(/\s/g, "")}`,
      options: { channel: "sms" },
    });
    return { error: error?.message ?? null };
  }

  async function verifyOTP(phone: string, token: string) {
    if (!configured || !supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone.replace(/\s/g, "")}`,
      token,
      type: "sms",
    });
    return { error: error?.message ?? null };
  }

  async function signInWithGoogle() {
    if (!configured || !supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    if (!configured || !supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function refreshProfile() {
    if (!configured || !supabase || !user) return;
    await fetchProfile(user.id);
  }

  const value = {
    user,
    profile,
    loading: configured ? loading : false,
    signInWithPhone,
    verifyOTP,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      profile: null,
      loading: false,
      signInWithPhone: async () => ({ error: "Auth not initialized" }),
      verifyOTP: async () => ({ error: "Auth not initialized" }),
      signInWithGoogle: async () => ({ error: "Auth not initialized" }),
      signOut: async () => {},
      refreshProfile: async () => {},
    };
  }
  return context;
}