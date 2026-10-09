import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration && message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-brand-surface border border-brand-border shadow-lg rounded-full py-3 px-5 animate-in slide-in-from-bottom-5 fade-in duration-300">
      {type === 'success' && <CheckCircle2 className="text-brand-donor" size={20} />}
      <p className="text-[14px] font-medium text-brand-text">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}
