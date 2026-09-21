import React from 'react';
import { Check, ShoppingBag, Heart, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 bg-pure-black text-white p-4 rounded-xl border border-honey-gold/50 shadow-2xl animate-slideUp"
        >
          <div className="w-8 h-8 rounded-full bg-honey-gold text-pure-black flex items-center justify-center shrink-0">
            {toast.type === 'cart' && <ShoppingBag className="w-4 h-4" />}
            {toast.type === 'wishlist' && <Heart className="w-4 h-4 fill-pure-black" />}
            {toast.type === 'info' && <Check className="w-4 h-4" />}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="font-serif-luxury text-sm font-bold text-honey-gold">
              {toast.title}
            </h5>
            <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
