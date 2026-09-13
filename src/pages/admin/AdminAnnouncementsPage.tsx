import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContainer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { AnnouncementItem } from '../../types';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useData();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success' | 'important'>('info');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [deleteTarget, setDeleteTarget] = useState<AnnouncementItem | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setMessage('');
    setType('info');
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate('');
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (ann: AnnouncementItem) => {
    setEditingItem(ann);
    setTitle(ann.title);
    setMessage(ann.message);
    setType(ann.type);
    setStartDate(ann.start_date ? ann.start_date.slice(0, 10) : '');
    setEndDate(ann.end_date ? ann.end_date.slice(0, 10) : '');
    setStatus(ann.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      addToast('শিরোনাম এবং বার্তা উভয়ই আবশ্যক।', 'error');
      return;
    }

    try {
      if (editingItem) {
        await updateAnnouncement(editingItem.id, {
          title: title.trim(),
          message: message.trim(),
          type,
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          status,
        });
        addToast('নোটিশ সফলভাবে আপডেট করা হয়েছে।', 'success');
      } else {
        await createAnnouncement({
          title: title.trim(),
          message: message.trim(),
          type,
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          status,
        });
        addToast('নতুন নোটিশ সফলভাবে প্রকাশ করা হয়েছে।', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      addToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    }
  };

  const handleToggleStatus = async (ann: AnnouncementItem) => {
    const newStatus = ann.status === 'active' ? 'inactive' : 'active';
    try {
      await updateAnnouncement(ann.id, { status: newStatus });
      addToast(`নোটিশ ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`, 'info');
    } catch (err: any) {
      addToast(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (!isAdmin) {
      addToast('অননুমোদিত: শুধুমাত্র অ্যাডমিন বা সুপার অ্যাডমিন ডিলিট করতে পারেন।', 'error');
      setDeleteTarget(null);
      return;
    }
    try {
      await deleteAnnouncement(deleteTarget.id);
      addToast('নোটিশ মুছে ফেলা হয়েছে।', 'success');
    } catch (err: any) {
      addToast(err.message || 'নোটিশ মুছে ফেলা যায়নি।', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const getTypeBadge = (t: string) => {
    switch (t) {
      case 'success':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase">Success</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase">Warning</span>;
      case 'important':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono uppercase">Important</span>;
      case 'info':
      default:
        return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase">Info</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Announcements & Flash Notices</span>
          </h2>
          <p className="text-xs text-slate-400">
            ওয়েবসাইটের শীর্ষ বারে তাৎক্ষণিক নোটিশ ও ব্রডকাস্ট বার্তা প্রকাশ করুন
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিশ প্রকাশ করুন</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl p-5 sm:p-6 border transition-all ${
              ann.status === 'active'
                ? 'bg-[#081022] border-slate-800'
                : 'bg-[#060b17]/70 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                {getTypeBadge(ann.type)}
                <h3 className="text-base font-bold text-white">{ann.title}</h3>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(ann)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    ann.status === 'active'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {ann.status === 'active' ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(ann)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(ann)}
                    className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              {ann.message}
            </p>

            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Start: {ann.start_date ? new Date(ann.start_date).toLocaleDateString() : 'Immediate'}</span>
              </div>
              <div>
                <span>End: {ann.end_date ? new Date(ann.end_date).toLocaleDateString() : 'No expiry'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#081022] border border-slate-800">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">কোনো নোটিশ নেই</h4>
          <p className="text-xs text-slate-400 mt-1">ব্যবহারকারীদের জরুরি তথ্য জানাতে নোটিশ প্রকাশ করুন।</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-[#091224] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'নোটিশ এডিট করুন' : 'নতুন নোটিশ প্রকাশ করুন'}
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
                  Title (শিরোনাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. নতুন রাউটিং নোটিশ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message (বার্তা) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="নোটিশের বিস্তারিত টেক্সট লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notification Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="info">Info (Cyan)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="success">Success (Green)</option>
                    <option value="important">Important (Rose)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="active">Active (Visible on Top Bar)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
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
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  {editingItem ? 'আপডেট সংরক্ষণ করুন' : 'নোটিশ প্রকাশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="নোটিশ মুছে ফেলার সতর্কতা"
        message="আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?"
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        cancelLabel="বাতিল"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
