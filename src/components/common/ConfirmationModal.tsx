import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'নিশ্চিত করুন',
  cancelLabel = 'বাতিল',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#0b1329] border border-slate-700/70 p-6 shadow-2xl relative text-left"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`p-3 rounded-xl shrink-0 ${isDestructive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
            {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
            <p className="text-xs text-slate-400">এই অ্যাকশনটি সাবধানে যাচাই করুন</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-lg ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 hover:shadow-rose-900/80'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
