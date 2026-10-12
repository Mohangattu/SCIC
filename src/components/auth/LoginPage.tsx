import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ROLE_CONFIGS } from '../../services/accessControl';
import { db } from '../../services/db';
import { UserRole } from '../../types';
import { AccessControlMatrixModal } from '../common/AccessControlMatrixModal';

interface LoginPageProps {
  onEnterLanding?: () => void;
  defaultRole?: UserRole;
}

const PRESET_DEMO_ACCOUNTS: {
  role: UserRole;
  title: string;
  name: string;
  email: string;
  pass: string;
  tier: string;
  badge: string;
  desc: string;
}[] = [
  {
    role: 'student',
    title: 'Student Scholar',
    name: 'Rahul Sharma',
    email: 'rahul.21cse045@gmrit.edu.in',
    pass: 'student@123',
    tier: 'Level 1 Clearance',
    badge: 'CSE 4th Year',
    desc: 'Access coding assessments, AI resume scoring, matching jobs & student profile.',
  },
  {
    role: 'recruiter',
    title: 'Corporate Talent Partner',
    name: 'Vikramaditya Sen',
    email: 'vikram.sen@microsoft.com',
    pass: 'recruiter@123',
    tier: 'Level 3 Clearance',
    badge: 'Microsoft India',
    desc: 'Post job openings, review ATS candidate pipeline & issue campus offers.',
  },
  {
    role: 'cdc_admin',
    title: 'CDC Placement Head (Dean)',
    name: 'Prof. M. Ramana Rao',
    email: 'cdc.head@gmrit.edu.in',
    pass: 'cdc@123',
    tier: 'Level 4 Clearance',
    badge: 'Dean Placement',
    desc: 'Manage campus recruitment drives, student readiness matrix & statutory NIRF/NAAC data.',
  },
  {
    role: 'faculty',
    title: 'Academic Mentor & HOD',
    name: 'Dr. K. Venkata Rao',
    email: 'venkatarao.k@gmrit.edu.in',
    pass: 'faculty@123',
    tier: 'Level 3 Clearance',
    badge: 'Professor & HOD',
    desc: 'Track department readiness, supervise student mentees & endorse capstone projects.',
  },
  {
    role: 'alumni',
    title: 'Distinguished Alumni',
    name: 'Priya Ananth',
    email: 'priya.alumni2022@gmail.com',
    pass: 'alumni@123',
    tier: 'Level 2 Clearance',
    badge: 'AWS SDE II (2022 Batch)',
    desc: 'Host 1-on-1 mentorship sessions, mock technical interviews & post employee referrals.',
  },
  {
    role: 'institutional_admin',
    title: 'Institutional Directorate',
    name: 'Dr. C.L.V.R.S.V. Prasad',
    email: 'principal@gmrit.edu.in',
    pass: 'admin@123',
    tier: 'Level 5 Clearance',
    badge: 'Principal & Director',
    desc: 'Govern campus-wide employment KPIs, NBA accreditation benchmarks & skill market forecasts.',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onEnterLanding }) => {
  const { loginWithCredentials, registerUser, loginAsRole } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'signin' | 'roles' | 'register'>('signin');
  const [email, setEmail] = useState('rahul.21cse045@gmrit.edu.in');
  const [password, setPassword] = useState('student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regCompany, setRegCompany] = useState('');
  const [regRollNumber, setRegRollNumber] = useState('');
  const [regCgpa, setRegCgpa] = useState('8.4');
  const [regTitle, setRegTitle] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginWithCredentials(email, password);
      setLoading(false);
      if (res.success) {
        showToast('Authentication Successful', res.message, 'success');
      } else {
        setErrorMsg(res.message);
        showToast('Sign In Failed', res.message, 'error');
      }
    }, 300);
  };

  const handleDirectRoleLogin = (item: (typeof PRESET_DEMO_ACCOUNTS)[0]) => {
    setEmail(item.email);
    setPassword(item.pass);
    loginAsRole(item.role);
    showToast('Role Authenticated', `Signed in as ${item.name} (${item.title})`, 'success');
  };

  const handleAutoFill = (item: (typeof PRESET_DEMO_ACCOUNTS)[0]) => {
    setEmail(item.email);
    setPassword(item.pass);
    setActiveTab('signin');
    showToast('Credentials Filled', `Filled email and password for ${item.title}. Click "Sign In".`, 'info');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill all mandatory fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerUser(
        regName,
        regEmail,
        regRole,
        regPassword,
        regDepartment,
        regCompany,
        {
          rollNumber: regRollNumber || undefined,
          cgpa: parseFloat(regCgpa) || 8.0,
          title: regTitle || undefined,
        }
      );
      setLoading(false);
      if (res.success) {
        showToast('Account Created & Authenticated', res.message, 'success');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Navigation Strip */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">SCIC</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                GMRIT
              </span>
            </div>
            <p className="text-xs text-slate-400">Smart Campus & Industry Connect Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMatrixModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RBAC Security Policy</span>
          </button>

          {onEnterLanding && (
            <button
              onClick={onEnterLanding}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
            >
              <span>Public Landing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero Sidebar */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-8 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20 mb-6">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enterprise Authentication Gateway</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Secure Access for Every Campus Stakeholder
              </h1>
              <p className="text-xs text-indigo-200/80 mt-3 leading-relaxed">
                SCIC implements fine-grained Role-Based Access Control (RBAC) with strict authorization boundaries across all 6 roles.
              </p>

              {/* Clearance Tier List */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-indigo-200">Level 1 • Student Scholar</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Learner</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-indigo-200">Level 2 • Alumni Network</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Contributor</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-indigo-200">Level 3 • Faculty / Recruiter</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Academic & Industry</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-indigo-200">Level 4 • CDC Placement Head</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Executive</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="font-semibold text-indigo-200">Level 5 • Institutional Director</span>
                  <span className="text-[10px] bg-slate-300/20 text-slate-200 px-2 py-0.5 rounded">Directorate</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 text-[11px] text-indigo-300/80">
              <p>GMR Institute of Technology • Rajam, AP</p>
              <p className="text-[10px] text-indigo-400 mt-0.5">Autonomous • NAAC 'A' Grade • NBA Accredited</p>
            </div>
          </div>

          {/* Right Form Desk */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Navigation Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold mb-6">
                <button
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all ${
                    activeTab === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In with Credentials
                </button>
                <button
                  onClick={() => {
                    setActiveTab('roles');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all ${
                    activeTab === 'roles'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Quick Role Logins (6 Roles)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register Account
                </button>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: SIGN IN */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      Campus / Corporate Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. rahul.21cse045@gmrit.edu.in"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-700 font-semibold">Password</label>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Default: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">role@123</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">password123</code>
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{loading ? 'Authenticating...' : 'Sign In to SCIC Workspace'}</span>
                  </button>

                  {/* Credentials quick chips */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Quick Auto-Fill Test Credentials:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {PRESET_DEMO_ACCOUNTS.map(item => (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => handleAutoFill(item)}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all"
                        >
                          <div className="font-semibold text-slate-800 text-[11px] truncate">{item.title}</div>
                          <div className="text-[9px] text-slate-400 font-mono truncate">{item.pass}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: QUICK ROLE LOGINS (6 ROLES) */}
              {activeTab === 'roles' && (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Click any persona below to immediately authenticate and launch their role-specific workspace with full RBAC access permissions:
                  </p>
                  {PRESET_DEMO_ACCOUNTS.map(item => {
                    const cfg = ROLE_CONFIGS[item.role];
                    return (
                      <div
                        key={item.role}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/50"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-indigo-100 text-indigo-700">
                              {item.tier}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {item.name} • <span className="text-slate-400 font-mono">{item.email}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{item.desc}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleDirectRoleLogin(item)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1"
                          >
                            <span>Sign In</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: REGISTER NEW ROLE ACCOUNT */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Suresh Kumar"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="e.g. suresh.kumar@gmrit.edu.in"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Account Role *</label>
                      <select
                        value={regRole}
                        onChange={e => setRegRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="student">Student Scholar (Level 1)</option>
                        <option value="alumni">Alumni Contributor (Level 2)</option>
                        <option value="faculty">Academic Faculty (Level 3)</option>
                        <option value="recruiter">Corporate Recruiter (Level 3)</option>
                        <option value="cdc_admin">CDC Placement Head (Level 4)</option>
                        <option value="institutional_admin">Institutional Admin (Level 5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Account Password *</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Set strong password"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  {/* Role-Specific Fields */}
                  {regRole === 'student' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Roll Number</label>
                        <input
                          type="text"
                          value={regRollNumber}
                          onChange={e => setRegRollNumber(e.target.value)}
                          placeholder="e.g. 21341A0589"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Department</label>
                        <select
                          value={regDepartment}
                          onChange={e => setRegDepartment(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        >
                          <option value="Computer Science & Engineering">CSE</option>
                          <option value="Information Technology">IT</option>
                          <option value="Electronics & Communication Engineering">ECE</option>
                          <option value="Artificial Intelligence & Data Science">AI & DS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Current CGPA</label>
                        <input
                          type="number"
                          step="0.01"
                          value={regCgpa}
                          onChange={e => setRegCgpa(e.target.value)}
                          placeholder="8.5"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {regRole === 'recruiter' && (
                    <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Company Name</label>
                        <input
                          type="text"
                          value={regCompany}
                          onChange={e => setRegCompany(e.target.value)}
                          placeholder="e.g. Amazon / Google"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Corporate Designation</label>
                        <input
                          type="text"
                          value={regTitle}
                          onChange={e => setRegTitle(e.target.value)}
                          placeholder="e.g. Talent Lead"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {(regRole === 'faculty' || regRole === 'alumni' || regRole === 'cdc_admin' || regRole === 'institutional_admin') && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Department / Organization</label>
                        <input
                          type="text"
                          value={regRole === 'faculty' ? regDepartment : regCompany}
                          onChange={e => (regRole === 'faculty' ? setRegDepartment(e.target.value) : setRegCompany(e.target.value))}
                          placeholder="e.g. CSE Department / AWS"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Designation Title</label>
                        <input
                          type="text"
                          value={regTitle}
                          onChange={e => setRegTitle(e.target.value)}
                          placeholder="e.g. Associate Professor / SDE II"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{loading ? 'Registering Account...' : 'Create Account & Enter Workspace'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Footer Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => setShowMatrixModal(true)}
                className="hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>View Full RBAC Matrix & Access Permissions</span>
              </button>

              <span>GMRIT SCIC v2.5</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400 pt-4">
        GMR Institute of Technology • Smart Campus & Industry Connect System • Role-Based Access Control Architecture
      </footer>

      {/* RBAC Modal */}
      <AccessControlMatrixModal
        isOpen={showMatrixModal}
        onClose={() => setShowMatrixModal(false)}
        activeRole={regRole}
        onSelectRole={role => {
          const acc = PRESET_DEMO_ACCOUNTS.find(a => a.role === role);
          if (acc) {
            handleDirectRoleLogin(acc);
          } else {
            loginAsRole(role);
          }
        }}
      />
    </div>
  );
};
