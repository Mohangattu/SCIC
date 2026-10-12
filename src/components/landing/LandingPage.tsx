import React from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck,
  FileText,
  GraduationCap,
  KeyRound,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-950/20">
              <GraduationCap className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">SCIC</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  GMRIT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Smart Campus & Industry Connect System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register or Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>GMR Institute of Technology • Smart Campus & Industry Connect</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Bridging the Gap Between <span className="text-indigo-600">Academic Learning</span> & Industry Demands
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              An intelligent, explainable employability platform connecting graduating engineering students, corporate recruiters, faculty mentors, alumni, and CDC placement administrators.
            </p>

            {/* Call to Actions */}
            <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Your Role</span>
              </button>
              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-indigo-300" />
                <span>Login with Email OTP</span>
              </button>
            </div>

            {/* 6 Institutional Roles Guide */}
            <div className="pt-10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
                Six Dedicated Institutional Stakeholder Portals
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
                {[
                  {
                    title: 'Student',
                    req: 'Ends in @gmrit.edu.in',
                    icon: GraduationCap,
                    desc: 'Resume parsing, skill diagnostics, campus drives',
                  },
                  {
                    title: 'Recruiter',
                    req: 'Corporate Work Email',
                    icon: Briefcase,
                    desc: 'ATS pipeline, screening, candidate interviews',
                  },
                  {
                    title: 'CDC Placement',
                    req: 'Directorate @gmrit.edu.in',
                    icon: ShieldCheck,
                    desc: 'Drive operations, rosters, statutory reports',
                  },
                  {
                    title: 'Faculty Mentor',
                    req: 'Faculty @gmrit.edu.in',
                    icon: Users,
                    desc: 'Mentee dossiers, capstone endorsements',
                  },
                  {
                    title: 'Alumni Network',
                    req: 'Alumni @gmrit.edu.in',
                    icon: Award,
                    desc: '1-on-1 mentorship, internal referrals',
                  },
                  {
                    title: 'Admin Council',
                    req: 'Principal / Deans',
                    icon: Building2,
                    desc: 'Institutional analytics, NBA benchmarks',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      onClick={onEnterApp}
                      className="p-4 rounded-2xl bg-white border border-slate-200 text-left transition-all shadow-xs hover:border-indigo-400 hover:shadow-md cursor-pointer group space-y-1.5"
                    >
                      <Icon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                      <span className="text-[10px] font-semibold text-indigo-600 block">{item.req}</span>
                      <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Employability Architecture
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Strict domain authentication, AI-driven skill readiness verification, explainable job qualification, and statutory NBA/NAAC placement audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Strict Institutional Domain OTP</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforces <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">@gmrit.edu.in</code> email verification for all students and alumni, securing institutional placement records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Explainable Match Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic rule scoring cross-references candidate competencies, CGPA, backlogs, and target roles against corporate hiring criteria.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero Dummy Data Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean state engine where every user registers their own profile, creates real job postings, schedules real drives, and tracks real student applications.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
        <p>GMR Institute of Technology (GMRIT) • Autonomous Institute Affiliated to JNTU-GV, Vizianagaram</p>
      </footer>
    </div>
  );
};
