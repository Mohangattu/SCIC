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
  Sparkles,
  Star,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { StudentProfile } from '../../types';

interface FacultyDashboardProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ activeView = 'dashboard', onNavigate }) => {
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

  const students = db.getStudentProfiles();
  const applications = db.getApplications();
  const departmentName = currentUser?.department || 'Computer Science & Engineering';

  // Filter department students
  const deptStudents = students.filter(s =>
    s.department.toLowerCase().includes(departmentName.toLowerCase()) ||
    departmentName.toLowerCase().includes(s.department.toLowerCase())
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>(deptStudents[0]?.userId || '');
  const selectedStudent = deptStudents.find(s => s.userId === selectedStudentId) || deptStudents[0];

  // Mentee filters
  const [menteeSearch, setMenteeSearch] = useState('');
  const [menteeStatusFilter, setMenteeStatusFilter] = useState<'All' | 'Placed' | 'In Process' | 'Needs Attention'>('All');

  // Mentorship Review & Feedback State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [mentorshipHistory, setMentorshipHistory] = useState<
    { id: string; studentId: string; studentName: string; date: string; notes: string; actionItem: string }[]
  >([
    {
      id: 'rev-1',
      studentId: 'user-student-1',
      studentName: 'Rahul Sharma',
      date: '2026-10-08',
      notes: 'Reviewed distributed cache project. Commended system design diagram. Advised practicing LeetCode medium DP.',
      actionItem: 'Complete Dynamic Programming Diagnostic on SCIC Hub',
    },
    {
      id: 'rev-2',
      studentId: 'user-student-2',
      studentName: 'Sneha Reddy',
      date: '2026-10-04',
      notes: 'Embedded systems design verified. Recommended brushing up on ARM assembly and RTOS semaphores.',
      actionItem: 'Attempt Core CS Diagnostic Test',
    },
  ]);

  // Industry Collaborations State
  const [collaborations, setCollaborations] = useState([
    {
      id: 'collab-1',
      title: 'Cloud Native Microservices & Distributed Computing Lab',
      partner: 'Amazon Web Services (AWS Academy)',
      domain: 'Cloud Computing & DevOps',
      facultyLead: currentUser?.name || 'Dr. K. Srinivas (Professor, CSE)',
      studentSlots: 8,
      activeStudents: 6,
      fundingGrant: '₹4.5 Lakhs (Equipment & AWS Cloud Credits)',
      duration: 'Aug 2026 – May 2027',
      status: 'Active',
      deliverables: 'Student publishable microservices benchmark paper + AWS Solutions Architect certifications.',
    },
    {
      id: 'collab-2',
      title: 'Edge AI & Smart Campus Surveillance Automation',
      partner: 'L&T Technology Services',
      domain: 'Computer Vision & Embedded IoT',
      facultyLead: 'Dr. V. Prasad (Associate Professor, CSE)',
      studentSlots: 5,
      activeStudents: 5,
      fundingGrant: '₹3.2 Lakhs (Industry Research Grant)',
      duration: 'Jul 2026 – Dec 2026',
      status: 'Active',
      deliverables: 'Deployment of real-time footfall analysis system in CDC block.',
    },
    {
      id: 'collab-3',
      title: 'Full Stack Java Enterprise Curriculum Alignment Program',
      partner: 'Cognizant Technology Solutions',
      domain: 'Enterprise Software Engineering',
      facultyLead: currentUser?.name || 'Dr. K. Srinivas (Professor, CSE)',
      studentSlots: 25,
      activeStudents: 22,
      fundingGrant: 'Faculty FDP Sponsorship & Corporate Mentorship',
      duration: 'Jan 2026 – Jun 2026',
      status: 'Completed',
      deliverables: 'Curriculum syllabus updated with Spring Boot, Docker, and Microservices architectures.',
    },
  ]);

  const [showAddCollabModal, setShowAddCollabModal] = useState(false);
  const [newCollabTitle, setNewCollabTitle] = useState('');
  const [newCollabPartner, setNewCollabPartner] = useState('');
  const [newCollabDomain, setNewCollabDomain] = useState('Artificial Intelligence & ML');
  const [newCollabSlots, setNewCollabSlots] = useState('6');
  const [newCollabGrant, setNewCollabGrant] = useState('₹2.5 Lakhs');
  const [newCollabDeliverables, setNewCollabDeliverables] = useState('');

  // Endorsed projects set
  const [endorsedProjects, setEndorsedProjects] = useState<Record<string, boolean>>({
    'Distributed Task Queue & Background Job Scheduler': true,
  });

  const handleEndorseProject = (projTitle: string) => {
    setEndorsedProjects(prev => ({ ...prev, [projTitle]: true }));
    showToast(
      'Capstone Endorsed',
      `Faculty endorsement recorded for "${projTitle}". Added to verified portfolio & accreditation records.`,
      'success'
    );
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewNote.trim() || !selectedStudent) return;

    const newEntry = {
      id: `rev-${Date.now()}`,
      studentId: selectedStudent.userId,
      studentName: selectedStudent.fullName,
      date: new Date().toISOString().split('T')[0],
      notes: reviewNote.trim(),
      actionItem: 'Follow faculty recommendation guidelines',
    };

    setMentorshipHistory(prev => [newEntry, ...prev]);
    setShowReviewModal(false);
    setReviewNote('');
    showToast('Review Logged', `Mentorship notes recorded for ${selectedStudent.fullName}.`, 'success');
  };

