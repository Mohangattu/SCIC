import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  Lock,
  Minus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  PermissionMatrixItem,
  RBAC_PERMISSION_MATRIX,
  ROLE_CONFIGS,
} from '../../services/accessControl';
import { UserRole } from '../../types';

interface AccessControlMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
}

export const AccessControlMatrixModal: React.FC<AccessControlMatrixModalProps> = ({
  isOpen,
  onClose,
  activeRole = 'student',
  onSelectRole,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<UserRole>(activeRole);

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(RBAC_PERMISSION_MATRIX.map(m => m.category)))];

  const filteredMatrix = RBAC_PERMISSION_MATRIX.filter(item => {
    const matchCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchSearch =
      item.feature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const rolesList: UserRole[] = [
    'student',
    'alumni',
    'faculty',
    'recruiter',
    'cdc_admin',
    'institutional_admin',
  ];

  const currentRoleCfg = ROLE_CONFIGS[selectedRoleDetail];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shrink-0 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">Role-Based Access Control (RBAC) Policy</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Strict Enforcement Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-tier privilege hierarchy & authorization boundaries for all 6 GMRIT SCIC roles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Role Clearance Tiers Horizontal Strip */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {rolesList.map(r => {
              const cfg = ROLE_CONFIGS[r];
              const isSelected = selectedRoleDetail === r;
              const isCurrent = activeRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRoleDetail(r)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-white text-indigo-900 border-indigo-300 shadow-sm ring-2 ring-indigo-500/10'
                      : 'bg-white/60 text-slate-600 border-slate-200 hover:bg-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cfg.clearanceLevel === 5
                        ? 'bg-slate-900'
                        : cfg.clearanceLevel === 4
                        ? 'bg-emerald-500'
                        : cfg.clearanceLevel === 3
                        ? 'bg-indigo-500'
                        : cfg.clearanceLevel === 2
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span>{cfg.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-mono">
                    L{cfg.clearanceLevel}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded-sm font-bold">
                      YOU
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Clearance Inspector */}
        <div className="p-4 bg-indigo-50/40 border-b border-indigo-100 shrink-0 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{currentRoleCfg.title}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  {currentRoleCfg.clearanceLabel}
                </span>
                <span className="text-[10px] text-slate-500">{currentRoleCfg.badgeText}</span>
              </div>
              <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                {currentRoleCfg.description}
              </p>
            </div>
            {onSelectRole && activeRole !== selectedRoleDetail && (
              <button
                onClick={() => {
                  onSelectRole(selectedRoleDetail);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 shrink-0 self-start md:self-center transition-all"
              >
                Authenticate as {currentRoleCfg.title}
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search permissions & features..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-1/3">Feature / Security Scope</th>
                  <th className="py-3 px-2 text-center text-[11px]">
                    Student
                    <span className="block text-[9px] text-slate-400 font-normal">Level 1</span>
                  </th>
                  <th className="py-3 px-2 text-center text-[11px]">
                    Alumni
                    <span className="block text-[9px] text-slate-400 font-normal">Level 2</span>
                  </th>
                  <th className="py-3 px-2 text-center text-[11px]">
                    Faculty
                    <span className="block text-[9px] text-slate-400 font-normal">Level 3</span>
                  </th>
                  <th className="py-3 px-2 text-center text-[11px]">
                    Recruiter
                    <span className="block text-[9px] text-slate-400 font-normal">Level 3</span>
                  </th>
                  <th className="py-3 px-2 text-center text-[11px]">
                    CDC Head
                    <span className="block text-[9px] text-slate-400 font-normal">Level 4</span>
                  </th>
                  <th className="py-3 px-2 text-center text-[11px]">
                    Inst Admin
                    <span className="block text-[9px] text-slate-400 font-normal">Level 5</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.feature}</div>
                      <div className="text-[11px] text-slate-500 leading-snug">{item.description}</div>
                      <span className="inline-block mt-1 text-[9px] uppercase font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {item.category}
                      </span>
                    </td>

                    {/* Student */}
                    <td className="py-3 px-2 text-center">
                      {item.student ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Alumni */}
                    <td className="py-3 px-2 text-center">
                      {item.alumni ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Faculty */}
                    <td className="py-3 px-2 text-center">
                      {item.faculty ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Recruiter */}
                    <td className="py-3 px-2 text-center">
                      {item.recruiter ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* CDC Admin */}
                    <td className="py-3 px-2 text-center">
                      {item.cdc_admin ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Institutional Admin */}
                    <td className="py-3 px-2 text-center">
                      {item.institutional_admin ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Strict Role Isolation enforced via routing guards and storage permission policies.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
