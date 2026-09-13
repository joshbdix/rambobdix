import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Search, ShieldCheck, Clock, User, Filter } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.admin_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEntity = selectedEntity === 'all' || log.entity_type === selectedEntity;

    return matchesSearch && matchesEntity;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE')) {
      return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">{action}</span>;
    }
    if (action.includes('DELETE')) {
      return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">{action}</span>;
    }
    if (action.includes('LOGIN')) {
      return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">{action}</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">{action}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Admin Audit Logs</span>
        </h2>
        <p className="text-xs text-slate-400">
          প্রশাসকদের সকল কার্যক্রম ও ডেটাবেস পরিবর্তনের সুরক্ষিত ও অপরিবর্তনীয় রেকর্ড (RLS Protected)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#081022] p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search actions, emails, or changes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Entity Types</option>
            <option value="packages">Packages</option>
            <option value="services">Services</option>
            <option value="faqs">FAQs</option>
            <option value="announcements">Announcements</option>
            <option value="settings">Settings</option>
            <option value="auth">Auth</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#081022] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060c1c] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold whitespace-nowrap">
                    {log.admin_email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="py-3 px-4 text-cyan-400 whitespace-nowrap">
                    {log.entity_type}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {log.details}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    কোনো অডিট লগ পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
