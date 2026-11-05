import React from 'react';
import { useNotification, Notification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {notifications.map(n => (
        <ToastItem key={n.id} notification={n} onClose={() => removeToast(n.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ notification: Notification; onClose: () => void }> = ({
  notification,
  onClose
}) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-[#090b11]/95 text-emerald-300 shadow-[0_10px_30px_rgba(16,185,129,0.15)]',
    error: 'border-rose-500/30 bg-[#090b11]/95 text-rose-300 shadow-[0_10px_30px_rgba(244,63,94,0.15)]',
    warning: 'border-amber-500/30 bg-[#090b11]/95 text-amber-300 shadow-[0_10px_30px_rgba(245,158,11,0.15)]',
    info: 'border-cyan-500/30 bg-[#090b11]/95 text-cyan-300 shadow-[0_10px_30px_rgba(6,182,212,0.15)]'
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${borders[notification.type]}`}
    >
      <div className="p-1 rounded-lg bg-white/[0.04] mt-0.5">
        {icons[notification.type]}
      </div>
      <div className="flex-1 text-xs">
        {notification.title && (
          <h4 className="font-bold text-white text-sm mb-0.5 tracking-tight font-display">{notification.title}</h4>
        )}
        <p className="text-zinc-300 leading-relaxed font-sans">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
