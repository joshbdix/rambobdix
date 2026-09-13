import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastContainer';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { PackageItem } from '../../types';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowUpDown,
  Gauge,
  Zap,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

export const AdminPackagesPage: React.FC = () => {
  const { packages, createPackage, updatePackage, deletePackage, loading } = useData();
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [internetSpeed, setInternetSpeed] = useState('30 Mbps');
  const [serviceSpeed, setServiceSpeed] = useState('3.75 Mbps');
  const [price, setPrice] = useState('75');
  const [duration, setDuration] = useState('24 Hours');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['YouTube 30 Mbps', 'Facebook 30 Mbps', 'Steam / Epic ETC 30 Mbps', 'BDIX / Streaming 3.75 Mbps']);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [badge, setBadge] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [sortOrder, setSortOrder] = useState<number>(0);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<PackageItem | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setInternetSpeed('30 Mbps');
    setServiceSpeed('3.75 Mbps');
    setPrice('75');
    setDuration('24 Hours');
    setDescription('');
    setFeatures(['YouTube 30 Mbps', 'Facebook 30 Mbps', 'Steam / Epic ETC 30 Mbps', 'BDIX / Streaming 3.75 Mbps', 'Bufferless Experience', 'Standard Telegram Support']);
    setBadge('');
    setStatus('active');
    setSortOrder(packages.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (pkg: PackageItem) => {
    setEditingItem(pkg);
    setName(pkg.name);
    setInternetSpeed(pkg.internet_speed || '30 Mbps');
    setServiceSpeed(pkg.service_speed || '3.75 Mbps');
    setPrice(pkg.price);
    setDuration(pkg.duration || '24 Hours');
    setDescription(pkg.description || '');
    setFeatures(Array.isArray(pkg.features) ? [...pkg.features] : []);
    setBadge(pkg.badge || '');
    setStatus(pkg.status);
    setSortOrder(pkg.sort_order || 0);
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('প্যাকেজের নাম আবশ্যক।', 'error');
      return;
    }
    if (!internetSpeed.trim()) {
      addToast('Internet Speed আবশ্যক।', 'error');
      return;
    }
    if (!serviceSpeed.trim()) {
      addToast('BDIX/Streaming Speed আবশ্যক।', 'error');
      return;
    }

    try {
      if (editingItem) {
        await updatePackage(editingItem.id, {
          name: name.trim(),
          internet_speed: internetSpeed.trim(),
          service_speed: serviceSpeed.trim(),
          price: price.trim(),
          duration: duration.trim(),
          description: description.trim(),
          features,
          badge: badge.trim(),
          status,
          sort_order: Number(sortOrder),
        });
        addToast('প্যাকেজ সফলভাবে আপডেট করা হয়েছে।', 'success');
      } else {
        await createPackage({
          name: name.trim(),
          internet_speed: internetSpeed.trim(),
          service_speed: serviceSpeed.trim(),
          price: price.trim(),
          duration: duration.trim(),
          description: description.trim(),
          features,
          badge: badge.trim(),
          status,
          sort_order: Number(sortOrder),
        });
        addToast('নতুন প্যাকেজ সফলভাবে তৈরি করা হয়েছে।', 'success');
      }
      setModalOpen(false);
    } catch (err: any) {
      addToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', 'error');
    }
  };

  const handleToggleStatus = async (pkg: PackageItem) => {
    const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
    try {
      await updatePackage(pkg.id, { status: newStatus });
      addToast(`প্যাকেজ ${newStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`, 'info');
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
      await deletePackage(deleteTarget.id);
      addToast(`প্যাকেজ "${deleteTarget.name}" মুছে ফেলা হয়েছে।`, 'success');
    } catch (err: any) {
      addToast(err.message || 'প্যাকেজ ডিলিট ব্যর্থ হয়েছে।', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedPackages = [...packages].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <span>Package Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            ওয়েবসাইটে প্রদর্শিত সকল প্যাকেজ ও প্রাইসিং কনফিগার করুন (Internet Speed ও BDIX/Streaming Speed সহ)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* View toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'cards'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্যাকেজ তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Package List Table View */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-[#081022] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Package</th>
                  <th className="py-4 px-5">Internet Speed</th>
                  <th className="py-4 px-5">BDIX / Streaming Speed</th>
                  <th className="py-4 px-5">Price</th>
                  <th className="py-4 px-5">Duration</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {sortedPackages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      pkg.status === 'inactive' ? 'opacity-60 bg-slate-950/40' : ''
                    }`}
                  >
                    {/* Package */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                          #{pkg.sort_order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm uppercase tracking-wide">
                              {pkg.name}
                            </span>
                            {pkg.badge && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          {pkg.description && (
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                              {pkg.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Internet Speed */}
                    <td className="py-4 px-5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div>
                          <span className="font-mono font-bold text-cyan-300 text-xs sm:text-sm">
                            {pkg.internet_speed || '30 Mbps'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* BDIX / Streaming Speed */}
                    <td className="py-4 px-5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
                            {pkg.service_speed || '3.75 Mbps'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-5">
                      <span className="font-mono font-extrabold text-white text-sm">
                        ৳{pkg.price}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-slate-300 text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
                        {pkg.duration || '24 Hours'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(pkg)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          pkg.status === 'active'
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Click to toggle status"
                      >
                        {pkg.status === 'active' ? (
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
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(pkg)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                          title="Edit Package"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(pkg)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-500/30 transition-colors"
                            title="Delete Package"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Package Cards List View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                pkg.status === 'active'
                  ? 'bg-[#081022] border-slate-800'
                  : 'bg-[#070b16]/70 border-slate-800/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-400">
                    Order #{pkg.sort_order}
                  </span>
                  {pkg.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold text-white uppercase">{pkg.name}</h3>
                  <div className="text-xl font-bold font-mono text-cyan-400">
                    ৳{pkg.price} <span className="text-xs text-slate-400">/{pkg.duration}</span>
                  </div>
                </div>

                {/* Speed metrics */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-cyan-400" />
                      Internet Speed
                    </span>
                    <span className="text-xs font-bold font-mono text-cyan-300">{pkg.internet_speed || '30 Mbps'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      BDIX / Streaming
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-400">{pkg.service_speed || '3.75 Mbps'}</span>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-xs text-slate-400 mb-4">{pkg.description}</p>
                )}

                <div className="space-y-1.5 mb-6">
                  {Array.isArray(pkg.features) && pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(pkg)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    pkg.status === 'active'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {pkg.status === 'active' ? (
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
                    onClick={() => openEditModal(pkg)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                    title="Edit Package"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(pkg)}
                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-600/60 border border-rose-500/30 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {packages.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#081022] border border-slate-800">
          <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">কোনো প্যাকেজ নেই</h4>
          <p className="text-xs text-slate-400 mt-1">প্রথম প্যাকেজ যোগ করতে উপরের বাটনে ক্লিক করুন।</p>
        </div>
      )}

      {/* Package Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-xl w-full bg-[#091224] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'প্যাকেজ সম্পাদনা (Edit Package)' : 'নতুন প্যাকেজ তৈরি (Create Package)'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKY"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price (BDT) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 75"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Separate Speed Fields: Internet Speed & BDIX/Streaming Speed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Internet Speed *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Mbps"
                    value={internetSpeed}
                    onChange={(e) => setInternetSpeed(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400">YouTube, Facebook, Steam, Browsing Speed</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BDIX/Streaming Speed *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3.75 Mbps"
                    value={serviceSpeed}
                    onChange={(e) => setServiceSpeed(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400">BDIX Dedicated Bypass / Stream Speed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starter, Popular, Flagship"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. দৈনন্দিন ব্রাউজিং ও এন্ট্রি-লেভেল BDIX বাইপাস কানেক্টিভিটি।"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Dynamic Features List */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Features Included
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add feature e.g. YouTube 30 Mbps"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-900/50 rounded-xl border border-slate-800">
                  {features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs border border-slate-700"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {features.length === 0 && (
                    <span className="text-xs text-slate-500 italic p-1">কোনো ফিচার যোগ করা হয়নি।</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="pkg_status"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="text-cyan-500 focus:ring-0"
                    />
                    <span>Active (ওয়েবসাইটে প্রদর্শিত হবে)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="pkg_status"
                      checked={status === 'inactive'}
                      onChange={() => setStatus('inactive')}
                      className="text-cyan-500 focus:ring-0"
                    />
                    <span>Inactive (লুকানো থাকবে)</span>
                  </label>
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
                  {editingItem ? 'আপডেট সংরক্ষণ করুন' : 'প্যাকেজ তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="প্যাকেজ মুছে ফেলার সতর্কতা"
        message={`আপনি কি নিশ্চিত যে "${deleteTarget?.name}" প্যাকেজটি চিরতরে মুছে ফেলতে চান? এই অ্যাকশনটি অডিট লগে রেকর্ড হবে।`}
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        cancelLabel="বাতিল"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
