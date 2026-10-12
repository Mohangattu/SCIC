import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  GraduationCap,
  KeyRound,
  Layers,
  Lock,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db, validateRoleEmail } from '../../services/db';
import { RegistrationPayload, UserRole } from '../../types';

interface AuthPortalProps {
  onNavigateLanding?: () => void;
  defaultMode?: 'register' | 'login';
}

const ROLE_CONFIGS: Record<
  UserRole,
  {
    title: string;
    subtitle: string;
    badge: string;
    emailHint: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  student: {
    title: 'Engineering Student',
    subtitle: 'Undergraduate student seeking campus placements & skill diagnostics',
    badge: 'Requires @gmrit.edu.in',
    emailHint: 'e.g. 21341a0501@gmrit.edu.in or your_roll@gmrit.edu.in',
    icon: GraduationCap,
    accentColor: 'indigo',
  },
  recruiter: {
    title: 'Corporate Recruiter',
    subtitle: 'Hiring partner screening and recruiting engineering talent',
    badge: 'Corporate Work Email',
    emailHint: 'e.g. talent.lead@microsoft.com or recruiter@amazon.com',
    icon: Briefcase,
    accentColor: 'blue',
  },
  cdc_admin: {
    title: 'CDC Placement Head',
    subtitle: 'Directorate of Career Development Cell managing campus placement drives',
    badge: 'Requires @gmrit.edu.in',
    emailHint: 'e.g. cdc.head@gmrit.edu.in or placement@gmrit.edu.in',
    icon: ShieldCheck,
    accentColor: 'emerald',
  },
  faculty: {
    title: 'Faculty Mentor',
    subtitle: 'Department faculty monitoring mentee readiness & capstone endorsements',
    badge: 'Requires @gmrit.edu.in',
    emailHint: 'e.g. faculty.name@gmrit.edu.in',
    icon: Users,
    accentColor: 'purple',
  },
  alumni: {
    title: 'Alumni Network',
    subtitle: 'Graduated alumni offering 1-on-1 mentorship & employee referrals',
    badge: 'Requires @gmrit.edu.in',
    emailHint: 'e.g. alumni.name@gmrit.edu.in (verified GMRIT domain)',
    icon: Award,
    accentColor: 'amber',
  },
  institutional_admin: {
    title: 'Institutional Admin',
    subtitle: 'Principal, Deans & Academic Council monitoring governance analytics',
    badge: 'Requires @gmrit.edu.in',
    emailHint: 'e.g. principal@gmrit.edu.in or dean.academics@gmrit.edu.in',
    icon: Building2,
    accentColor: 'slate',
  },
};

