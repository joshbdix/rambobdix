import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X, Bell } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcements } = useData();
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem('DISMISSED_ANNOUNCEMENTS');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activeAnnouncements = announcements.filter((a) => {
    if (a.status !== 'active') return false;
    if (dismissedIds.includes(a.id)) return false;
    const now = new Date().getTime();
    if (a.start_date && new Date(a.start_date).getTime() > now) return false;
    if (a.end_date && new Date(a.end_date).getTime() < now) return false;
    return true;
  });

  if (activeAnnouncements.length === 0) return null;

  const current = activeAnnouncements[0];

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      sessionStorage.setItem('DISMISSED_ANNOUNCEMENTS', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200';
      case 'warning':
        return 'bg-amber-950/90 border-amber-500/30 text-amber-200';
      case 'important':
        return 'bg-rose-950/90 border-rose-500/30 text-rose-200';
      case 'info':
      default:
        return 'bg-cyan-950/90 border-cyan-500/30 text-cyan-200';
    }
  };

  return (
    <aside 
      aria-label="Important Announcement"
      className={`w-full py-2.5 px-4 border-b text-xs sm:text-sm font-medium backdrop-blur-md transition-all duration-300 relative z-40 ${getStyle(current.type)}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="p-1 rounded-md bg-white/10 shrink-0">
            {current.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {current.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
            {current.type === 'important' && <AlertCircle className="w-3.5 h-3.5" />}
            {current.type === 'info' && <Bell className="w-3.5 h-3.5" />}
          </span>
          <span className="font-semibold shrink-0 uppercase tracking-wider text-[11px] opacity-90">
            {current.title}:
          </span>
          <span className="truncate">{current.message}</span>
        </div>

        <button
          onClick={() => handleDismiss(current.id)}
          className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
