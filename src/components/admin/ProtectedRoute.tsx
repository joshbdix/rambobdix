import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'editor' | 'admin' | 'super_admin';
  requireSuperAdmin?: boolean;
  requireAdmin?: boolean;
}

export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireSuperAdmin = false,
  requireAdmin = false,
}) => {
  const { user, isEditor, isAdmin, isSuperAdmin, isSuspended, loading, adminRecord } = useAuth();

  // 1. Do NOT allow access while checking authorization. Show a clean loading state.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-cyan-400">অ্যাডমিন অ্যাক্সেস যাচাই করা হচ্ছে...</p>
        <span className="text-xs text-slate-500 font-mono">Verifying authorization with database RLS...</span>
      </div>
    );
  }

  // 2. Unauthenticated -> redirect to /admin/login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Authenticated suspended admin -> redirect to /403
  if (isSuspended || adminRecord?.status === 'suspended') {
    return <Navigate to="/403" replace />;
  }

  // 4. Authenticated non-admin or invalid role -> redirect to /403
  if (!adminRecord || adminRecord.status !== 'active' || !isEditor) {
    return <Navigate to="/403" replace />;
  }

  // 5. If Super Admin is strictly required (e.g. /admin/admins, /admin/audit-logs)
  if ((requireSuperAdmin || requiredRole === 'super_admin') && !isSuperAdmin) {
    return <Navigate to="/403" replace />;
  }

  // 6. If Admin role is required (e.g. /admin/settings, /admin/contacts) and user is only Editor
  if ((requireAdmin || requiredRole === 'admin') && !isAdmin) {
    return <Navigate to="/403" replace />;
  }

  // 7. Fully verified with database authority
  return <>{children}</>;
};

// Backwards compatibility alias
export const ProtectedRoute = ProtectedAdminRoute;

