import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContainer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { FAQItem } from '../../types';
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  ChevronDown
} from 'lucide-react';

export const AdminFAQsPage: React.FC = () => {
  const { faqs, createFaq, updateFaq, deleteFaq } = useData();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [sortOrder, setSortOrder] = useState<number>(0);

  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setQuestion('');
    setAnswer('');
    setStatus('active');
    setSortOrder(faqs.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingItem(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setStatus(faq.status);
    setSortOrder(faq.sort_order || 0);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      addToast('প্রশ্ন এবং উত্তর উভয়ই পূরণ করা বাধ্যতামূলক।', 'error');
      return;
    }

    try {
      if (editingItem) {
        await updateFaq(editingItem.id, {
          question: question.trim(),
          answer: answer.trim(),
          status,
          sort_order: Number(sortOrder),
        });
        addToast('FAQ সফলভাবে আপডেট করা হয়েছে।', 'success');
      } else {
        await createFaq({
          question: question.trim(),
          answer: answer.trim(),
          status,
          sort_order: Number(sortOrder),
        });
        addToast('নতুন FAQ সফলভাবে তৈরি করা হয়েছে।', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      addToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    }
  };

  const handleToggleStatus = async (faq: FAQItem) => {
    const newStatus = faq.status === 'active' ? 'inactive' : 'active';
    try {
      await updateFaq(faq.id, { status: newStatus });
      addToast(`FAQ ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`, 'info');
    } catch (err: any) {
      addToast(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।', 'error');
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
      await deleteFaq(deleteTarget.id);
      addToast('FAQ মুছে ফেলা হয়েছে।', 'success');
    } catch (err: any) {
      addToast(err.message || 'FAQ মুছে ফেলা সম্ভব হয়নি।', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>FAQ Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            সাধারণ প্রশ্ন ও উত্তরের ডাটাবেস পরিচালনা করুন
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রশ্ন যোগ করুন</span>
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((faq) => (
            <div
              key={faq.id}
              className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                faq.status === 'active'
                  ? 'bg-[#081022] border-slate-800'
                  : 'bg-[#060b17]/70 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    Order #{faq.sort_order}
                  </span>
                  <h3 className="text-base font-bold text-white">{faq.question}</h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(faq)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      faq.status === 'active'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {faq.status === 'active' ? (
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
                    onClick={() => openEditModal(faq)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(faq)}
                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-400 pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-slate-800 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-[#091224] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'FAQ এডিট করুন' : 'নতুন FAQ তৈরি করুন'}
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
                  Question (প্রশ্ন) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BDIX Bypass কী?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Answer (উত্তর) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="বিস্তারিত উত্তর লিখুন..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
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
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
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
                  {editingItem ? 'আপডেট সংরক্ষণ করুন' : 'FAQ যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="FAQ মুছে ফেলার সতর্কতা"
        message="আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?"
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        cancelLabel="বাতিল"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
