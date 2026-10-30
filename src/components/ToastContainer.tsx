import React from 'react';
import { useCart } from '../context/CartContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          <span style={{ fontSize: '1.1rem' }}>{toast.icon || '✨'}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