  const handleAddCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollabTitle.trim() || !newCollabPartner.trim()) return;

    const newCollab = {
      id: `collab-${Date.now()}`,
      title: newCollabTitle.trim(),
      partner: newCollabPartner.trim(),
      domain: newCollabDomain,
      facultyLead: currentUser?.name || 'Faculty Lead',
      studentSlots: parseInt(newCollabSlots) || 5,
      activeStudents: 1,
      fundingGrant: newCollabGrant.trim(),
      duration: 'Nov 2026 – Apr 2027',
      status: 'Active',
      deliverables: newCollabDeliverables.trim() || 'Research prototype & student industry publication.',
    };

    setCollaborations(prev => [newCollab, ...prev]);
    setShowAddCollabModal(false);
    setNewCollabTitle('');
    setNewCollabPartner('');
    setNewCollabDeliverables('');
    showToast('Collaboration Created', `Industry collaboration with ${newCollab.partner} launched successfully!`, 'success');
  };

  // KPI Calculations
  const totalMentees = deptStudents.length;
  const avgReadiness = Math.round(
    deptStudents.reduce((acc, s) => acc + s.readinessScore, 0) / Math.max(totalMentees, 1)
  );
  const placedMentees = deptStudents.filter(s =>
    applications.some(a => a.studentId === s.userId && a.status === 'Selected')
  ).length;
  const needAttentionMentees = deptStudents.filter(s => s.readinessScore < 65 || s.standingBacklogs > 0).length;

  // Filtered Mentees
  const filteredMentees = deptStudents.filter(s => {
    const matchSearch =
      !menteeSearch.trim() ||
      s.fullName.toLowerCase().includes(menteeSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(menteeSearch.toLowerCase()) ||
      s.targetRole.toLowerCase().includes(menteeSearch.toLowerCase());

    const isPlaced = applications.some(a => a.studentId === s.userId && a.status === 'Selected');
    const isNeedsAttention = s.readinessScore < 65 || s.standingBacklogs > 0;

    let matchStatus = true;
    if (menteeStatusFilter === 'Placed') matchStatus = isPlaced;
    else if (menteeStatusFilter === 'In Process') matchStatus = !isPlaced && !isNeedsAttention;
    else if (menteeStatusFilter === 'Needs Attention') matchStatus = isNeedsAttention;

    return matchSearch && matchStatus;
  });

  // Department Competency Radar Chart Data
  const competencyRadarData = [
    { subject: 'Data Structures', classAverage: 86, industryBenchmark: 80 },
    { subject: 'Algorithms', classAverage: 78, industryBenchmark: 75 },
    { subject: 'System Design', classAverage: 68, industryBenchmark: 75 },
    { subject: 'Database & SQL', classAverage: 88, industryBenchmark: 80 },
    { subject: 'Web Technologies', classAverage: 84, industryBenchmark: 70 },
    { subject: 'Operating Systems', classAverage: 80, industryBenchmark: 75 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Workspace Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Faculty Mentorship & Department Development
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                {departmentName}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>NBA Tier-1 Accredited Faculty Mentor</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl">
              Guide assigned student mentees, endorse capstone portfolios for recruiters, bridge engineering curriculum skill gaps, and manage active industry research partnerships.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddCollabModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Briefcase className="w-4 h-4" />
              <span>New Industry Project</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Synchronized with Sidebar) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Department Readiness', icon: TrendingUp, badge: `${avgReadiness}% Avg` },
            { id: 'mentees', label: 'Student Mentees Workspace', icon: Users, badge: `${totalMentees} Students` },
            { id: 'collaborations', label: 'Industry & FDP Projects', icon: Briefcase, badge: `${collaborations.length} Active` },
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-slate-200/80 text-slate-600'
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
      {/* TAB 1: DEPARTMENT READINESS OVERVIEW */}
      {/* ========================================================= */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Assigned Student Mentees
                </span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{totalMentees}</div>
              <span className="text-xs text-slate-400 block">Class of 2025 (Final Year CSE)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Dept Average Readiness
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-indigo-600">{avgReadiness}%</div>
              <span className="text-xs text-emerald-600 font-semibold block">
                +8.4% improvement this semester
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mentees Placed
                </span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">{placedMentees}</div>
              <span className="text-xs text-slate-400 block">Offers in Microsoft, TCS, AWS</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Needs Bridge Remediation
                </span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-amber-600">{needAttentionMentees}</div>
              <span className="text-xs text-slate-400 block">Readiness &lt;65% or backlogs</span>
            </div>
          </div>

          {/* Department Competency Radar & Action Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>Department Core Competency Benchmark</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Class vs Industry</span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyRadarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Radar name="Class Average" dataKey="classAverage" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} />
                    <Radar name="Industry Benchmark" dataKey="industryBenchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Faculty Mentorship Activity & Action Board */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Recent Faculty Mentoring Trail & Reviews</span>
                </h3>
                <button
                  onClick={() => handleTabChange('mentees')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <span>Open Mentee Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {mentorshipHistory.slice(0, 3).map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.studentName}</span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-600 text-xs">{item.notes}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-purple-700 font-semibold">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Action: {item.actionItem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STUDENT MENTEES WORKSPACE */}
      {/* ========================================================= */}
      {currentTab === 'mentees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Filterable Mentees Cohort */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Assigned Mentees ({filteredMentees.length})</span>
                </h2>
                <span className="text-[11px] font-semibold text-slate-400">Class of 2025</span>
              </div>

              {/* Search & Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name or roll no..."
                    value={menteeSearch}
                    onChange={e => setMenteeSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto py-1">
                  {(['All', 'Placed', 'In Process', 'Needs Attention'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setMenteeStatusFilter(filter)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                        menteeStatusFilter === filter
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mentee List Items */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredMentees.map(st => {
                  const isSelected = selectedStudent?.userId === st.userId;
                  const isPlaced = applications.some(a => a.studentId === st.userId && a.status === 'Selected');
                  return (
                    <div
                      key={st.userId}
                      onClick={() => setSelectedStudentId(st.userId)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-400 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{st.fullName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            st.readinessScore >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.readinessScore >= 65
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.readinessScore}% Score
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Roll: {st.rollNumber}</span>
                        <span>CGPA: {st.cgpa.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-indigo-600 font-semibold truncate max-w-[140px]">
                          {st.targetRole}
                        </span>
                        {isPlaced ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Placed
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">In Pipeline</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Mentee Deep Dive & Capstone Endorsement Desk */}
            {selectedStudent && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                  {/* Student Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                        Mentee Competency Dossier
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedStudent.fullName}</h2>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {selectedStudent.rollNumber} • {selectedStudent.department} • CGPA: {selectedStudent.cgpa.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">SCIC Placement Readiness</span>
                      <span className="text-3xl font-black text-purple-600">{selectedStudent.readinessScore}%</span>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Verified Technical Skills ({selectedStudent.skills.filter(s => s.verified).length} Verified)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.skills.map(sk => (
                        <span
                          key={sk.name}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            sk.verified
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sk.name} {sk.verified && '✓'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Capstone Projects Portfolio */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Engineering Capstone & Applied Projects
                    </h3>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Distributed Task Queue & Background Job Scheduler
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Tech Stack: TypeScript, Redis Streams, Docker, PostgreSQL
                          </span>
                        </div>

                        {endorsedProjects['Distributed Task Queue & Background Job Scheduler'] ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Faculty Endorsed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleEndorseProject('Distributed Task Queue & Background Job Scheduler')
                            }
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Endorse for Recruiter Review</span>
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Production-grade distributed worker pool built to handle asynchronous email triggers, automated report generation, and exponential backoff retry policies. Benchmarked at 12,000 tasks/second.
                      </p>
                    </div>
                  </div>

                  {/* Mentorship Notes & Direct Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-300" />
                      <span>Log Faculty Mentorship Feedback</span>
                    </button>

                    <button
                      onClick={() => {
                        db.addNotification({
                          id: `fac-notif-${Date.now()}`,
                          userId: selectedStudent.userId,
                          title: 'Faculty Recommendation from Mentor',
                          message: `Your faculty mentor ${currentUser?.name || 'Dr. Srinivas'} reviewed your profile and recommends completing the System Design mock assessment.`,
                          type: 'info',
                          read: false,
                          createdAt: new Date().toISOString(),
                        });
                        showToast('Notification Sent', `Recommended System Design focus to ${selectedStudent.fullName}.`, 'success');
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-500" />
                      <span>Send Remedial Task</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: INDUSTRY & FDP COLLABORATIONS */}
      {/* ========================================================= */}
      {currentTab === 'collaborations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <span>Industry Partnerships & Faculty Development Programs (FDP)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Funded joint research projects, corporate co-mentorship labs, and university-industry curriculum alignment.
                </p>
              </div>

              <button
                onClick={() => setShowAddCollabModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 self-start sm:self-auto transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit New Industry Collaboration</span>
              </button>
            </div>
          </div>

          {/* Collaboration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collaborations.map(collab => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-purple-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{collab.title}</h3>
                      <span className="text-xs font-semibold text-purple-600">{collab.partner}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        collab.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {collab.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Domain:</span>
                      <strong className="text-slate-900">{collab.domain}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Faculty Lead:</span>
                      <span className="text-slate-800 font-medium">{collab.facultyLead}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Grant / Sponsorship:</span>
                      <strong className="text-emerald-700">{collab.fundingGrant}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Student Slots:</span>
                      <span className="font-semibold text-slate-900">
                        {collab.activeStudents} of {collab.studentSlots} Enrolled
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Deliverables:</strong> {collab.deliverables}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Duration: {collab.duration}</span>
                  <button
                    onClick={() => {
                      showToast('Project Dossier', `Exported milestone report for ${collab.partner} partnership.`, 'info');
                    }}
                    className="font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <span>Milestones</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LOG FACULTY MENTORSHIP FEEDBACK */}
      {/* ========================================================= */}
      {showReviewModal && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Mentorship Feedback</h3>
                <span className="text-xs text-slate-500">
                  Student: {selectedStudent.fullName} ({selectedStudent.rollNumber})
                </span>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observation & Guidance Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Reviewed dynamic programming solutions. Advised focusing on tree traversal algorithms and mock interview behavioral defense."
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Save to Mentee Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUBMIT NEW INDUSTRY COLLABORATION */}
      {/* ========================================================= */}
      {showAddCollabModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Initiate Industry & FDP Project</h3>
              <button onClick={() => setShowAddCollabModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCollabSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project / FDP Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database High Availability Lab"
                  value={newCollabTitle}
                  onChange={e => setNewCollabTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Corporate Partner *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco Systems"
                    value={newCollabPartner}
                    onChange={e => setNewCollabPartner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Domain</label>
                  <select
                    value={newCollabDomain}
                    onChange={e => setNewCollabDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
                    <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Research Slots</label>
                  <input
                    type="number"
                    value={newCollabSlots}
                    onChange={e => setNewCollabSlots(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Funding Grant Amount</label>
                  <input
                    type="text"
                    value={newCollabGrant}
                    onChange={e => setNewCollabGrant(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Deliverables & Scope</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Student research paper publication, open source prototype, and student pre-placement interview fast-track."
                  value={newCollabDeliverables}
                  onChange={e => setNewCollabDeliverables(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCollabModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Register Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
