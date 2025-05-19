
import { User, UserRole } from '@/lib/types';
import { Session } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  session: Session | null;
};
