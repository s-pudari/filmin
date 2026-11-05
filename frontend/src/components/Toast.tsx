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
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const styles = {
    success: 'border-emerald-200 bg-white text-emerald-900 shadow-lg',
    error: 'border-rose-200 bg-white text-rose-900 shadow-lg',
    warning: 'border-amber-200 bg-white text-amber-900 shadow-lg',
    info: 'border-blue-200 bg-white text-blue-900 shadow-lg'
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl border backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${styles[notification.type]}`}
    >
      <div className="mt-0.5">
        {icons[notification.type]}
      </div>
      <div className="flex-1 text-xs">
        {notification.title && (
          <h4 className="font-bold text-slate-900 text-sm mb-0.5 tracking-tight font-display">{notification.title}</h4>
        )}
        <p className="text-slate-600 leading-relaxed font-sans">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
