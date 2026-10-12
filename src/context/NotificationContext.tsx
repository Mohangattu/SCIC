import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, subscribeToDb } from '../services/db';
import { NotificationItem } from '../types';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const loadNotifications = () => {
    if (currentUser) {
      setNotifications(db.getNotifications(currentUser.id));
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const unsub = subscribeToDb(() => {
      loadNotifications();
    });
    return unsub;
  }, [currentUser?.id]);

  const markAsRead = (id: string) => {
    db.markNotificationRead(id);
    loadNotifications();
  };

  const showToast = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        showToast,
        toasts,
        removeToast,
      }}
    >
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 flex items-start justify-between gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-500/30'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-500/30'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <div>
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
