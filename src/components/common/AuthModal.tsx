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
  const { loginWithEmail, registerUser, loginAsRole } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [company, setCompany] = useState('');

  if (!isOpen) return null;

  const users = db.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const ok = loginWithEmail(email);
    if (ok) {
      showToast('Logged In', `Successfully authenticated as ${email}.`, 'success');
      onClose();
    } else {
      showToast('Account Not Found', 'No account found with this email. Please select a demo user below or register.', 'error');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    registerUser(name, email, role, department, company);
    showToast('Account Created', `Welcome to SCIC GMRIT, ${name}! Logged in as ${role}.`, 'success');
    onClose();
  };

  const handleQuickDemoLogin = (userEmail: string) => {
    loginWithEmail(userEmail);
    showToast('Demo Login Active', `Signed in as ${userEmail}`, 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">SCIC Authentication Portal</h2>
              <p className="text-xs text-slate-500">GMR Institute of Technology (GMRIT)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register New Account
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Campus / Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.21cse045@gmrit.edu.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              Sign In to SCIC
            </button>

            {/* Quick Demo Personas */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Or Quick 1-Click Demo Accounts:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(u.email)}
                    className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">{u.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {u.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. suresh.kumar@gmrit.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role *</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter / Industry</option>
                <option value="faculty">Faculty Mentor</option>
                <option value="alumni">Alumni</option>
                <option value="cdc_admin">CDC Placement Administrator</option>
                <option value="institutional_admin">Institutional Administrator</option>
              </select>
            </div>

            {role === 'student' || role === 'faculty' ? (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Infosys / Google / Microsoft"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all mt-2"
            >
              Complete Registration & Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
