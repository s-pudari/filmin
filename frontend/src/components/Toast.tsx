import React from 'react';
import { useNotification, Notification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
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
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-cinema-900/95',
    error: 'border-rose-500/30 bg-cinema-900/95',
    warning: 'border-amber-500/30 bg-cinema-900/95',
    info: 'border-sky-500/30 bg-cinema-900/95'
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${borders[notification.type]}`}
    >
      {icons[notification.type]}
      <div className="flex-1 text-sm">
        {notification.title && (
          <h4 className="font-semibold text-white mb-0.5">{notification.title}</h4>
        )}
        <p className="text-slate-300 leading-snug">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded text-slate-400 hover:text-white transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
