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
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { loginAsRole } = useAuth();

  const handleLaunchRole = (role: UserRole) => {
    loginAsRole(role);
    onEnterApp();
  };

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
              onClick={() => handleLaunchRole('student')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Launch Demo System</span>
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
              <span>GMR Institute of Technology • Final Year Innovation Project</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Bridging the Gap Between <span className="text-indigo-600">Academic Learning</span> & Industry Demands
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              An intelligent, explainable employability platform connecting graduating engineering students, top corporate recruiters, faculty mentors, alumni, and institutional CDC placement administrators.
            </p>

            {/* Quick 1-Click Role Portals */}
            <div className="pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Experience Instant Interactive Persona Logins (All 6 Roles)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-w-4xl mx-auto">
                <button
                  onClick={() => handleLaunchRole('student')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Student</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Rahul Sharma</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">CSE 4th Year</span>
                </button>

                <button
                  onClick={() => handleLaunchRole('recruiter')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Recruiter</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Microsoft India</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Talent Lead</span>
                </button>

                <button
                  onClick={() => handleLaunchRole('cdc_admin')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">CDC Head</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Dean Placement</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Drive Manager</span>
                </button>

                <button
                  onClick={() => handleLaunchRole('faculty')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Faculty</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Dr. K. V. Rao</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Professor & HOD</span>
                </button>

                <button
                  onClick={() => handleLaunchRole('alumni')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Alumni</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Priya Ananth</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">AWS SDE II</span>
                </button>

                <button
                  onClick={() => handleLaunchRole('institutional_admin')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition-all shadow-2xs group"
                >
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Admin</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Dr. C. Prasad</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Principal / Director</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Pipeline Showcase */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">End-to-End System Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              The SCIC Intelligence Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Every stage uses the same underlying persistent records, propagating instantly across dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="font-bold text-slate-900 text-sm">Student Profile & Resume AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini 3.8 Flash extracts technical skills, project evidence, and certifications without inventing qualifications.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="font-bold text-slate-900 text-sm">Skill-Gap Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates student profile against target roles (Full Stack, Cloud, AI), highlighting matched, partial, and critical missing skills.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="font-bold text-slate-900 text-sm">Explainable 5-Factor Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mathematical matching formula: 40% skills, 25% semantic alignment, 15% experience, 10% academic standing, 10% preferences.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
              <h3 className="font-bold text-slate-900 text-sm">Placement Funnels & Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full ATS pipeline: Applied → Review → Shortlist → Interview → Selected, with exportable NAAC/NIRF metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Credentials Banner */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-3xl font-black text-indigo-400">NAAC 'A'</span>
              <span className="text-xs text-slate-400 block mt-1">Autonomous Institution</span>
            </div>
            <div>
              <span className="text-3xl font-black text-indigo-400">88.4%</span>
              <span className="text-xs text-slate-400 block mt-1">Campus Placement Rate</span>
            </div>
            <div>
              <span className="text-3xl font-black text-indigo-400">₹18 LPA</span>
              <span className="text-xs text-slate-400 block mt-1">Highest Package (Microsoft)</span>
            </div>
            <div>
              <span className="text-3xl font-black text-indigo-400">6 Roles</span>
              <span className="text-xs text-slate-400 block mt-1">Unified Campus Ecosystem</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">GMR Institute of Technology (GMRIT)</span>
            <span className="text-slate-500">• Rajam, Vizianagaram District, Andhra Pradesh</span>
          </div>
          <p className="text-slate-500">
            Smart Campus & Industry Connect System (SCIC) • Enterprise Edition
          </p>
        </div>
      </footer>
    </div>
  );
};
