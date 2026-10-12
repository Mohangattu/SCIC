import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  LogOut,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { UserRole } from '../../types';

interface NavbarProps {
  onNavigateLanding?: () => void;
  activeView?: string;
  setActiveView?: (view: string) => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; badgeBg: string; badgeText: string }> = {
  student: { label: 'Student', badgeBg: 'bg-blue-100 text-blue-800 border-blue-200', badgeText: 'GMRIT Student' },
  recruiter: { label: 'Recruiter', badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200', badgeText: 'Corporate Partner' },
  cdc_admin: { label: 'CDC Placement Head', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200', badgeText: 'CDC Directorate' },
  faculty: { label: 'Faculty Mentor', badgeBg: 'bg-purple-100 text-purple-800 border-purple-200', badgeText: 'Faculty' },
  alumni: { label: 'Alumni Network', badgeBg: 'bg-amber-100 text-amber-800 border-amber-200', badgeText: 'Alumnus' },
  institutional_admin: { label: 'Institutional Admin', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300', badgeText: 'Academic Council' },
};

export const Navbar: React.FC<NavbarProps> = ({ onNavigateLanding, setActiveView }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, showToast } = useNotification();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleResetData = () => {
    if (confirm('Clear all local storage records (users, applications, drives) and reset to clean state?')) {
      db.resetAllDemoData();
      logout();
      showToast('Store Cleared', 'All local storage records cleared. Please register a new account.', 'info');
    }
  };

  const currentRole = currentUser?.role || 'student';
  const roleInfo = ROLE_LABELS[currentRole] || ROLE_LABELS.student;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Institution Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateLanding && onNavigateLanding()}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
              title="Return to SCIC Landing & Vision Portal"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-lg">SCIC</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    GMRIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Smart Campus & Industry Connect</p>
              </div>
            </button>

            {/* Role Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200 ml-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{roleInfo.label}</span>
            </div>
          </div>

          {/* Right Action Controls: Notification, Clean Data, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Notifications ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium text-slate-900 mb-0.5">
                            <span className="line-clamp-1">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reset / Wipe Store Button */}
            <button
              onClick={handleResetData}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset Database to Clean State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Profile Avatar & Menu */}
            <div className="relative pl-2 border-l border-slate-200">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {currentUser?.name
                    ? currentUser.name
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'U'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight line-clamp-1">
                    {currentUser?.name || 'Verified User'}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-none">
                    {currentUser?.email || roleInfo.badgeText}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 block">{currentUser?.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono block truncate">{currentUser?.email}</span>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 mt-1 inline-block">
                      Role: {roleInfo.label}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        showToast('Logged Out', 'You have been signed out. Please authenticate with OTP.', 'info');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 font-medium text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