export const AuthPortal: React.FC<AuthPortalProps> = ({ onNavigateLanding, defaultMode = 'register' }) => {
  const { requestOtp, verifyOtpAndLogin, registerUser } = useAuth();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'register' | 'login'>(defaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Common fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 98480 ');

  // Student fields
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(2025);
  const [cgpa, setCgpa] = useState<string>('8.45');
  const [standingBacklogs, setStandingBacklogs] = useState<number>(0);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');

  // Recruiter fields
  const [company, setCompany] = useState('');
  const [recruiterTitle, setRecruiterTitle] = useState('University Talent Acquisition Lead');
  const [industry, setIndustry] = useState('Software & Cloud Technology');
  const [recruiterLocation, setRecruiterLocation] = useState('Hyderabad / Bengaluru');

  // Faculty fields
  const [facultyId, setFacultyId] = useState('GMRIT-FAC-');
  const [facultyTitle, setFacultyTitle] = useState('Professor & Head of Department');
  const [specialization, setSpecialization] = useState('Distributed Systems & Cloud Computing');

  // Alumni fields
  const [alumniBatch, setAlumniBatch] = useState<number>(2022);
  const [alumniCompany, setAlumniCompany] = useState('Amazon Web Services');
  const [alumniTitle, setAlumniTitle] = useState('Software Development Engineer II');
  const [alumniLinkedin, setAlumniLinkedin] = useState('https://linkedin.com/in/');

  // CDC / Admin fields
  const [employeeId, setEmployeeId] = useState('GMRIT-STAFF-01');
  const [adminTitle, setAdminTitle] = useState('Principal & Academic Director');

  // OTP Step States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [deliveredOtp, setDeliveredOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation error live feedback
  const [emailError, setEmailError] = useState<string | null>(null);

  // Auto-fill test roll or email template helper
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsOtpStep(false);
    setDeliveredOtp(null);
    setEnteredOtp('');
    setEmailError(null);

    // Provide helpful institutional format template
    if (role === 'student' && (!email || !email.includes('@gmrit.edu.in'))) {
      setEmail('');
    } else if (role === 'alumni' && (!email || !email.includes('@gmrit.edu.in'))) {
      setEmail('');
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (isOtpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, resendTimer]);

  // Live email validation on change
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val) {
      setEmailError(null);
      return;
    }
    const check = validateRoleEmail(selectedRole, val);
    if (!check.isValid) {
      setEmailError(check.error || 'Invalid email format');
    } else {
      setEmailError(null);
    }
  };

  // -------------------------------------------------------------
  // STEP 1: REQUEST OTP (FOR REGISTRATION OR LOGIN)
  // -------------------------------------------------------------
  const handleInitiateOtp = (e: React.FormEvent) => {
    e.preventDefault();

    const emailCheck = validateRoleEmail(selectedRole, email);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error || 'Email validation failed');
      showToast('Validation Error', emailCheck.error || 'Please check email format', 'error');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'login') {
      // Check if user is registered
      const existing = db.getUserByEmail(email);
      if (!existing) {
        setIsSubmitting(false);
        showToast(
          'Account Not Found',
          `No registered account found for ${email}. Please register your role first.`,
          'error'
        );
        return;
      }
    } else {
      // In register mode, check if already registered
      const existing = db.getUserByEmail(email);
      if (existing) {
        setIsSubmitting(false);
        showToast(
          'Account Exists',
          `This email is already registered as ${existing.role.toUpperCase()}. Please use Login mode.`,
          'info'
        );
        setMode('login');
        return;
      }
    }

    // Generate & store OTP
    const otpRes = requestOtp(email, selectedRole);
    setIsSubmitting(false);

    if (otpRes.success && otpRes.otp) {
      setDeliveredOtp(otpRes.otp);
      setIsOtpStep(true);
      setResendTimer(30);
      showToast(
        'OTP Sent Successfully',
        `Verification OTP code has been delivered to ${email}.`,
        'success'
      );
    } else {
      showToast('Failed to Generate OTP', otpRes.message, 'error');
    }
  };

  // -------------------------------------------------------------
  // STEP 2: VERIFY OTP AND FINALIZE (LOGIN OR REGISTER)
  // -------------------------------------------------------------
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim() || enteredOtp.trim().length < 6) {
      showToast('Invalid Input', 'Please enter the 6-digit OTP code.', 'error');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'login') {
      const res = verifyOtpAndLogin(email, enteredOtp);
      setIsSubmitting(false);
      if (res.success) {
        showToast('Authentication Successful', `Welcome back, ${res.user?.name}!`, 'success');
      } else {
        showToast('Login Failed', res.message, 'error');
      }
    } else {
      // Registration mode
      // First verify OTP
      const check = requestOtp(email, selectedRole); // ensures otp was requested
      if (deliveredOtp && enteredOtp.trim() !== deliveredOtp.trim()) {
        setIsSubmitting(false);
        showToast('Verification Error', 'Invalid OTP code entered. Please check and try again.', 'error');
        return;
      }

      // Build Role Payload
      let payload: RegistrationPayload;
      if (selectedRole === 'student') {
        payload = {
          role: 'student',
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          rollNumber: rollNumber.trim().toUpperCase(),
          department,
          graduationYear,
          cgpa: parseFloat(cgpa) || 8.0,
          standingBacklogs: Number(standingBacklogs) || 0,
          targetRole: targetRole.trim(),
        };
      } else if (selectedRole === 'recruiter') {
        payload = {
          role: 'recruiter',
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          company: company.trim() || 'Enterprise Tech Corp',
          title: recruiterTitle.trim(),
          industry,
          location: recruiterLocation,
        };
      } else if (selectedRole === 'faculty') {
        payload = {
          role: 'faculty',
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          department,
          employeeId: facultyId.trim(),
          title: facultyTitle.trim(),
          specialization: specialization.trim(),
        };
      } else if (selectedRole === 'alumni') {
        payload = {
          role: 'alumni',
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          department,
          graduationYear: alumniBatch,
          company: alumniCompany.trim(),
          title: alumniTitle.trim(),
          location: 'Hyderabad / Bengaluru',
          linkedin: alumniLinkedin.trim(),
        };
      } else if (selectedRole === 'cdc_admin') {
        payload = {
          role: 'cdc_admin',
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          employeeId: employeeId.trim(),
          title: 'Director - Career Development Cell',
          department: 'CDC Directorate',
        };
      } else {
        payload = {
          role: 'institutional_admin',
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          employeeId: employeeId.trim(),
          title: adminTitle.trim(),
          department: 'Academic Council & Directorate',
        };
      }

      const regRes = registerUser(payload);
      setIsSubmitting(false);

      if (regRes.success) {
        showToast(
          'Registration Complete',
          `Welcome to SCIC, ${regRes.user?.name}! Your verified ${regRes.user?.role} profile is ready.`,
          'success'
        );
      } else {
        showToast('Registration Error', regRes.message, 'error');
      }
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const res = requestOtp(email, selectedRole);
    if (res.success && res.otp) {
      setDeliveredOtp(res.otp);
      setResendTimer(30);
      showToast('New OTP Sent', `A fresh 6-digit OTP code has been delivered to ${email}.`, 'info');
    }
  };

  const currentRoleConfig = ROLE_CONFIGS[selectedRole];
  const RoleIcon = currentRoleConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 font-bold">
              <GraduationCap className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg tracking-tight">SCIC</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GMRIT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Smart Campus & Industry Connect Platform</p>
            </div>
          </div>

          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Campus Vision & Features</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 relative z-10 flex-1 flex flex-col justify-center">
        {/* Simulated Institutional Mail Delivery Banner (Shows the real OTP for fast testing) */}
        {isOtpStep && deliveredOtp && (
          <div className="mb-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-2xl p-4 shadow-xl text-xs space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between text-indigo-300 font-semibold border-b border-indigo-800/60 pb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>[GMRIT SCIC Security Dispatcher] Email Delivered</span>
              </div>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                Status: Delivered to {email}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-slate-300">
                  Your One-Time Password (OTP) for GMRIT SCIC authentication is:
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-2xl font-black text-amber-400 font-mono tracking-widest bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/30">
                    {deliveredOtp}
                  </span>
                  <button
                    onClick={() => {
                      setEnteredOtp(deliveredOtp);
                      showToast('OTP Auto-filled', 'Verification code copied into input field.', 'info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Auto-Fill OTP</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Code expires in 10 minutes. For testing purposes, copy or click Auto-Fill.
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Mode Switcher: Register (Default) vs Login */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-4 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {mode === 'register' ? 'Register Your GMRIT Role' : 'Role-Based OTP Login'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'register'
                  ? 'First-time registration for Students, Recruiters, Faculty, Alumni, and Directorate.'
                  : 'Enter your registered email to receive a secure 6-digit one-time password.'}
              </p>
            </div>

            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => {
                  setMode('register');
                  setIsOtpStep(false);
                  setDeliveredOtp(null);
                }}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  mode === 'register' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Account</span>
              </button>
              <button
                onClick={() => {
                  setMode('login');
                  setIsOtpStep(false);
                  setDeliveredOtp(null);
                }}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  mode === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Login with OTP</span>
              </button>
            </div>
          </div>

          {/* 6 Role Selection Selector Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              1. Select Your Specific Institutional Role *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(Object.keys(ROLE_CONFIGS) as UserRole[]).map(r => {
                const cfg = ROLE_CONFIGS[r];
                const Icon = cfg.icon;
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-white block truncate">{cfg.title}</span>
                    <span
                      className={`text-[9px] font-semibold block mt-0.5 truncate ${
                        isSelected ? 'text-indigo-300' : 'text-slate-500'
                      }`}
                    >
                      {cfg.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Requirements Banner */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <RoleIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-white">{currentRoleConfig.title}: </span>
                <span className="text-slate-400">{currentRoleConfig.subtitle}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap hidden sm:inline">
              {currentRoleConfig.badge}
            </span>
          </div>

          {/* ========================================================= */}
          {/* VIEW: OTP ENTRY SCREEN (STEP 2)                           */}
          {/* ========================================================= */}
          {isOtpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <span>Enter 6-Digit Email Verification Code</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter the one-time password code sent to <strong className="text-indigo-300">{email}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOtpStep(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Change Email
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={enteredOtp}
                    onChange={e => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center tracking-[1em] text-3xl font-black font-mono py-3 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    Didn't receive the code?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-indigo-400 font-semibold">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-indigo-400 hover:underline font-bold"
                      >
                        Resend OTP Now
                      </button>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Back to Details
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || enteredOtp.length < 6}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{mode === 'login' ? 'Verify & Access Workspace' : 'Verify & Complete Registration'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================= */
            /* VIEW: REGISTRATION OR LOGIN INPUT FORM (STEP 1)           */
            /* ========================================================= */
            <form onSubmit={handleInitiateOtp} className="space-y-4">
              {/* If Register: Full Name & Role Specific Fields */}
              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohan Gattu"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contact Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98480 12345"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Email Address with STRICT Validation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {selectedRole === 'student' || selectedRole === 'alumni'
                      ? 'Institutional GMRIT Email Address *'
                      : 'Official Email Address *'}
                  </label>
                  <span className="text-[11px] text-indigo-400 font-mono">
                    {selectedRole === 'student' || selectedRole === 'alumni'
                      ? 'Must end in @gmrit.edu.in'
                      : 'Work / Official Email'}
                  </span>
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder={currentRoleConfig.emailHint}
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden ${
                      emailError
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                </div>

                {emailError ? (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{emailError}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    {selectedRole === 'student' || selectedRole === 'alumni'
                      ? 'GMRIT security requires your college ID domain (e.g. 21341a0501@gmrit.edu.in).'
                      : 'An OTP will be dispatched to this email address.'}
                  </p>
                )}
              </div>

              {/* ===================================================== */}
              {/* ROLE SPECIFIC FIELDS DURING REGISTRATION              */}
              {/* ===================================================== */}
              {mode === 'register' && selectedRole === 'student' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-indigo-400 text-[11px] uppercase tracking-wider block">
                    Student Academic Credentials (GMRIT)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Roll Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 21341A0501"
                        value={rollNumber}
                        onChange={e => setRollNumber(e.target.value.toUpperCase())}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Department / Branch *</label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                        <option value="Artificial Intelligence & Data Science">AI & Data Science (AIDS)</option>
                        <option value="Electrical & Electronics Engineering">Electrical & Electronics (EEE)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                        <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Passing Out Batch</label>
                      <select
                        value={graduationYear}
                        onChange={e => setGraduationYear(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        <option value={2025}>Class of 2025 (Final Year)</option>
                        <option value={2026}>Class of 2026 (3rd Year)</option>
                        <option value={2027}>Class of 2027 (2nd Year)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Cumulative CGPA (0-10)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={cgpa}
                        onChange={e => setCgpa(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Standing Backlogs</label>
                      <input
                        type="number"
                        min="0"
                        value={standingBacklogs}
                        onChange={e => setStandingBacklogs(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Target Placement Track</label>
                      <input
                        type="text"
                        placeholder="e.g. Full Stack Developer"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'register' && selectedRole === 'recruiter' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-blue-400 text-[11px] uppercase tracking-wider block">
                    Corporate Hiring Partner Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Company / Enterprise Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Microsoft India, Amazon, TCS"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Designation</label>
                      <input
                        type="text"
                        value={recruiterTitle}
                        onChange={e => setRecruiterTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Industry Sector</label>
                      <input
                        type="text"
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Primary Work Location</label>
                      <input
                        type="text"
                        value={recruiterLocation}
                        onChange={e => setRecruiterLocation(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'register' && selectedRole === 'faculty' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-purple-400 text-[11px] uppercase tracking-wider block">
                    Faculty Department & Mentorship Dossier
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Faculty Employee ID</label>
                      <input
                        type="text"
                        value={facultyId}
                        onChange={e => setFacultyId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Department</label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Communication Engineering">ECE</option>
                        <option value="Artificial Intelligence & Data Science">AIDS</option>
                        <option value="Electrical & Electronics Engineering">EEE</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Academic Designation</label>
                      <input
                        type="text"
                        value={facultyTitle}
                        onChange={e => setFacultyTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'register' && selectedRole === 'alumni' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                    GMRIT Alumni Professional Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Graduation Batch Year</label>
                      <select
                        value={alumniBatch}
                        onChange={e => setAlumniBatch(parseInt(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      >
                        <option value={2024}>Class of 2024</option>
                        <option value={2023}>Class of 2023</option>
                        <option value={2022}>Class of 2022</option>
                        <option value={2021}>Class of 2021</option>
                        <option value={2020}>Class of 2020</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Current Employer / Company *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amazon Web Services, Google"
                        value={alumniCompany}
                        onChange={e => setAlumniCompany(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Current Job Title</label>
                      <input
                        type="text"
                        value={alumniTitle}
                        onChange={e => setAlumniTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button to Request OTP */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !!emailError || !email}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>
                    {mode === 'register'
                      ? `Send Verification OTP to ${email || 'Email'}`
                      : `Send Login OTP to ${email || 'Email'}`}
                  </span>
                </button>
              </div>

              {/* Mode Toggle Footer */}
              <div className="text-center pt-2 text-xs text-slate-400">
                {mode === 'register' ? (
                  <span>
                    Already registered in your role?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Log In with OTP
                    </button>
                  </span>
                ) : (
                  <span>
                    Need to register your student, recruiter, or faculty profile?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Register Now
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-4 px-6 text-center text-xs text-slate-500">
        <p>GMR Institute of Technology (GMRIT) • Career Development Cell (CDC) SCIC Employability Intelligence System</p>
      </footer>
    </div>
  );
};
