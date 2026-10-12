import React, { useState } from 'react';
import {
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { logout } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Session Management</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          To switch accounts or authenticate with a different role, please log out to return to the GMRIT OTP authentication portal.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
};
