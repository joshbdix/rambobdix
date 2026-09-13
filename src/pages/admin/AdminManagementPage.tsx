import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/ToastContainer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { AdminRecord } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Users, UserPlus, Shield, ShieldCheck, Trash2, Edit, X, Check, Lock } from 'lucide-react';

export const AdminManagementPage: React.FC = () => {
  const { adminRecord, isSuperAdmin } = useAuth();
  const { logAudit } = useData();
  const { addToast } = useToast();

  const [adminsList, setAdminsList] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminRecord | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'editor'>('admin');
  const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>('active');

  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);

  const loadAdmins = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setAdminsList(data as AdminRecord[]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setEmail('');
    setFullName('');
    setRole('admin');
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (adm: AdminRecord) => {
    setEditingAdmin(adm);
    setEmail(adm.email);
    setFullName(adm.full_name || '');
    setRole(adm.role);
    setStatus(adm.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('ইমেল আবশ্যক।', 'error');
      return;
    }

    try {
      if (editingAdmin) {
        // Update
        if (!isSupabaseConfigured()) {
          throw new Error('Supabase is not configured.');
        }
        const { error } = await supabase.from('admins').update({
          full_name: fullName.trim(),
          role,
          status,
          updated_at: new Date().toISOString(),
        }).eq('id', editingAdmin.id);
        if (error) throw error;
        
        await logAudit('UPDATE_ADMIN', 'admins', editingAdmin.id, `Updated admin ${email} to role: ${role}, status: ${status}`);
        addToast('অ্যাডমিন সফলভাবে আপডেট করা হয়েছে।', 'success');
      } else {
        // Create
        if (!isSupabaseConfigured()) {
          throw new Error('Supabase is not configured.');
        }
        const newRecord = {
          email: email.trim().toLowerCase(),
          full_name: fullName.trim(),
          role,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('admins').insert(newRecord);
        if (error) throw error;
        
        await logAudit('CREATE_ADMIN', 'admins', email, `Created new admin ${email} with role: ${role}`);
        addToast('নতুন অ্যাডমিন সফলভাবে অনুমোদিত হয়েছে।', 'success');
      }
      setModalOpen(false);
      loadAdmins();
    } catch (err: any) {
      addToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.id === adminRecord?.id) {
        addToast('আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না।', 'error');
        return;
      }

      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured.');
      }
      const { error } = await supabase.from('admins').delete().eq('id', deleteTarget.id);
      if (error) throw error;

      await logAudit('DELETE_ADMIN', 'admins', deleteTarget.id, `Deleted admin access for ${deleteTarget.email}`);
      addToast(`অ্যাডমিন "${deleteTarget.email}" অপসারণ করা হয়েছে।`, 'success');
    } catch (err: any) {
      addToast(err.message || 'ডিলিট ব্যর্থ হয়েছে।', 'error');
    } finally {
      setDeleteTarget(null);
      loadAdmins();
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-500/30 rounded-2xl">
        <Lock className="w-8 h-8 mx-auto mb-2" />
        <p className="font-bold">এই সেকশনে প্রবেশের জন্য সুপার অ্যাডমিন পারমিশন প্রয়োজন।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Admin Team & Role Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            (Super Admin Only) অ্যাডমিন দলের সদস্যদের পারমিশন এবং রোল পরিচালনা করুন
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন অ্যাডমিন অনুমোদন করুন</span>
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-[#081022] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060c1c] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Admin Email</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {adminsList.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 text-white font-semibold font-mono">
                    {adm.email}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {adm.full_name || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                      adm.role === 'super_admin'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : adm.role === 'admin'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {adm.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                      adm.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : adm.status === 'suspended'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {adm.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(adm)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                        title="Edit Admin"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {adm.id !== adminRecord?.id && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(adm)}
                          className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-500/30 transition-colors"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#091224] border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingAdmin ? 'অ্যাডমিন পারমিশন সম্পাদনা' : 'নতুন অ্যাডমিন যুক্ত করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={editingAdmin !== null}
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="super_admin">Super Admin (Full Access)</option>
                  <option value="admin">Admin (Standard Content Management)</option>
                  <option value="editor">Editor (View & Update Content)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended (Access Denied)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="অ্যাডমিন মুছে ফেলার সতর্কতা"
        message={`আপনি কি নিশ্চিত যে "${deleteTarget?.email}" এর অ্যাডমিন পারমিশন বাতিল করতে চান?`}
        confirmLabel="হ্যাঁ, পারমিশন বাতিল করুন"
        cancelLabel="বাতিল"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
