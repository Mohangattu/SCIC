import React from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  FileCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  Share2,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_CONFIGS } from '../../services/accessControl';
import { UserRole } from '../../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAi?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { currentUser } = useAuth();
  const role: UserRole = currentUser?.role || 'student';
  const roleConfig = ROLE_CONFIGS[role];

  const getNavItems = (): { section: string; items: NavItem[] }[] => {
    switch (role) {
      case 'student':
        return [
          {
            section: 'Core Career Hub',
            items: [
              { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
              { id: 'resume-ai', label: 'AI Resume Intelligence', icon: Sparkles, badge: 'Gemini 3.8', isAi: true },
              { id: 'skill-gap', label: 'Skill-Gap & Roadmap', icon: TrendingUp, isAi: true },
              { id: 'opportunities', label: 'Opportunities & Jobs', icon: Briefcase, badge: 'Matching' },
              { id: 'applications', label: 'Application Tracker', icon: Clock },
            ],
          },
          {
            section: 'Profile & Credentials',
            items: [
              { id: 'profile', label: 'Profile & Skills Matrix', icon: UserCheck },
              { id: 'assessments', label: 'Skill Assessments Hub', icon: Award, badge: 'Verified' },
              { id: 'portfolio', label: 'Digital Portfolio', icon: Share2 },
            ],
          },
        ];

      case 'recruiter':
        return [
          {
            section: 'Recruitment Desk',
            items: [
              { id: 'dashboard', label: 'ATS Overview', icon: LayoutDashboard },
              { id: 'post-job', label: 'Post New Opportunity', icon: PlusCircle, isAi: true, badge: 'AI Assist' },
              { id: 'pipeline', label: 'Candidate Pipeline', icon: Users, badge: 'Active' },
              { id: 'profile', label: 'Company Profile', icon: Building2 },
            ],
          },
        ];

      case 'cdc_admin':
        return [
          {
            section: 'Career Development Cell',
            items: [
              { id: 'dashboard', label: 'Placement Executive Hub', icon: LayoutDashboard },
              { id: 'drives', label: 'Campus Drives Calendar', icon: Calendar },
              { id: 'readiness', label: 'Student Readiness Matrix', icon: FileCheck },
              { id: 'analytics', label: 'Placement Funnel & Export', icon: BarChart3, badge: 'NAAC/NIRF' },
            ],
          },
        ];

      case 'faculty':
        return [
          {
            section: 'Faculty & Mentorship',
            items: [
              { id: 'dashboard', label: 'Department Readiness', icon: LayoutDashboard },
              { id: 'mentees', label: 'Student Mentees', icon: GraduationCap },
              { id: 'collaborations', label: 'Industry & FDP Projects', icon: Briefcase },
            ],
          },
        ];

      case 'alumni':
        return [
          {
            section: 'Alumni Network',
            items: [
              { id: 'dashboard', label: 'Alumni Portal', icon: LayoutDashboard },
              { id: 'mentorships', label: 'Mentorship Sessions', icon: Users, badge: '1-on-1' },
              { id: 'post-opportunity', label: 'Refer / Share Opening', icon: PlusCircle },
            ],
          },
        ];

      case 'institutional_admin':
        return [
          {
            section: 'Institutional Governance',
            items: [
              { id: 'dashboard', label: 'Institutional Analytics', icon: BarChart3 },
              { id: 'departments', label: 'Department Comparison', icon: Building2 },
              { id: 'skill-trends', label: 'Industry Skill Trends', icon: Compass, badge: 'Market' },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navSections = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Role Title Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {roleConfig?.clearanceLabel.split(':')[0] || 'Clearance Tier'}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            Level {roleConfig?.clearanceLevel || 1}
          </span>
        </div>
        <div className="font-bold text-white text-sm mt-1 flex items-center gap-1.5">
          <span>{roleConfig?.title || role.replace('_', ' ')}</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          {currentUser?.name || 'Verified User'}
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {section.section}
            </h3>
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAi ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                        item.isAi
                          ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                          : isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-medium">
          <GraduationCap className="w-4 h-4" />
          <span>GMRIT Rajam, AP</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Autonomous • NAAC 'A' Grade • NBA Accredited</p>
      </div>
    </aside>
  );
};
