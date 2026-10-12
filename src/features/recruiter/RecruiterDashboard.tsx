import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import {
  Application,
  ApplicationStatus,
  Opportunity,
  OpportunityType,
  WorkArrangement,
} from '../../types';

interface RecruiterDashboardProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  activeView = 'dashboard',
  onNavigate,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  // Internal tab state synced with activeView prop
  const currentTab = activeView || 'dashboard';

  const handleNav = (tabId: string) => {
    if (onNavigate) {
      onNavigate(tabId);
    }
  };

  // Data fetching
  const allOpportunities = db.getOpportunities();
  const allApplications = db.getApplications();

  // Filter for recruiter's company
  const companyName = currentUser?.company || 'Microsoft India';
  const myOpportunities = allOpportunities.filter(
    o => o.recruiterId === currentUser?.id || o.company.toLowerCase() === companyName.toLowerCase()
  );

  // Filters for Candidate Pipeline
  const [selectedOppId, setSelectedOppId] = useState<string>('all');
  const [pipelineStage, setPipelineStage] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Candidate Modal States
  const [selectedCandidateApp, setSelectedCandidateApp] = useState<Application | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-10-25',
    time: '10:30 AM',
    mode: 'GMRIT Campus Placement Cell (Block 3)' as const,
    meetingLinkOrVenue: 'Room 204, Placement Cell (Block 3)',
    interviewerName: currentUser?.name || 'Senior Technical Hiring Lead',
    notes: 'Please bring your resume and government photo ID. Round will cover Data Structures & System Architecture.',
  });

  // New Opportunity Publishing Form State
  const [newOpp, setNewOpp] = useState({
    title: '',
    type: 'Full-time' as OpportunityType,
    workArrangement: 'Hybrid' as WorkArrangement,
    location: 'Hyderabad / Bengaluru / GMRIT Campus',
    stipendOrSalary: '₹14,00,000 - ₹18,00,000 LPA',
    description: '',
    requiredSkills: 'React, TypeScript, Node.js, SQL, Data Structures',
    preferredSkills: 'Docker, AWS, System Design',
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    allowedDepartments: ['CSE', 'IT', 'ECE'],
    openings: 5,
    deadline: '2026-11-30',
  });

  // Company Profile State (editable)
  const [companyProfile, setCompanyProfile] = useState({
    companyName: companyName,
    industry: 'Enterprise Software & Cloud Computing',
    headquarters: 'Redmond, WA / Hyderabad Technology Campus',
    website: 'https://careers.microsoft.com',
    about:
      'Global technology leader empowering every person and organization on the planet to achieve more. Actively partnering with GMR Institute of Technology (GMRIT) for campus recruitment across core software engineering and cloud infrastructure roles.',
    recruiterName: currentUser?.name || 'Vikram Malhotra',
    recruiterEmail: currentUser?.email || 'vikram.m@microsoft.com',
    recruiterPhone: '+91 98480 55123',
    recruiterTitle: 'Lead University Relations & Technical Talent Partner',
    historicHiresAtGmrit: 38,
    avgPackageOffered: '₹14.5 LPA',
    highestPackageOffered: '₹28.0 LPA',
  });

  // Preset Job Templates for Quick Fill
  const applyJobTemplate = (templateName: string) => {
    if (templateName === 'sde') {
      setNewOpp({
        title: 'Associate Software Development Engineer (SDE)',
        type: 'Full-time',
        workArrangement: 'Hybrid',
        location: 'Hyderabad / Bengaluru',
        stipendOrSalary: '₹14,50,000 - ₹18,00,000 LPA',
        description:
          'Join our core engineering teams to design, develop, and deploy scalable cloud services. You will work on distributed data pipelines, modern APIs, and high-performance customer-facing platforms. Comprehensive mentorship and graduate training program included.',
        requiredSkills: 'Data Structures & Algorithms, Java, Python, SQL, RESTful APIs',
        preferredSkills: 'Docker, Microservices, Cloud Computing (Azure/AWS)',
        minCgpa: 7.5,
        maxBacklogsAllowed: 0,
        allowedDepartments: ['CSE', 'IT', 'ECE', 'AIDS'],
        openings: 8,
        deadline: '2026-11-25',
      });
      showToast('Template Applied', 'Loaded "Associate SDE" parameters.', 'info');
    } else if (templateName === 'fullstack') {
      setNewOpp({
        title: 'Full Stack Web Platform Trainee',
        type: 'Full-time',
        workArrangement: 'On-site',
        location: 'GMRIT Campus Drive / Hyderabad Office',
        stipendOrSalary: '₹12,00,000 - ₹15,00,000 LPA',
        description:
          'Responsible for building reactive, user-centric web applications and robust backend services. Candidate should exhibit solid proficiency in TypeScript, React, Node.js, and relational schema optimization.',
        requiredSkills: 'React, TypeScript, Node.js, PostgreSQL, Tailwind CSS',
        preferredSkills: 'GraphQL, Redis, Docker, Jest/Playwright',
        minCgpa: 7.0,
        maxBacklogsAllowed: 0,
        allowedDepartments: ['CSE', 'IT', 'ECE'],
        openings: 6,
        deadline: '2026-12-05',
      });
      showToast('Template Applied', 'Loaded "Full Stack Web Trainee" parameters.', 'info');
    } else if (templateName === 'intern') {
      setNewOpp({
        title: 'Summer Technical Internship (Pre-Placement Offer)',
        type: 'Summer Internship',
        workArrangement: 'Hybrid',
        location: 'Bengaluru R&D Center',
        stipendOrSalary: '₹60,000 / month stipend',
        description:
          '2-month intensive summer internship for pre-final and final year engineering students. High performers will be considered for immediate Pre-Placement Offers (PPOs) upon graduation.',
        requiredSkills: 'Python, C++, Problem Solving, Object Oriented Programming',
        preferredSkills: 'Git, Linux CLI, Machine Learning Foundations',
        minCgpa: 8.0,
        maxBacklogsAllowed: 0,
        allowedDepartments: ['CSE', 'IT', 'ECE', 'AIDS'],
        openings: 10,
        deadline: '2026-11-15',
      });
      showToast('Template Applied', 'Loaded "Summer Technical Internship" parameters.', 'info');
    }
  };

  // Filtered applicants for Candidate Pipeline
  const companyOppIds = new Set(myOpportunities.map(o => o.id));
  const applicants = allApplications.filter(a => {
    const isCompanyOpp =
      companyOppIds.has(a.opportunityId) ||
      a.company.toLowerCase() === companyName.toLowerCase();
    if (!isCompanyOpp) return false;

    if (selectedOppId !== 'all' && a.opportunityId !== selectedOppId) return false;
    if (pipelineStage !== 'all' && a.status !== pipelineStage) return false;
    if (a.matchScore < minScoreFilter) return false;
    if (deptFilter !== 'all' && !a.studentDepartment.toLowerCase().includes(deptFilter.toLowerCase()))
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        a.studentName.toLowerCase().includes(q) ||
        a.studentRollNumber.toLowerCase().includes(q) ||
        a.opportunityTitle.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    return true;
  });

  // Funnel counts across all company applications
  const allCompanyApplicants = allApplications.filter(
    a => companyOppIds.has(a.opportunityId) || a.company.toLowerCase() === companyName.toLowerCase()
  );
  const totalApplicants = allCompanyApplicants.length;
  const appliedCount = allCompanyApplicants.filter(a => a.status === 'Applied').length;
  const reviewCount = allCompanyApplicants.filter(a => a.status === 'Under Review').length;
  const shortlistedCount = allCompanyApplicants.filter(a => a.status === 'Shortlisted').length;
  const assessmentCount = allCompanyApplicants.filter(a => a.status === 'Assessment').length;
  const interviewCount = allCompanyApplicants.filter(a => a.status === 'Interview').length;
  const selectedCount = allCompanyApplicants.filter(a => a.status === 'Selected').length;
  const rejectedCount = allCompanyApplicants.filter(a => a.status === 'Rejected').length;

  // Handle Candidate Status Transitions
  const handleUpdateStatus = (app: Application, newStatus: ApplicationStatus, note?: string) => {
    const updated: Application = {
      ...app,
      status: newStatus,
      statusHistory: [
        ...app.statusHistory,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Candidate status progressed to ${newStatus} by ${currentUser?.name || 'Recruiter'}.`,
          updatedBy: currentUser?.name || 'Recruiter',
        },
      ],
    };

    db.saveApplication(updated);

    // Notify Student
    db.addNotification({
      id: `notif-st-stat-${Date.now()}`,
      userId: app.studentId,
      title: `Application Update: ${newStatus}`,
      message: `${companyName} updated your application for "${app.opportunityTitle}" to "${newStatus}".`,
      type: newStatus === 'Selected' ? 'success' : newStatus === 'Interview' ? 'interview' : 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });

    showToast('Status Updated', `${app.studentName}'s status changed to ${newStatus}.`, 'success');

    if (selectedCandidateApp?.id === app.id) {
      setSelectedCandidateApp(updated);
    }
  };

  // Schedule Interview
  const handleSaveInterviewSchedule = () => {
    if (!selectedCandidateApp) return;

    const updated: Application = {
      ...selectedCandidateApp,
      status: 'Interview',
      interviewDetails: {
        date: interviewForm.date,
        time: interviewForm.time,
        mode: interviewForm.mode,
        meetingLinkOrVenue: interviewForm.meetingLinkOrVenue,
        interviewerName: interviewForm.interviewerName,
      },
      statusHistory: [
        ...selectedCandidateApp.statusHistory,
        {
          status: 'Interview',
          timestamp: new Date().toISOString(),
          note: `Interview scheduled on ${interviewForm.date} at ${interviewForm.time} (${interviewForm.meetingLinkOrVenue}). Notes: ${interviewForm.notes}`,
          updatedBy: currentUser?.name || 'Recruiter',
        },
      ],
    };

    db.saveApplication(updated);

    // Send official invite to student
    db.addNotification({
      id: `notif-int-${Date.now()}`,
      userId: selectedCandidateApp.studentId,
      title: `Campus Interview Scheduled with ${companyName}!`,
      message: `Your interview for ${selectedCandidateApp.opportunityTitle} is scheduled on ${interviewForm.date} at ${interviewForm.time} at ${interviewForm.meetingLinkOrVenue}.`,
      type: 'interview',
      read: false,
      createdAt: new Date().toISOString(),
    });

    setShowScheduleModal(false);
    setSelectedCandidateApp(updated);
    showToast(
      'Interview Confirmed',
      `Campus interview invitation sent to ${selectedCandidateApp.studentName}.`,
      'success'
    );
  };

  // Handle Publish Opportunity
  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title.trim()) {
      showToast('Validation Error', 'Please enter a valid job title', 'error');
      return;
    }

    const createdOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      recruiterId: currentUser?.id || 'user-recruiter-1',
      company: companyName,
      title: newOpp.title,
      type: newOpp.type,
      workArrangement: newOpp.workArrangement,
      location: newOpp.location,
      stipendOrSalary: newOpp.stipendOrSalary,
      description:
        newOpp.description ||
        `Exciting campus opportunity at ${companyName} for graduating engineering talent from GMR Institute of Technology.`,
      requiredSkills: newOpp.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: newOpp.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      minCgpa: Number(newOpp.minCgpa) || 7.0,
      maxBacklogsAllowed: Number(newOpp.maxBacklogsAllowed) || 0,
      allowedDepartments: newOpp.allowedDepartments,
      openings: Number(newOpp.openings) || 5,
      deadline: newOpp.deadline || '2026-12-31',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    db.saveOpportunity(createdOpp);

    // Broadcast notification to students
    db.getStudentProfiles().forEach(student => {
      db.addNotification({
        id: `notif-drive-${Date.now()}-${student.userId}`,
        userId: student.userId,
        title: `New Campus Drive: ${createdOpp.company}`,
        message: `${createdOpp.company} posted a new opportunity: ${createdOpp.title} (${createdOpp.stipendOrSalary}). Check your match score now!`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    showToast(
      'Opportunity Published!',
      `Campus drive for "${createdOpp.title}" is now active and broadcast to eligible GMRIT students.`,
      'success'
    );

    // Switch to Pipeline or Dashboard
    handleNav('pipeline');
  };

  const toggleDept = (dept: string) => {
    setNewOpp(prev => {
      const exists = prev.allowedDepartments.includes(dept);
      if (exists) {
        return {
          ...prev,
          allowedDepartments: prev.allowedDepartments.filter(d => d !== dept),
        };
      } else {
        return {
          ...prev,
          allowedDepartments: [...prev.allowedDepartments, dept],
        };
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Recruiter Workspace Header & Role Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                {companyName}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Official Campus Hiring Partner
              </span>
              <span className="text-xs text-slate-400">
                • Lead: {currentUser?.name || 'Recruiter'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Recruiter ATS & Talent Desk
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              Screen AI-matched engineering candidates from GMRIT, publish campus hiring drives with automated skill qualification, and schedule technical interview rounds.
            </p>
          </div>

          {/* Quick Header Navigation Switcher */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={() => handleNav('post-job')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                currentTab === 'post-job'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Opportunity</span>
            </button>

            <button
              onClick={() => handleNav('pipeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                currentTab === 'pipeline'
                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Candidate Pipeline ({totalApplicants})</span>
            </button>
          </div>
        </div>

        {/* Workspace Tab Bar */}
        <div className="flex items-center gap-1 border-t border-slate-100 pt-3 overflow-x-auto">
          <button
            onClick={() => handleNav('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ATS Overview</span>
          </button>

          <button
            onClick={() => handleNav('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Pipeline</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                currentTab === 'pipeline' ? 'bg-white text-indigo-800' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {totalApplicants}
            </span>
          </button>

          <button
            onClick={() => handleNav('post-job')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'post-job'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Opportunity</span>
            <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-amber-100 text-amber-800 font-extrabold">
              AI Studio
            </span>
          </button>

          <button
            onClick={() => handleNav('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company Profile</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: ATS OVERVIEW (DASHBOARD)                                */}
      {/* ============================================================== */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Recruitment Funnel Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => {
                setPipelineStage('all');
                handleNav('pipeline');
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Applicants
                </span>
                <span className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{totalApplicants}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>Active across {myOpportunities.length} drives</span>
                <span className="text-indigo-600 font-semibold group-hover:underline">View All →</span>
              </div>
            </div>

            <div
              onClick={() => {
                setPipelineStage('Shortlisted');
                handleNav('pipeline');
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Shortlisted Candidates
                </span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <UserCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-blue-600 mt-2">{shortlistedCount}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>Passed criteria & scores</span>
                <span className="text-blue-600 font-semibold group-hover:underline">Filter →</span>
              </div>
            </div>

            <div
              onClick={() => {
                setPipelineStage('Interview');
                handleNav('pipeline');
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Interview Stage
                </span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-purple-600 mt-2">{interviewCount}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>Panels confirmed</span>
                <span className="text-purple-600 font-semibold group-hover:underline">Schedule →</span>
              </div>
            </div>

            <div
              onClick={() => {
                setPipelineStage('Selected');
                handleNav('pipeline');
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Final Offers Extended
                </span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-2">{selectedCount}</div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>Campus hiring selects</span>
                <span className="text-emerald-600 font-semibold group-hover:underline">Offers →</span>
              </div>
            </div>
          </div>

          {/* Active Drives Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Active Placement Drives at GMRIT ({myOpportunities.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Drives published to the GMRIT campus talent marketplace.
                </p>
              </div>
              <button
                onClick={() => handleNav('post-job')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish New Drive</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myOpportunities.map(opp => {
                const driveApplicants = allApplications.filter(a => a.opportunityId === opp.id);
                const selectedInDrive = driveApplicants.filter(a => a.status === 'Selected').length;

                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                          {opp.type}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            opp.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opp.status.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {opp.title}
                        </h3>
                        <p className="text-xs font-bold text-emerald-700 mt-1">
                          {opp.stipendOrSalary}
                        </p>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span>Openings:</span>
                          <strong className="text-slate-800">{opp.openings} positions</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Min CGPA:</span>
                          <strong className="text-slate-800">{opp.minCgpa}+ CGPA</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Deadline:</span>
                          <strong className="text-slate-800">{opp.deadline}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-xs">
                        <span className="font-extrabold text-slate-900">{driveApplicants.length}</span>{' '}
                        <span className="text-slate-400">Applicants</span>
                        {selectedInDrive > 0 && (
                          <span className="text-emerald-700 font-semibold block text-[10px]">
                            {selectedInDrive} Selected
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedOppId(opp.id);
                          handleNav('pipeline');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Screen Candidates</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Candidate Activity Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Applicant Submissions & Match Ratings
                </h3>
                <p className="text-xs text-slate-500">
                  Candidates scored automatically based on GMRIT academic records and verified skills.
                </p>
              </div>
              <button
                onClick={() => handleNav('pipeline')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                View Full Pipeline ({totalApplicants}) →
              </button>
            </div>

            <div className="space-y-3">
              {allCompanyApplicants.slice(0, 5).map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0">
                      {app.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{app.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({app.studentRollNumber})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {app.opportunityTitle} • {app.studentDepartment} • CGPA: {app.studentCgpa}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        app.matchScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.matchScore >= 70
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.matchScore}% Match
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        app.status === 'Selected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Interview'
                          ? 'bg-purple-100 text-purple-800'
                          : app.status === 'Shortlisted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedCandidateApp(app);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Quick Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: POST OPPORTUNITY (CAMPUS DRIVE CREATION STUDIO)         */}
      {/* ============================================================== */}
      {currentTab === 'post-job' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Campus Opportunity & Placement Drive Publisher
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  GMRIT Standard Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure role specifications, eligibility gates, and skill criteria to automatically rank applicants.
              </p>
            </div>

            {/* Quick Template Fill Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Prefill Template:
              </span>
              <button
                type="button"
                onClick={() => applyJobTemplate('sde')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                SDE Trainee (₹16 LPA)
              </button>
              <button
                type="button"
                onClick={() => applyJobTemplate('fullstack')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Full Stack (₹14 LPA)
              </button>
              <button
                type="button"
                onClick={() => applyJobTemplate('intern')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Summer Intern (PPO)
              </button>
            </div>
          </div>

          <form onSubmit={handlePostOpportunity} className="space-y-8">
            {/* Section 1: Core Role Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                1. Core Opportunity Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Associate Software Development Engineer (SDE-1)"
                    value={newOpp.title}
                    onChange={e => setNewOpp({ ...newOpp, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opportunity Type
                  </label>
                  <select
                    value={newOpp.type}
                    onChange={e => setNewOpp({ ...newOpp, type: e.target.value as OpportunityType })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Summer Internship">Summer Internship</option>
                    <option value="Industry Project">Industry Project</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={newOpp.workArrangement}
                    onChange={e =>
                      setNewOpp({ ...newOpp, workArrangement: e.target.value as WorkArrangement })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site (Office / Campus)</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Compensation / Package (CTC)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ₹14,00,000 - ₹18,00,000 LPA"
                    value={newOpp.stipendOrSalary}
                    onChange={e => setNewOpp({ ...newOpp, stipendOrSalary: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Posting Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hyderabad / Bengaluru / GMRIT"
                    value={newOpp.location}
                    onChange={e => setNewOpp({ ...newOpp, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Eligibility Gates */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                2. Academic Eligibility & Gates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    value={newOpp.minCgpa}
                    onChange={e => setNewOpp({ ...newOpp, minCgpa: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Standing Backlogs Allowed
                  </label>
                  <select
                    value={newOpp.maxBacklogsAllowed}
                    onChange={e =>
                      setNewOpp({ ...newOpp, maxBacklogsAllowed: parseInt(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value={0}>0 (Strictly No Active Backlogs)</option>
                    <option value={1}>1 Backlog Permitted</option>
                    <option value={2}>Up to 2 Backlogs Permitted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newOpp.openings}
                    onChange={e => setNewOpp({ ...newOpp, openings: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={newOpp.deadline}
                    onChange={e => setNewOpp({ ...newOpp, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Department Multi-Select Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Eligible Engineering Departments (Click to toggle):
                </label>
                <div className="flex flex-wrap gap-2">
                  {['CSE', 'IT', 'ECE', 'AIDS', 'EEE', 'MECH', 'CIVIL', 'CHEM'].map(dept => {
                    const isSelected = newOpp.allowedDepartments.includes(dept);
                    return (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => toggleDept(dept)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? `✓ ${dept}` : dept}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Technical Skills & AI Match Criteria */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                3. Technical Competencies & Skills Taxonomy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Required Skills (Comma separated) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React, TypeScript, Node.js, SQL, DSA"
                    value={newOpp.requiredSkills}
                    onChange={e => setNewOpp({ ...newOpp, requiredSkills: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Normalized against SCIC canonical taxonomy and verified badges.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred / Nice-to-Have Skills
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Docker, AWS, System Design, GraphQL"
                    value={newOpp.preferredSkills}
                    onChange={e => setNewOpp({ ...newOpp, preferredSkills: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Description & Expectations
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Outline day-to-day responsibilities, campus interview stages, and technical expectations..."
                    value={newOpp.description}
                    onChange={e => setNewOpp({ ...newOpp, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Student Marketplace Preview */}
            <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Student Marketplace Simulation Preview
              </span>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">{companyName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    92% Match Score (Simulated)
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {newOpp.title || 'Untitled Opportunity'}
                </div>
                <div className="text-xs text-slate-500">
                  {newOpp.location} • {newOpp.type} • {newOpp.stipendOrSalary}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {newOpp.requiredSkills
                    .split(',')
                    .slice(0, 4)
                    .map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {s.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publish Opportunity & Broadcast to GMRIT</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: CANDIDATE PIPELINE (ATS SCREENING & INTERVIEW DESK)   */}
      {/* ============================================================== */}
      {currentTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Pipeline Stage Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recruitment Stages:
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Total Screened: <strong>{applicants.length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Applicants', count: totalApplicants },
                { id: 'Applied', label: 'Applied', count: appliedCount },
                { id: 'Under Review', label: 'Under Review', count: reviewCount },
                { id: 'Shortlisted', label: 'Shortlisted', count: shortlistedCount },
                { id: 'Assessment', label: 'Assessment', count: assessmentCount },
                { id: 'Interview', label: 'Interview', count: interviewCount },
                { id: 'Selected', label: 'Selected', count: selectedCount },
                { id: 'Rejected', label: 'Rejected', count: rejectedCount },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setPipelineStage(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    pipelineStage === st.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{st.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      pipelineStage === st.id ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Multi-Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate by name, roll number, or role title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedOppId}
                onChange={e => setSelectedOppId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
              >
                <option value="all">All Drives ({myOpportunities.length})</option>
                {myOpportunities.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.title}
                  </option>
                ))}
              </select>

              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="AIDS">AIDS</option>
              </select>

              <select
                value={minScoreFilter}
                onChange={e => setMinScoreFilter(parseInt(e.target.value))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
              >
                <option value={0}>Any Match Score</option>
                <option value={70}>70%+ Match</option>
                <option value={80}>80%+ High Match</option>
              </select>
            </div>
          </div>

          {/* Candidates List Table / Cards */}
          <div className="space-y-4">
            {applicants.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No Candidates Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No applicants match the current stage ({pipelineStage}) and filters. Try clearing filters or publishing a new drive.
                </p>
                <button
                  onClick={() => {
                    setPipelineStage('all');
                    setSelectedOppId('all');
                    setMinScoreFilter(0);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {applicants.map(app => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-indigo-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Candidate Details */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                        {app.studentName.charAt(0)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-900 text-sm">
                            {app.studentName}
                          </span>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {app.studentRollNumber}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • Applied: {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800">{app.opportunityTitle}</span>
                          <span>•</span>
                          <span>{app.studentDepartment}</span>
                          <span>•</span>
                          <span>CGPA: <strong>{app.studentCgpa}</strong></span>
                        </div>

                        {/* Matched skills tags */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold">Matched:</span>
                          {app.matchedSkills.slice(0, 4).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              ✓ {s}
                            </span>
                          ))}
                          {app.missingSkills.length > 0 && (
                            <span className="text-[10px] text-slate-400">
                              +{app.missingSkills.length} missing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Action Controls: Match score, Status dropdown, Buttons */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                      <div className="text-center">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-black inline-block ${
                            app.matchScore >= 80
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : app.matchScore >= 70
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {app.matchScore}% Match
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">5-Factor AI Fit</span>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div>
                        <select
                          value={app.status}
                          onChange={e =>
                            handleUpdateStatus(app, e.target.value as ApplicationStatus)
                          }
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Assessment">Assessment</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Schedule Interview Button */}
                      <button
                        onClick={() => {
                          setSelectedCandidateApp(app);
                          setShowScheduleModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Interview</span>
                      </button>

                      {/* Dossier Details Button */}
                      <button
                        onClick={() => setSelectedCandidateApp(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: COMPANY PROFILE (BRANDING & CAMPUS RELATIONS)           */}
      {/* ============================================================== */}
      {currentTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
                {companyProfile.companyName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {companyProfile.companyName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {companyProfile.industry} • {companyProfile.headquarters}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Company Profile Updated', 'Enterprise branding and campus recruiter records saved.', 'success');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>

          {/* Historical Placement Record at GMRIT */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              GMRIT Campus Placement Track Record
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <span className="text-xs text-slate-500 font-medium">Historical Alumni Hires</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {companyProfile.historicHiresAtGmrit} Engineers
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Alumni working full-time</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <span className="text-xs text-slate-500 font-medium">Average CTC Offered</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {companyProfile.avgPackageOffered}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Consistent across batches</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <span className="text-xs text-slate-500 font-medium">Highest Campus CTC</span>
                <div className="text-2xl font-black text-indigo-700 mt-1">
                  {companyProfile.highestPackageOffered}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Product engineering roles</span>
              </div>
            </div>
          </div>

          {/* Enterprise Profile Form */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Company Overview & Culture Statement
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  About the Company (Presented to Students on Marketplace)
                </label>
                <textarea
                  rows={4}
                  value={companyProfile.about}
                  onChange={e => setCompanyProfile({ ...companyProfile, about: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={companyProfile.industry}
                    onChange={e =>
                      setCompanyProfile({ ...companyProfile, industry: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Careers Website
                  </label>
                  <input
                    type="url"
                    value={companyProfile.website}
                    onChange={e =>
                      setCompanyProfile({ ...companyProfile, website: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Campus Relations Lead Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Lead Campus Recruiter Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recruiter Contact Name
                </label>
                <input
                  type="text"
                  value={companyProfile.recruiterName}
                  onChange={e =>
                    setCompanyProfile({ ...companyProfile, recruiterName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={companyProfile.recruiterEmail}
                  onChange={e =>
                    setCompanyProfile({ ...companyProfile, recruiterEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Contact Number
                </label>
                <input
                  type="text"
                  value={companyProfile.recruiterPhone}
                  onChange={e =>
                    setCompanyProfile({ ...companyProfile, recruiterPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CANDIDATE DETAIL DOSSIER MODAL                                 */}
      {/* ============================================================== */}
      {selectedCandidateApp && !showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center">
                  {selectedCandidateApp.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedCandidateApp.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll No: {selectedCandidateApp.studentRollNumber} • {selectedCandidateApp.studentDepartment}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidateApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & Match Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">CGPA</span>
                <div className="text-lg font-black text-slate-900">
                  {selectedCandidateApp.studentCgpa}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Match Rating</span>
                <div className="text-lg font-black text-emerald-600">
                  {selectedCandidateApp.matchScore}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
                <div className="text-xs font-bold text-indigo-700 mt-1">
                  {selectedCandidateApp.status}
                </div>
              </div>
            </div>

            {/* Skills Matched & Missing */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Technical Match Breakdown
              </span>
              <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Matched Skills ({selectedCandidateApp.matchedSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidateApp.matchedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCandidateApp.missingSkills.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-500 block mb-1">
                      Missing / Development Gaps:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidateApp.missingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200"
                        >
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Transition History */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Application Audit Trail
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedCandidateApp.statusHistory.map((sh, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900">{sh.status}</strong>
                      <span className="text-[11px] text-slate-500 ml-2">{sh.note}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sh.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(selectedCandidateApp, 'Shortlisted')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold cursor-pointer"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedCandidateApp, 'Selected')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold cursor-pointer"
                >
                  Make Offer
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedCandidateApp, 'Rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold cursor-pointer"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERVIEW SCHEDULING MODAL                                     */}
      {/* ============================================================== */}
      {showScheduleModal && selectedCandidateApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Schedule Technical Interview
                </h3>
                <p className="text-xs text-slate-500">
                  Candidate: {selectedCandidateApp.studentName} ({selectedCandidateApp.studentRollNumber})
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Interview
                  </label>
                  <input
                    type="date"
                    value={interviewForm.date}
                    onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={interviewForm.time}
                    onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interview Mode / Venue
                </label>
                <select
                  value={interviewForm.mode}
                  onChange={e =>
                    setInterviewForm({
                      ...interviewForm,
                      mode: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="GMRIT Campus Placement Cell (Block 3)">
                    GMRIT Campus Placement Cell (Block 3)
                  </option>
                  <option value="Online">Online Video Call (Google Meet / Zoom)</option>
                  <option value="Company Office">Company Corporate Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Venue Room / Meeting Link
                </label>
                <input
                  type="text"
                  value={interviewForm.meetingLinkOrVenue}
                  onChange={e =>
                    setInterviewForm({ ...interviewForm, meetingLinkOrVenue: e.target.value })
                  }
                  placeholder="e.g. Room 204 (Placement Cell) or https://meet.google.com/xyz"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lead Interviewer Name
                </label>
                <input
                  type="text"
                  value={interviewForm.interviewerName}
                  onChange={e =>
                    setInterviewForm({ ...interviewForm, interviewerName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate Preparation Instructions
                </label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSaveInterviewSchedule}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Invite</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
