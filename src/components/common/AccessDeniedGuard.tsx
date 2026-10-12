import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  KeyRound,
  Lock,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  getPermittedRolesForView,
  ROLE_CONFIGS,
} from '../../services/accessControl';
import { UserRole } from '../../types';

interface AccessDeniedGuardProps {
  requestedView: string;
  onNavigateHome: () => void;
  onOpenRoleSwitcher?: () => void;
  onOpenAccessMatrix?: () => void;
}

export const AccessDeniedGuard: React.FC<AccessDeniedGuardProps> = ({
  requestedView,
  onNavigateHome,
  onOpenRoleSwitcher,
  onOpenAccessMatrix,
}) => {
  const { currentUser, loginAsRole, logout } = useAuth();
  const { showToast } = useNotification();

  const currentRole = currentUser?.role || 'student';
  const currentConfig = ROLE_CONFIGS[currentRole];
  const permittedRoles = getPermittedRolesForView(requestedView);

  const handleSwitchToPermitted = (role: UserRole) => {
    loginAsRole(role);
    showToast('Role Switched', `Now authenticated as ${ROLE_CONFIGS[role].title}`, 'info');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-rose-200 overflow-hidden">
        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-950 p-6 text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-8 h-8 text-rose-300 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-bold uppercase tracking-wider border border-rose-400/30">
              <Lock className="w-3 h-3" />
              RBAC Security Boundary • 403 Forbidden
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">Access Control Restricted</h1>
            <p className="text-xs text-rose-200 mt-0.5">
              Role-Based Access Control has blocked unauthorized view access to protect institutional data isolation.
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Current Session */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Authenticated Session
              </span>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{currentUser?.name || 'Anonymous User'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser?.email}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Security Clearance:</span>
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Level {currentConfig.clearanceLevel} ({currentConfig.title})
                </span>
              </div>
            </div>

            {/* Target View Requirement */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Resource Requirement
              </span>
              <div>
                <span className="text-slate-500">Requested Route:</span>
                <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                  /{requestedView}
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200">
                <span className="text-slate-500 block mb-1">Permitted Roles:</span>
                <div className="flex flex-wrap gap-1">
                  {permittedRoles.length > 0 ? (
                    permittedRoles.map(r => (
                      <span
                        key={r}
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900"
                      >
                        {ROLE_CONFIGS[r].title}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500">Privileged Administration Only</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-slate-100 text-slate-700 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Why am I seeing this screen?</p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                SCIC strictly isolates sensitive administrative functions, campus recruitment databases, ATS candidate pools, and accreditation records. Your currently authenticated role (<strong className="text-slate-900">{currentConfig.title}</strong>) does not have permission to view this section.
              </p>
            </div>
          </div>

          {/* Quick Switch to Permitted Role (if test/demo mode) */}
          {permittedRoles.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Authenticate with an Authorized Role:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {permittedRoles.map(role => {
                  const cfg = ROLE_CONFIGS[role];
                  return (
                    <button
                      key={role}
                      onClick={() => handleSwitchToPermitted(role)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                            {cfg.title}
                          </div>
                          <div className="text-[10px] text-slate-400">{cfg.clearanceLabel}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Authorized Dashboard</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {onOpenAccessMatrix && (
                <button
                  onClick={onOpenAccessMatrix}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Inspect RBAC Matrix</span>
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  showToast('Logged Out', 'You have been signed out.', 'info');
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-xs transition-colors flex items-center gap-1.5"
                title="Log out of current session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
