import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContainer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { ServiceItem } from '../../types';
import { 
  Network, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  PlayCircle,
  Cpu,
  ShieldCheck,
  Headphones,
  Settings2,
  Zap,
  Server
} from 'lucide-react';

const availableIcons = [
  { name: 'Network', icon: Network },
  { name: 'PlayCircle', icon: PlayCircle },
  { name: 'Cpu', icon: Cpu },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Headphones', icon: Headphones },
  { name: 'Settings2', icon: Settings2 },
  { name: 'Zap', icon: Zap },
  { name: 'Server', icon: Server },
];

export const AdminServicesPage: React.FC = () => {
  const { services, createService, updateService, deleteService } = useData();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Network');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [sortOrder, setSortOrder] = useState<number>(0);

  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setIcon('Network');
    setStatus('active');
    setSortOrder(services.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (srv: ServiceItem) => {
    setEditingItem(srv);
    setTitle(srv.title);
    setDescription(srv.description);
    setIcon(srv.icon || 'Network');
    setStatus(srv.status);
    setSortOrder(srv.sort_order || 0);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('শিরোনাম এবং বিবরণ উভয়ই পূরণ করুন।', 'error');
      return;
    }

    try {
      if (editingItem) {
        await updateService(editingItem.id, {
          title: title.trim(),
          description: description.trim(),
          icon,
          status,
          sort_order: Number(sortOrder),
        });
        addToast('সার্ভিস সফলভাবে আপডেট করা হয়েছে।', 'success');
      } else {
        await createService({
          title: title.trim(),
          description: description.trim(),
          icon,
          status,
          sort_order: Number(sortOrder),
        });
        addToast('নতুন সার্ভিস সফলভাবে তৈরি করা হয়েছে।', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      addToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    }
  };

  const handleToggleStatus = async (srv: ServiceItem) => {
    const newStatus = srv.status === 'active' ? 'inactive' : 'active';
    try {
      await updateService(srv.id, { status: newStatus });
      addToast(`সার্ভিস ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`, 'info');
    } catch (err: any) {
      addToast(err.message || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।', 'error');
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
      await deleteService(deleteTarget.id);
      addToast(`সার্ভিস "${deleteTarget.title}" মুছে ফেলা হয়েছে।`, 'success');
    } catch (err: any) {
      addToast(err.message || 'সার্ভিস ডিলিট ব্যর্থ হয়েছে।', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Service Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            ওয়েবসাইটে প্রদর্শিত সকল নেটওয়ার্কিং সার্ভিস ও অপ্টিমাইজেশন ক্যাপাবিলিটি ম্যানেজ করুন
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সার্ভিস যোগ করুন</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((srv) => {
            const IconObj = availableIcons.find((i) => i.name === srv.icon) || availableIcons[0];
            const IconComponent = IconObj.icon;

            return (
              <div
                key={srv.id}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                  srv.status === 'active'
                    ? 'bg-[#081022] border-slate-800'
                    : 'bg-[#070b16]/70 border-slate-800/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Order #{srv.sort_order}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{srv.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(srv)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      srv.status === 'active'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {srv.status === 'active' ? (
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(srv)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(srv)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-500/30 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-[#091224] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'সার্ভিস এডিট করুন' : 'নতুন সার্ভিস তৈরি করুন'}
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
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BDIX Bypass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Reliable BDIX Bypass connectivity for a smoother online experience."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((i) => {
                    const IconC = i.icon;
                    const isSelected = icon === i.name;
                    return (
                      <button
                        key={i.name}
                        type="button"
                        onClick={() => setIcon(i.name)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconC className="w-5 h-5" />
                        <span className="text-[10px] truncate max-w-full">{i.name}</span>
                      </button>
                    );
                  })}
                </div>
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
                  {editingItem ? 'আপডেট সংরক্ষণ করুন' : 'সার্ভিস যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="সার্ভিস মুছে ফেলার সতর্কতা"
        message={`আপনি কি নিশ্চিত যে "${deleteTarget?.title}" সার্ভিসটি মুছে ফেলতে চান?`}
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        cancelLabel="বাতিল"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
