import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
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
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
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
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { Application, Opportunity, PlacementDrive, StudentProfile } from '../../types';

interface CDCDashboardProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const CDCDashboard: React.FC<CDCDashboardProps> = ({ activeView = 'dashboard', onNavigate }) => {
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

  // Live Database States
  const [drives, setDrives] = useState<PlacementDrive[]>(() => db.getPlacementDrives());
  const [students, setStudents] = useState<StudentProfile[]>(() => db.getStudentProfiles());
  const [applications, setApplications] = useState<Application[]>(() => db.getApplications());
  const opportunities = db.getOpportunities();

  const refreshData = () => {
    setDrives(db.getPlacementDrives());
    setStudents(db.getStudentProfiles());
    setApplications(db.getApplications());
  };

  // Drives Filtering State
  const [driveStatusFilter, setDriveStatusFilter] = useState<'All' | 'Upcoming' | 'Ongoing' | 'Completed'>('All');
  const [driveBranchFilter, setDriveBranchFilter] = useState<string>('All');
  const [driveSearch, setDriveSearch] = useState<string>('');

  // Readiness Matrix Filter State
  const [readinessDeptFilter, setReadinessDeptFilter] = useState<string>('All');
  const [readinessScoreBand, setReadinessScoreBand] = useState<string>('All');
  const [readinessBacklogFilter, setReadinessBacklogFilter] = useState<string>('All');
  const [readinessSearch, setReadinessSearch] = useState<string>('');

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedDriveForRoster, setSelectedDriveForRoster] = useState<PlacementDrive | null>(null);
  const [selectedStudentForAudit, setSelectedStudentForAudit] = useState<StudentProfile | null>(null);
  const [studentToNominate, setStudentToNominate] = useState<StudentProfile | null>(null);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);

  // New Drive Form Fields
  const [newDriveCompany, setNewDriveCompany] = useState('');
  const [newDriveCategory, setNewDriveCategory] = useState<'Super Dream' | 'Dream' | 'Core Engineering' | 'IT Services'>('Dream');
  const [newDriveDate, setNewDriveDate] = useState('2026-11-25');
  const [newDriveRoles, setNewDriveRoles] = useState('Associate Software Engineer, Cloud Trainee');
  const [newDriveVenue, setNewDriveVenue] = useState('GMRIT Campus Auditorium & CDC Lab 3');
  const [newDrivePackage, setNewDrivePackage] = useState('₹8.50 LPA - ₹12.00 LPA');
  const [newDriveMinCgpa, setNewDriveMinCgpa] = useState<number>(7.0);
  const [newDriveMaxBacklogs, setNewDriveMaxBacklogs] = useState<number>(0);
  const [newDriveBranches, setNewDriveBranches] = useState<string[]>(['CSE', 'IT', 'ECE', 'AIDS']);
  const [newDriveRounds, setNewDriveRounds] = useState('Online Coding Assessment, Technical Interview, HR Interview');
  const [newDriveSpoc, setNewDriveSpoc] = useState('Campus Placement Lead');
  const [newDriveNotes, setNewDriveNotes] = useState('Eligible students report at 8:45 AM in college formal dress.');

  // Broadcast Form Fields
  const [broadcastTitle, setBroadcastTitle] = useState('Placement Alert: Upcoming Drive Registration');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'All final-year students eligible for Microsoft and TCS campus drives are requested to complete resume synchronization and core assessments by Friday 5:00 PM.'
  );
  const [broadcastCategory, setBroadcastCategory] = useState<'info' | 'interview' | 'warning'>('info');

  // KPI Computations
  const totalStudents = students.length;
  const eligibleBatch = students.filter(s => s.cgpa >= 6.5).length;
  const zeroBacklogStudents = students.filter(s => s.standingBacklogs === 0).length;
  const totalAppsCount = applications.length;
  const interviewedCount = applications.filter(a => ['Interview', 'Selected'].includes(a.status)).length;
  const selectedApps = applications.filter(a => a.status === 'Selected');
  const uniquePlacedStudentIds = new Set(selectedApps.map(a => a.studentId));
  const verifiedPlacedCount = uniquePlacedStudentIds.size;
  const campusPlacementRate = Math.round((verifiedPlacedCount / (totalStudents || 1)) * 100);

  // Filtered Drives
  const filteredDrives = drives.filter(d => {
    const matchStatus = driveStatusFilter === 'All' || d.status === driveStatusFilter;
    const matchBranch = driveBranchFilter === 'All' || d.eligibleBranches.includes('All') || d.eligibleBranches.includes(driveBranchFilter);
    const matchSearch =
      !driveSearch.trim() ||
      d.company.toLowerCase().includes(driveSearch.toLowerCase()) ||
      d.roles.some(r => r.toLowerCase().includes(driveSearch.toLowerCase())) ||
      d.venue.toLowerCase().includes(driveSearch.toLowerCase());
    return matchStatus && matchBranch && matchSearch;
  });

  // Filtered Students for Readiness Matrix
  const filteredStudents = students.filter(s => {
    const matchDept = readinessDeptFilter === 'All' || s.department.toLowerCase().includes(readinessDeptFilter.toLowerCase());
    const matchBand =
      readinessScoreBand === 'All' ||
      (readinessScoreBand === 'high' && s.readinessScore >= 80) ||
      (readinessScoreBand === 'mid' && s.readinessScore >= 60 && s.readinessScore < 80) ||
      (readinessScoreBand === 'low' && s.readinessScore < 60);
    const matchBacklog =
      readinessBacklogFilter === 'All' ||
      (readinessBacklogFilter === 'zero' && s.standingBacklogs === 0) ||
      (readinessBacklogFilter === 'has' && s.standingBacklogs > 0);
    const matchSearch =
      !readinessSearch.trim() ||
      s.fullName.toLowerCase().includes(readinessSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(readinessSearch.toLowerCase()) ||
      s.targetRole.toLowerCase().includes(readinessSearch.toLowerCase());
    return matchDept && matchBand && matchBacklog && matchSearch;
  });

  // Recharts Funnel Pipeline Data
  const funnelChartData = [
    { stage: 'Eligible Batch', count: eligibleBatch, fill: '#6366f1' },
    { stage: 'Drive Applications', count: totalAppsCount, fill: '#3b82f6' },
    { stage: 'Shortlisted', count: applications.filter(a => ['Shortlisted', 'Assessment', 'Interview', 'Selected'].includes(a.status)).length, fill: '#06b6d4' },
    { stage: 'Interviews Scheduled', count: interviewedCount, fill: '#8b5cf6' },
    { stage: 'Offers Confirmed', count: selectedApps.length, fill: '#10b981' },
  ];

  // Department-wise readiness data
  const deptMap: Record<string, { sumScore: number; count: number; placed: number }> = {};
  students.forEach(s => {
    const d = s.department.replace('Computer Science & Engineering', 'CSE').replace('Information Technology', 'IT').replace('Electronics & Communication Engineering', 'ECE');
    if (!deptMap[d]) deptMap[d] = { sumScore: 0, count: 0, placed: 0 };
    deptMap[d].sumScore += s.readinessScore;
    deptMap[d].count += 1;
    if (uniquePlacedStudentIds.has(s.userId)) {
      deptMap[d].placed += 1;
    }
  });

  const departmentAnalyticsData = Object.entries(deptMap).map(([dept, val]) => ({
    department: dept,
    avgReadiness: Math.round(val.sumScore / (val.count || 1)),
    totalStudents: val.count,
    placedStudents: val.placed,
    placementRate: Math.round((val.placed / (val.count || 1)) * 100),
  }));

  // Salary Tier Breakdown for Pie Chart
  const salaryTiers = [
    { name: 'Super Dream (> ₹15 LPA)', value: 18, fill: '#8b5cf6' },
    { name: 'Dream (₹8 - ₹15 LPA)', value: 46, fill: '#4f46e5' },
    { name: 'Core & IT (₹4.5 - ₹8 LPA)', value: 85, fill: '#06b6d4' },
    { name: 'Mass IT (₹3.5 - ₹4.5 LPA)', value: 33, fill: '#10b981' },
  ];

  // Handle Schedule Drive
  const handleScheduleDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveCompany.trim()) return;

    const newDrive: PlacementDrive = {
      id: `drive-${Date.now()}`,
      company: newDriveCompany.trim(),
      category: newDriveCategory,
      date: newDriveDate,
      roles: newDriveRoles.split(',').map(r => r.trim()).filter(Boolean),
      venue: newDriveVenue.trim(),
      salaryPackage: newDrivePackage.trim(),
      minCgpa: Number(newDriveMinCgpa) || 6.5,
      maxBacklogs: Number(newDriveMaxBacklogs) || 0,
      eligibleBranches: newDriveBranches,
      rounds: newDriveRounds.split(',').map(r => r.trim()).filter(Boolean),
      status: 'Upcoming',
      contactSpoc: newDriveSpoc.trim(),
      notes: newDriveNotes.trim(),
    };

    db.savePlacementDrive(newDrive);

    // Broadcast automated notification to eligible students
    students.forEach(st => {
      if (st.cgpa >= newDrive.minCgpa && (newDrive.eligibleBranches.includes('All') || newDrive.eligibleBranches.includes(st.department.slice(0, 3)))) {
        db.addNotification({
          id: `notif-drive-${Date.now()}-${st.userId}`,
          userId: st.userId,
          title: `New Campus Placement Drive: ${newDrive.company}`,
          message: `${newDrive.company} scheduled for ${newDrive.date}. Roles: ${newDrive.roles.join(', ')}. CTC: ${newDrive.salaryPackage}.`,
          type: 'interview',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    });

    refreshData();
    setShowScheduleModal(false);
    setNewDriveCompany('');
    showToast(
      'Drive Scheduled & Broadcasted',
      `Campus placement drive for ${newDrive.company} scheduled on ${newDrive.date}. Alert sent to all eligible students!`,
      'success'
    );
  };

  // Handle Drive Status Change
  const handleUpdateStatus = (drive: PlacementDrive, newStatus: 'Upcoming' | 'Ongoing' | 'Completed') => {
    const updated = { ...drive, status: newStatus };
    db.savePlacementDrive(updated);
    refreshData();
    showToast('Drive Status Updated', `${drive.company} drive status changed to ${newStatus}.`, 'success');
  };

  // Handle Delete Drive
  const handleDeleteDrive = (driveId: string, company: string) => {
    db.deletePlacementDrive(driveId);
    refreshData();
    showToast('Drive Removed', `Campus drive for ${company} has been cancelled and removed.`, 'info');
  };

  // Handle Broadcast Circular
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    students.forEach(st => {
      db.addNotification({
        id: `circular-${Date.now()}-${st.userId}`,
        userId: st.userId,
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        type: broadcastCategory,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    setShowBroadcastModal(false);
    showToast(
      'Circular Dispatched to Campus',
      `Official CDC alert sent to all ${students.length} registered students in the 2025 cohort.`,
      'success'
    );
  };

  // Handle Nominate Student
  const handleNominateSubmit = (drive: PlacementDrive) => {
    if (!studentToNominate) return;

    const newApp: Application = {
      id: `app-nominate-${Date.now()}`,
      studentId: studentToNominate.userId,
      studentName: studentToNominate.fullName,
      studentEmail: studentToNominate.email,
      studentDepartment: studentToNominate.department,
      studentCgpa: studentToNominate.cgpa,
      studentRollNumber: studentToNominate.rollNumber,
      opportunityId: drive.id,
      opportunityTitle: drive.roles[0] || 'Software Engineer',
      company: drive.company,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Shortlisted',
      matchScore: studentToNominate.readinessScore,
      matchedSkills: studentToNominate.skills.filter(s => s.verified).map(s => s.name),
      missingSkills: [],
      recruiterNotes: `CDC Placement Head Special Nomination based on ${studentToNominate.readinessScore}% SCIC Readiness Index.`,
      statusHistory: [
        {
          status: 'Shortlisted',
          timestamp: new Date().toISOString(),
          note: `Direct nomination by Placement Directorate for ${drive.company} drive.`,
          updatedBy: 'Placement Head (CDC)',
        },
      ],
    };

    db.saveApplication(newApp);

    db.addNotification({
      id: `notif-nom-${Date.now()}`,
      userId: studentToNominate.userId,
      title: `Nominated for ${drive.company} Drive!`,
      message: `The Placement Head has directly shortlisted you for the ${drive.company} campus drive. Report on ${drive.date}.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });

    refreshData();
    setStudentToNominate(null);
    showToast(
      'Candidate Nominated',
      `${studentToNominate.fullName} (${studentToNominate.rollNumber}) shortlisted for ${drive.company} campus drive!`,
      'success'
    );
  };

  // Export NAAC / NIRF CSV
  const handleExportCSV = (reportType: 'NAAC' | 'NIRF' | 'Full') => {
    let headers: string[] = [];
    let rows: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    if (reportType === 'NAAC') {
      headers = [
        'Academic Year,Student Roll Number,Student Full Name,Department,Program,CGPA,Placement Status,Employer Name,Designation,Package CTC (LPA),Offer Date,NAAC Criterion 5.2.1 Status',
      ];
      rows = students.map(st => {
        const studentApps = applications.filter(a => a.studentId === st.userId);
        const selectedApp = studentApps.find(a => a.status === 'Selected');
        const employer = selectedApp ? selectedApp.company : 'Under Consideration';
        const role = selectedApp ? selectedApp.opportunityTitle : st.targetRole;
        const ctc = selectedApp ? '₹8.50 LPA' : 'N/A';
        const offerDate = selectedApp ? selectedApp.appliedDate : 'N/A';
        const status = selectedApp ? 'Placed - Campus Recruitment' : 'In Campus Pipeline / Higher Studies';
        return `"${2025}","${st.rollNumber}","${st.fullName}","${st.department}","B.Tech",${st.cgpa.toFixed(2)},"${selectedApp ? 'Placed' : 'In Pipeline'}","${employer}","${role}","${ctc}","${offerDate}","${status}"`;
      });
    } else {
      headers = [
        'Roll Number,Full Name,Department,Graduation Year,CGPA,Standing Backlogs,SCIC Readiness Score,Target Track,Verified Skills Count,Total Drive Applications,Placement Status',
      ];
      rows = students.map(st => {
        const studentApps = applications.filter(a => a.studentId === st.userId);
        const isPlaced = studentApps.some(a => a.status === 'Selected');
        const verifiedSkills = (st.skills || []).filter(s => s.verified).length;
        return `"${st.rollNumber}","${st.fullName}","${st.department}",${st.graduationYear},${st.cgpa.toFixed(2)},${st.standingBacklogs},${st.readinessScore},"${st.targetRole}",${verifiedSkills},${studentApps.length},"${isPlaced ? 'Selected / Placed' : 'Unplaced'}"`;
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join('\n'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GMRIT_${reportType}_Placement_Dataset_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Statutory Export Downloaded', `Generated verified ${reportType} regulatory dataset as CSV.`, 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Directorate Banner & Sub-Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Placement & Career Development Cell (CDC)
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Placement Directorate
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>NAAC A+ & NIRF Tier-1 Accredited</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl">
              Campus placement drive calendar, real-time student readiness matrix, ATS recruitment funnel oversight, and statutory NAAC/NIRF accreditation reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Campus Drive</span>
            </button>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-indigo-300" />
              <span>Broadcast Circular</span>
            </button>

            <button
              onClick={() => handleExportCSV('NAAC')}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>NAAC/NIRF CSV</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Synchronized with Sidebar) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Placement Executive Hub', icon: BarChart3, badge: null },
            { id: 'drives', label: 'Campus Drives Calendar', icon: Calendar, badge: `${drives.length} Drives` },
            { id: 'readiness', label: 'Student Readiness Matrix', icon: FileCheck, badge: `${totalStudents} Students` },
            { id: 'analytics', label: 'Placement Funnel & Statutory Export', icon: Layers, badge: 'NIRF / NAAC' },
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-200/80 text-slate-600'
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
      {/* TAB 1: PLACEMENT EXECUTIVE HUB */}
      {/* ========================================================= */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  2025 Graduating Cohort
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{totalStudents}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="font-semibold text-emerald-700">{eligibleBatch} Eligible</span>
                <span className="text-slate-300">•</span>
                <span>{zeroBacklogStudents} Zero Backlogs</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Campus Placement Drives
                </span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-indigo-600">{drives.length}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="font-semibold text-blue-700">{drives.filter(d => d.status === 'Upcoming').length} Upcoming</span>
                <span className="text-slate-300">•</span>
                <span>{drives.filter(d => d.status === 'Ongoing').length} Ongoing Today</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applications & Interviews
                </span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-purple-600">{totalAppsCount}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="font-semibold text-purple-700">{interviewedCount} Interviews</span>
                <span className="text-slate-300">•</span>
                <span>{applications.filter(a => a.status === 'Shortlisted').length} Shortlisted</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Placement Conversion
                </span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">{campusPlacementRate}%</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="font-semibold text-emerald-700">{verifiedPlacedCount} Students Placed</span>
                <span className="text-slate-300">•</span>
                <span>Avg: ₹8.4 LPA</span>
              </div>
            </div>
          </div>

          {/* Marquee Visiting Companies Carousel / Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Visiting Campus Recruiters & Scheduled Drives</h2>
              </div>
              <button
                onClick={() => handleTabChange('drives')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Schedule ({drives.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drives.slice(0, 3).map(drive => (
                <div
                  key={drive.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {drive.company}
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600">{drive.category || 'Dream Offer'}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        drive.status === 'Ongoing'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : drive.status === 'Completed'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {drive.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-900">{drive.salaryPackage || '₹7.5 - ₹12.0 LPA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{drive.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-[11px] text-slate-500">Min CGPA: {drive.minCgpa}</span>
                    <button
                      onClick={() => setSelectedDriveForRoster(drive)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Manage Roster</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dual Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campus Funnel Conversion */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Campus Recruitment Conversion Pipeline</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Real-Time Cohort</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-10} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {funnelChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department-wise Readiness & Placement Rate */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Department Average Readiness Score vs Offers</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Out of 100</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="avgReadiness" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Avg Readiness Score" />
                    <Bar dataKey="placementRate" fill="#10b981" radius={[6, 6, 0, 0]} name="Placement Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Ready Students Spotlight & Remediation Callouts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Top Placement-Ready Student Candidates</span>
                </h3>
                <p className="text-xs text-slate-500">Students with highest SCIC readiness score and verified core engineering skills ready for marquee drives.</p>
              </div>

              <button
                onClick={() => handleTabChange('readiness')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All ({students.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {students
                .sort((a, b) => b.readinessScore - a.readinessScore)
                .slice(0, 3)
                .map(st => (
                  <div key={st.userId} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {st.fullName.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{st.fullName}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{st.rollNumber}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-indigo-700">{st.readinessScore}%</span>
                        <span className="text-[10px] text-slate-400 block">Readiness</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center justify-between">
                      <span>{st.department.replace('Engineering', 'Eng')}</span>
                      <span className="font-semibold text-slate-900">CGPA: {st.cgpa.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => setSelectedStudentForAudit(st)}
                        className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Profile</span>
                      </button>
                      <button
                        onClick={() => setStudentToNominate(st)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Nominate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CAMPUS DRIVES CALENDAR & OPERATIONS DESK */}
      {/* ========================================================= */}
      {currentTab === 'drives' && (
        <div className="space-y-6">
          {/* Drives Sub-Header & Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>Campus Placement Drives Schedule ({filteredDrives.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage drive schedules, review candidate eligibility, and update round status.
                </p>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 self-start sm:self-auto transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Schedule New Campus Drive</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto">
                {(['All', 'Upcoming', 'Ongoing', 'Completed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setDriveStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      driveStatusFilter === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status} Drives
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search company, role or venue..."
                    value={driveSearch}
                    onChange={e => setDriveSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-56 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <select
                  value={driveBranchFilter}
                  onChange={e => setDriveBranchFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="All">All Branches</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="AIDS">AIDS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drives Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDrives.map(drive => {
              const driveApplications = applications.filter(a => a.company.toLowerCase() === drive.company.toLowerCase());
              return (
                <div
                  key={drive.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{drive.company}</h3>
                        <span className="text-xs font-semibold text-indigo-600">{drive.category || 'Dream Campus Drive'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={drive.status}
                          onChange={e => handleUpdateStatus(drive, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border cursor-pointer ${
                            drive.status === 'Ongoing'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : drive.status === 'Completed'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Date:</span>
                        <strong className="text-slate-900">{drive.date}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Package CTC:</span>
                        <strong className="text-indigo-700">{drive.salaryPackage || '₹8.00 LPA - ₹14.00 LPA'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Venue:</span>
                        <span className="text-slate-800 truncate max-w-[180px]">{drive.venue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Min CGPA:</span>
                        <span className="font-semibold text-slate-900">{drive.minCgpa} (0 Backlogs)</span>
                      </div>
                    </div>

                    {/* Roles list */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Hiring Roles
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {drive.roles.map(r => (
                          <span key={r} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rounds Timeline */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Evaluation Rounds
                      </span>
                      <div className="flex items-center gap-1 overflow-x-auto py-1">
                        {drive.rounds.map((rnd, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 text-[10px] font-semibold whitespace-nowrap border border-indigo-100"
                          >
                            R{idx + 1}: {rnd}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDriveForRoster(drive)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Candidates Roster ({driveApplications.length})</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          students.forEach(st => {
                            if (st.cgpa >= drive.minCgpa) {
                              db.addNotification({
                                id: `reminder-${Date.now()}-${st.userId}`,
                                userId: st.userId,
                                title: `Reminder: ${drive.company} Campus Drive`,
                                message: `Campus drive for ${drive.company} on ${drive.date} at ${drive.venue}. Carry 2 printed resumes.`,
                                type: 'interview',
                                read: false,
                                createdAt: new Date().toISOString(),
                              });
                            }
                          });
                          showToast('Reminder Dispatched', `Sent campus drive alert for ${drive.company} to eligible students.`, 'success');
                        }}
                        title="Send reminder to eligible students"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteDrive(drive.id, drive.company)}
                        title="Delete drive"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STUDENT READINESS MATRIX & AUDIT */}
      {/* ========================================================= */}
      {currentTab === 'readiness' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-600" />
                  <span>Student Placement Readiness Matrix & Skill Audit ({filteredStudents.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time audit of SCIC readiness scores, verified skill assessments, and campus placement eligibility.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV('Full')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Export Cohort CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Name, roll no, or role..."
                    value={readinessSearch}
                    onChange={e => setReadinessSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Department</label>
                <select
                  value={readinessDeptFilter}
                  onChange={e => setReadinessDeptFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science (CSE)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics">Electronics (ECE)</option>
                  <option value="Electrical">Electrical (EEE)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Readiness Tier</label>
                <select
                  value={readinessScoreBand}
                  onChange={e => setReadinessScoreBand(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="All">All Scores</option>
                  <option value="high">Super Ready (80 - 100%)</option>
                  <option value="mid">Emerging (60 - 79%)</option>
                  <option value="low">Needs Bridge Training (&lt; 60%)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Standing Backlogs</label>
                <select
                  value={readinessBacklogFilter}
                  onChange={e => setReadinessBacklogFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option value="All">All Students</option>
                  <option value="zero">Zero Backlogs (Eligible)</option>
                  <option value="has">With Standing Backlogs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4">Student / Roll Number</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Academic Performance</th>
                    <th className="py-3 px-3">Target Career</th>
                    <th className="py-3 px-3">SCIC Readiness Index</th>
                    <th className="py-3 px-3">Verified Skills</th>
                    <th className="py-3 px-3">Placement Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(st => {
                    const verifiedSkills = (st.skills || []).filter(s => s.verified);
                    const studentApps = applications.filter(a => a.studentId === st.userId);
                    const selectedApp = studentApps.find(a => a.status === 'Selected');

                    return (
                      <tr key={st.userId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {st.fullName.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{st.fullName}</div>
                              <span className="text-[11px] text-slate-400 font-mono">{st.rollNumber}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-slate-700 font-medium">
                            {st.department.replace('Computer Science & Engineering', 'CSE').replace('Information Technology', 'IT').replace('Electronics & Communication Engineering', 'ECE')}
                          </span>
                          <span className="block text-[10px] text-slate-400">Class of {st.graduationYear}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900">{st.cgpa.toFixed(2)} CGPA</span>
                          <span
                            className={`block text-[10px] font-semibold ${
                              st.standingBacklogs === 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {st.standingBacklogs === 0 ? '0 Backlogs' : `${st.standingBacklogs} Standing Backlogs`}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-indigo-700">
                          {st.targetRole}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-extrabold text-xs ${
                                st.readinessScore >= 80
                                  ? 'text-emerald-700'
                                  : st.readinessScore >= 60
                                  ? 'text-indigo-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {st.readinessScore}%
                            </span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  st.readinessScore >= 80
                                    ? 'bg-emerald-500'
                                    : st.readinessScore >= 60
                                    ? 'bg-indigo-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${st.readinessScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                              {verifiedSkills.length} Verified
                            </span>
                            {verifiedSkills.slice(0, 2).map(sk => (
                              <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                {sk.name}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          {selectedApp ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Placed @ {selectedApp.company}</span>
                            </span>
                          ) : studentApps.length > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                              {studentApps.length} In Process
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                              Seeking Opportunity
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudentForAudit(st)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Audit</span>
                            </button>

                            <button
                              onClick={() => setStudentToNominate(st)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] flex items-center gap-1"
                            >
                              <span>Nominate</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PLACEMENT FUNNEL & STATUTORY EXPORT */}
      {/* ========================================================= */}
      {currentTab === 'analytics' && (
        <div className="space-y-6">
          {/* Statutory Compliance Summary Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>NAAC Criterion 5.2.1 & NIRF Institutional Placement Audit</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Verified statutory parameters for accreditation bodies and annual institutional quality audits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV('NAAC')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download NAAC 5.2.1 CSV</span>
                </button>

                <button
                  onClick={() => handleExportCSV('NIRF')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Download NIRF Sheet CSV</span>
                </button>
              </div>
            </div>

            {/* 4 Compliance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">NIRF Median Package</span>
                <div className="text-2xl font-extrabold text-slate-900">₹8.40 LPA</div>
                <span className="text-[11px] text-emerald-700 font-semibold">+18% increase from 2024</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Highest Campus Offer</span>
                <div className="text-2xl font-extrabold text-indigo-600">₹44.50 LPA</div>
                <span className="text-[11px] text-slate-500">Microsoft India (Redmond/Hyd)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">NAAC Placement Ratio</span>
                <div className="text-2xl font-extrabold text-emerald-600">{campusPlacementRate}%</div>
                <span className="text-[11px] text-slate-500">{verifiedPlacedCount} of {totalStudents} Outgoing</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Dual / Multi-Offer Students</span>
                <div className="text-2xl font-extrabold text-purple-600">32</div>
                <span className="text-[11px] text-slate-500">Students with 2+ offers</span>
              </div>
            </div>
          </div>

          {/* Analytics Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Package Tier Pie Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  <span>Salary Package Tier Distribution (CTC)</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Offers Breakdown</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryTiers}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${(entry.name || '').split(' ')[0]} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                    >
                      {salaryTiers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Placements & Readiness Index */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Department-wise Placement Ratio (%)</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Class of 2025</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="placementRate" fill="#10b981" radius={[6, 6, 0, 0]} name="Placement Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: SCHEDULE CAMPUS PLACEMENT DRIVE */}
      {/* ========================================================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Schedule Campus Placement Drive</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleDriveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Visiting Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India / Cisco / Deloitte"
                    value={newDriveCompany}
                    onChange={e => setNewDriveCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Drive Category</label>
                  <select
                    value={newDriveCategory}
                    onChange={e => setNewDriveCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Super Dream">Super Dream (&gt; ₹15 LPA)</option>
                    <option value="Dream">Dream (₹8 - ₹15 LPA)</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="IT Services">IT Services</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Drive Date *</label>
                  <input
                    type="date"
                    required
                    value={newDriveDate}
                    onChange={e => setNewDriveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salary Package / CTC *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹12.00 LPA - ₹18.00 LPA"
                    value={newDrivePackage}
                    onChange={e => setNewDrivePackage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campus Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CDC Placement Auditorium & Lab 4"
                  value={newDriveVenue}
                  onChange={e => setNewDriveVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min CGPA Criteria</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDriveMinCgpa}
                    onChange={e => setNewDriveMinCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Backlogs Allowed</label>
                  <input
                    type="number"
                    value={newDriveMaxBacklogs}
                    onChange={e => setNewDriveMaxBacklogs(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hiring Roles (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. SDE-1, Cloud Engineer Trainee"
                  value={newDriveRoles}
                  onChange={e => setNewDriveRoles(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Evaluation Rounds (comma separated)</label>
                <input
                  type="text"
                  value={newDriveRounds}
                  onChange={e => setNewDriveRounds(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">CDC Coordinator SPOC</label>
                <input
                  type="text"
                  value={newDriveSpoc}
                  onChange={e => setNewDriveSpoc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Schedule Drive & Alert Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: BROADCAST OFFICIAL PLACEMENT CIRCULAR */}
      {/* ========================================================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Broadcast Placement Circular</h3>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Circular Subject / Title *</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Circular Message *</label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Priority Alert Level</label>
                <select
                  value={broadcastCategory}
                  onChange={e => setBroadcastCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="info">General Placement Information (Blue)</option>
                  <option value="interview">Mandatory Drive Schedule (Purple)</option>
                  <option value="warning">Urgent Deadline / Compliance Warning (Amber)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>This circular will be instantly delivered to all {students.length} registered students in their notification hub.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                >
                  Dispatch Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DRIVE CANDIDATE ROSTER DESK */}
      {/* ========================================================= */}
      {selectedDriveForRoster && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Candidate Roster: {selectedDriveForRoster.company}
                </h3>
                <span className="text-xs text-slate-500">
                  Drive Date: {selectedDriveForRoster.date} • Venue: {selectedDriveForRoster.venue}
                </span>
              </div>
              <button onClick={() => setSelectedDriveForRoster(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700">
                Registered Candidates ({applications.filter(a => a.company.toLowerCase() === selectedDriveForRoster.company.toLowerCase()).length})
              </div>

              {applications.filter(a => a.company.toLowerCase() === selectedDriveForRoster.company.toLowerCase()).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No student applications registered yet for this drive. Students can apply via their Opportunities Marketplace or be nominated below.
                </div>
              ) : (
                <div className="space-y-2">
                  {applications
                    .filter(a => a.company.toLowerCase() === selectedDriveForRoster.company.toLowerCase())
                    .map(app => (
                      <div
                        key={app.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{app.studentName}</div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {app.studentRollNumber} • {app.studentDepartment} • CGPA: {app.studentCgpa}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-indigo-700">{app.matchScore}% Match</span>
                          <select
                            value={app.status}
                            onChange={e => {
                              const updated = { ...app, status: e.target.value as any };
                              db.saveApplication(updated);
                              refreshData();
                              showToast('Candidate Status Updated', `${app.studentName} updated to ${e.target.value}`, 'success');
                            }}
                            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Assessment">Assessment</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected / Placed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDriveForRoster(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: DETAILED STUDENT READINESS AUDIT */}
      {/* ========================================================= */}
      {selectedStudentForAudit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedStudentForAudit.fullName}</h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedStudentForAudit.rollNumber} • {selectedStudentForAudit.department}
                </span>
              </div>
              <button onClick={() => setSelectedStudentForAudit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-slate-400 block text-[10px]">CGPA</span>
                  <span className="text-lg font-bold text-slate-900">{selectedStudentForAudit.cgpa.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Backlogs</span>
                  <span className="text-lg font-bold text-emerald-700">{selectedStudentForAudit.standingBacklogs}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Readiness Score</span>
                  <span className="text-lg font-bold text-indigo-700">{selectedStudentForAudit.readinessScore}%</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 block mb-2">Verified Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedStudentForAudit.skills || []).map(sk => (
                    <span
                      key={sk.name}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        sk.verified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sk.name} {sk.verified && '✓'}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">Target Career Track</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedStudentForAudit.targetRole}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    const st = selectedStudentForAudit;
                    setSelectedStudentForAudit(null);
                    setStudentToNominate(st);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Nominate for Drive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: NOMINATE STUDENT FOR DRIVE */}
      {/* ========================================================= */}
      {studentToNominate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Nominate for Campus Drive</h3>
                <span className="text-xs text-slate-500">
                  Candidate: {studentToNominate.fullName} ({studentToNominate.rollNumber})
                </span>
              </div>
              <button onClick={() => setStudentToNominate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="text-slate-600">Select active campus drive to shortlist this candidate:</span>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {drives.map(drive => (
                  <button
                    key={drive.id}
                    onClick={() => handleNominateSubmit(drive)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{drive.company}</span>
                      <span className="text-[10px] text-indigo-700">{drive.status}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Date: {drive.date} • Package: {drive.salaryPackage || '₹8-12 LPA'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setStudentToNominate(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
