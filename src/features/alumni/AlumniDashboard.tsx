import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  PlusCircle,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { MentorshipSession, Opportunity } from '../../types';

interface AlumniDashboardProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({ activeView = 'dashboard', onNavigate }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [currentTab, setCurrentTab] = useState<string>(activeView || 'dashboard');

  useEffect(() => {
    if (activeView && activeView !== currentTab) {
      setCurrentTab(activeView);
    }
  }, [activeView]);

  const handleTabChange = (view: string) => {
    setCurrentTab(view);
    onNavigate?.(view);
  };

  const [mentorships, setMentorships] = useState<MentorshipSession[]>(() => db.getMentorships());
  const opportunities = db.getOpportunities();
  const applications = db.getApplications();

  // Filter referrals posted by this alumnus or GMRIT alumni network
  const alumniReferrals = opportunities.filter(
    o => o.recruiterId === currentUser?.id || o.title.toLowerCase().includes('alumni')
  );

  // Modals
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // New Mentorship Form
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('2026-11-05');
  const [time, setTime] = useState('18:00 – 18:45 IST');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/gmrit-alumni-mentor');
  const [menteeName, setMenteeName] = useState('Rahul Sharma');
  const [menteeDept, setMenteeDept] = useState('CSE');

  // New Referral Form
  const [refTitle, setRefTitle] = useState('');
  const [refCompany, setRefCompany] = useState(currentUser?.company || 'Amazon Web Services');
  const [refSkills, setRefSkills] = useState('Java, AWS, Distributed Systems, Docker, System Design');
  const [refLocation, setRefLocation] = useState('Hyderabad / Bengaluru / Remote');
  const [refSalary, setRefSalary] = useState('₹16.00 LPA – ₹24.00 LPA');
  const [refMinCgpa, setRefMinCgpa] = useState<number>(7.5);
  const [refOpenings, setRefOpenings] = useState<number>(3);
  const [refDesc, setRefDesc] = useState('');
  const [refDept, setRefDept] = useState<string[]>(['CSE', 'IT', 'ECE']);

  // Mentorship filters
  const [mentorshipStatusFilter, setMentorshipStatusFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Completed'>('All');

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refTitle.trim()) return;

    const newOpp: Opportunity = {
      id: `opp-alumni-${Date.now()}`,
      recruiterId: currentUser?.id || 'user-alumni-1',
      company: refCompany.trim(),
      title: `${refTitle.trim()} (Alumni Referral)`,
      type: 'Full-time',
      workArrangement: 'Hybrid',
      location: refLocation.trim(),
      stipendOrSalary: refSalary.trim(),
      description:
        refDesc.trim() ||
        `Verified direct alumni internal referral opportunity posted by GMRIT alumnus ${currentUser?.name || 'Priya Ananth'} (${currentUser?.company || 'AWS'}). Candidate resumes are prioritized for direct technical screening.`,
      requiredSkills: refSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: ['Cloud Fundamentals', 'System Architecture'],
      minCgpa: Number(refMinCgpa) || 7.0,
      maxBacklogsAllowed: 0,
      allowedDepartments: refDept,
      openings: Number(refOpenings) || 2,
      deadline: '2026-12-31',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    db.saveOpportunity(newOpp);

    // Notify registered final year students
    const students = db.getStudentProfiles();
    students.forEach(st => {
      if (st.cgpa >= newOpp.minCgpa) {
        db.addNotification({
          id: `notif-ref-${Date.now()}-${st.userId}`,
          userId: st.userId,
          title: `New Alumni Referral: ${newOpp.company}`,
          message: `${newOpp.title} posted by alumnus ${currentUser?.name || 'Priya Ananth'}. Package: ${newOpp.stipendOrSalary}.`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    });

    setShowReferralModal(false);
    setRefTitle('');
    setRefDesc('');
    showToast(
      'Alumni Referral Published',
      `Internal referral for ${newOpp.company} (${newOpp.title}) published to SCIC Opportunities Marketplace!`,
      'success'
    );
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const newSession: MentorshipSession = {
      id: `ment-${Date.now()}`,
      alumniId: currentUser?.id || 'user-alumni-1',
      alumniName: currentUser?.name || 'Priya Ananth',
      alumniCompany: currentUser?.company || 'Amazon Web Services',
      studentId: 'user-student-1',
      studentName: menteeName,
      topic: topic.trim(),
      scheduledDate: date,
      timeSlot: time,
      status: 'Confirmed',
      meetingNotes: `Google Meet: ${meetLink}. Mentorship focus: Career roadmap & technical interview defense.`,
    };

    db.saveMentorship(newSession);
    setMentorships(db.getMentorships());
    setShowAddSessionModal(false);
    setTopic('');
    showToast('Mentorship Slot Confirmed', 'New 1-on-1 career mentorship slot scheduled on calendar.', 'success');
  };

  const handleUpdateStatus = (sess: MentorshipSession, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    const updated = { ...sess, status };
    db.saveMentorship(updated);
    setMentorships(db.getMentorships());
    showToast('Session Updated', `Mentorship session marked as ${status}.`, 'info');
  };

  const filteredMentorships = mentorships.filter(m => {
    if (mentorshipStatusFilter === 'All') return true;
    return m.status === mentorshipStatusFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                GMRIT Alumni Community & Mentorship Portal
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Alumni Class of 2022
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Alumnus • AWS</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl">
              Empower graduating engineering juniors through 1-on-1 mock technical interviews, resume critiques, and direct employee referrals in Tier-1 product firms.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setShowReferralModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Share Referral Opening</span>
            </button>
            <button
              onClick={() => setShowAddSessionModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Offer 1-on-1 Mentorship</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Synchronized with Sidebar) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Alumni Portal & Community Hub', icon: Users, badge: null },
            { id: 'mentorships', label: '1-on-1 Mentorship Sessions', icon: Calendar, badge: `${mentorships.length} Sessions` },
            { id: 'post-opportunity', label: 'Refer / Share Job Opening', icon: Briefcase, badge: `${alumniReferrals.length} Active` },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ALUMNI PORTAL & COMMUNITY HUB */}
      {/* ========================================================= */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Alumni Persona Spotlight */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400">
                  Verified Alumni Mentor Persona
                </span>
                <span className="text-xs text-slate-400">• Class of 2022 (B.Tech CSE)</span>
              </div>
              <h2 className="text-xl font-bold text-white">{currentUser?.name || 'Priya Ananth'}</h2>
              <p className="text-xs text-indigo-200 font-semibold">
                {currentUser?.title || 'Software Development Engineer II @ Amazon Web Services'}
              </p>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                "Graduated from GMRIT CSE in 2022. Guiding juniors on distributed systems architecture, FAANG coding interviews, and open-source cloud projects."
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8 text-xs shrink-0">
              <div>
                <span className="text-slate-400 block text-[11px]">Mentorship Sessions</span>
                <span className="text-2xl font-black text-amber-400">{mentorships.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Referrals Shared</span>
                <span className="text-2xl font-black text-indigo-300">{alumniReferrals.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Campus Impact</span>
                <span className="text-2xl font-black text-emerald-400">100%</span>
              </div>
            </div>
          </div>

          {/* Quick Dual Cards: Active Sessions & Referrals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Mentorships */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Scheduled Mentorship Sessions</span>
                </h3>
                <button
                  onClick={() => handleTabChange('mentorships')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <span>View All ({mentorships.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {mentorships.slice(0, 3).map(sess => (
                  <div key={sess.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{sess.topic}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sess.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sess.status === 'Completed'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>

                    <div className="text-slate-600 flex items-center justify-between">
                      <span>Mentee: <strong className="text-slate-900">{sess.studentName}</strong></span>
                      <span>{sess.scheduledDate} • {sess.timeSlot}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400 truncate max-w-[200px]">{sess.meetingNotes || 'Google Meet'}</span>
                      <button
                        onClick={() => handleUpdateStatus(sess, 'Completed')}
                        className="font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Published Referrals */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>My Corporate Referrals</span>
                </h3>
                <button
                  onClick={() => handleTabChange('post-opportunity')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Post Referral</span>
                  <PlusCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {alumniReferrals.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No active referrals posted yet. Click "Post Referral" to share internal hiring openings.
                  </div>
                ) : (
                  alumniReferrals.slice(0, 3).map(opp => {
                    const applicantCount = applications.filter(a => a.opportunityId === opp.id).length;
                    return (
                      <div key={opp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{opp.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            {opp.type}
                          </span>
                        </div>

                        <div className="text-slate-600 flex items-center justify-between">
                          <span>{opp.company} • {opp.location}</span>
                          <strong className="text-emerald-700">{opp.stipendOrSalary}</strong>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                          <span className="text-slate-500">{applicantCount} Student Applicants</span>
                          <span className="text-emerald-600 font-semibold">Live in Marketplace</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MENTORSHIP SESSIONS DESK */}
      {/* ========================================================= */}
      {currentTab === 'mentorships' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>1-on-1 Student Mentorship Sessions ({filteredMentorships.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage confirmed career guidance sessions, conduct mock coding reviews, and update session completion status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddSessionModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Schedule Mentorship Slot</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
              {(['All', 'Confirmed', 'Pending', 'Completed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setMentorshipStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mentorshipStatusFilter === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMentorships.map(sess => (
              <div
                key={sess.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{sess.topic}</h3>
                      <span className="text-xs font-semibold text-amber-700">Mentee: {sess.studentName}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sess.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sess.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Date:</span>
                      <strong className="text-slate-900">{sess.scheduledDate}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Time Slot:</span>
                      <span className="text-slate-800 font-medium">{sess.timeSlot}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Meeting:</span>
                      <span className="text-indigo-600 truncate max-w-[160px] font-mono">Google Meet</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Notes:</strong> {sess.meetingNotes || 'Career defense and resume evaluation session.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleUpdateStatus(sess, sess.status === 'Completed' ? 'Confirmed' : 'Completed')}
                    className="font-bold text-amber-700 hover:text-amber-800"
                  >
                    {sess.status === 'Completed' ? 'Reopen Session' : 'Mark Completed'}
                  </button>

                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Meet</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REFER / SHARE OPENING */}
      {/* ========================================================= */}
      {currentTab === 'post-opportunity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <span>Internal Employee Referrals Hub ({alumniReferrals.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Publish verified internal job opportunities directly into the student marketplace with fast-track referral priority.
                </p>
              </div>

              <button
                onClick={() => setShowReferralModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Post New Referral Opening</span>
              </button>
            </div>
          </div>

          {/* Referral Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {alumniReferrals.map(opp => {
              const applicants = applications.filter(a => a.opportunityId === opp.id);
              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{opp.title}</h3>
                        <span className="text-xs font-semibold text-indigo-600">{opp.company}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {opp.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Compensation:</span>
                        <strong className="text-emerald-700">{opp.stipendOrSalary}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-slate-800">{opp.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Min CGPA:</span>
                        <span className="font-semibold text-slate-900">{opp.minCgpa} (0 Backlogs)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Openings:</span>
                        <span className="font-semibold text-slate-900">{opp.openings} positions</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                        Required Tech Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {opp.requiredSkills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {opp.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-indigo-700 font-semibold">{applicants.length} Student Applicants</span>
                    <button
                      onClick={() => {
                        showToast('Candidate List', `Opening candidate review for ${opp.title}.`, 'info');
                      }}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <span>Review Resumes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: OFFER MENTORSHIP SLOT */}
      {/* ========================================================= */}
      {showAddSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Offer 1-on-1 Mentorship Slot</h3>
              <button onClick={() => setShowAddSessionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mentorship Focus Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database Interview Defense & AWS Solutions"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Google Meet Link</label>
                <input
                  type="text"
                  value={meetLink}
                  onChange={e => setMeetLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Student Mentee</label>
                <input
                  type="text"
                  value={menteeName}
                  onChange={e => setMenteeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SHARE REFERRAL OPENING */}
      {/* ========================================================= */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Publish Internal Employee Referral</h3>
              <button onClick={() => setShowReferralModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE-1 (Cloud Infra)"
                    value={refTitle}
                    onChange={e => setRefTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={refCompany}
                    onChange={e => setRefCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salary Package / CTC *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹18.00 LPA - ₹24.00 LPA"
                    value={refSalary}
                    onChange={e => setRefSalary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad / Bengaluru"
                    value={refLocation}
                    onChange={e => setRefLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={refMinCgpa}
                    onChange={e => setRefMinCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Referral Openings</label>
                  <input
                    type="number"
                    value={refOpenings}
                    onChange={e => setRefOpenings(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Required Technical Skills</label>
                <input
                  type="text"
                  value={refSkills}
                  onChange={e => setRefSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Referral Notes / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Include your LeetCode profile and GitHub link. Shortlisted candidates receive internal fast-track interview loop."
                  value={refDesc}
                  onChange={e => setRefDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
                >
                  Publish to Student Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
