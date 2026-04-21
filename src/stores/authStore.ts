import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import type { User } from '@/types';

type AuthStore = {
  session: Session | null;
  profile: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  profile: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
