import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';

interface AuthContextType {
  user: User | null;
  adminRecord: AdminUser | null;
  isEditor: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSuspended: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; authorized?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminRecord, setAdminRecord] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  // Strictly fetch administrator record mapped to auth.uid() from the Supabase admins table
  const fetchAdminRecord = useCallback(async (userId: string): Promise<AdminUser | null> => {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }
      return data as AdminUser;
    } catch (err) {
      console.error('Failed to verify admin status:', err);
      return null;
    }
  }, []);

  const refreshAdminStatus = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !user) {
      setAdminRecord(null);
      return;
    }

    const record = await fetchAdminRecord(user.id);
    setAdminRecord(record);
  }, [user, fetchAdminRecord]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Retrieve active authenticated session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const record = await fetchAdminRecord(session.user.id);
        setAdminRecord(record);
      } else {
        setUser(null);
        setAdminRecord(null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Session retrieval error:', err);
      setUser(null);
      setAdminRecord(null);
      setLoading(false);
    });

    // Real-time listener for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        const record = await fetchAdminRecord(session.user.id);
        setAdminRecord(record);
      } else {
        setUser(null);
        setAdminRecord(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAdminRecord]);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null; authorized?: boolean }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: new Error('Supabase is not configured. Please ensure Supabase credentials are provided.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        // Verify auth.uid() against admins.user_id
        const record = await fetchAdminRecord(data.user.id);
        setAdminRecord(record);

        // Verify that admin record exists, status is active, and role is valid
        if (!record || record.status !== 'active') {
          return { error: null, authorized: false };
        }
        return { error: null, authorized: true };
      }
      return { error: new Error('User not found'), authorized: false };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Authentication failed'), authorized: false };
    }
  };

  const signOut = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    setAdminRecord(null);
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: new Error('Supabase is not configured.') };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/admin/login`,
      });
      return { error: error || null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Password reset failed') };
    }
  };

  // Strict RBAC checks: user must have active status in admins table
  const isSuspended = Boolean(adminRecord && adminRecord.status === 'suspended');
  const isEditor = Boolean(
    adminRecord &&
    adminRecord.status === 'active' &&
    ['editor', 'admin', 'super_admin'].includes(adminRecord.role)
  );
  const isAdmin = Boolean(
    adminRecord &&
    adminRecord.status === 'active' &&
    ['admin', 'super_admin'].includes(adminRecord.role)
  );
  const isSuperAdmin = Boolean(
    adminRecord &&
    adminRecord.status === 'active' &&
    adminRecord.role === 'super_admin'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        adminRecord,
        isEditor,
        isAdmin,
        isSuperAdmin,
        isSuspended,
        loading,
        isConfigured,
        signIn,
        signOut,
        resetPassword,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
