import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  PieChart as PieIcon,
  PlusCircle,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
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
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';

interface InstitutionalDashboardProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const InstitutionalDashboard: React.FC<InstitutionalDashboardProps> = ({
  activeView = 'dashboard',
  onNavigate,
}) => {
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
  const opportunities = db.getOpportunities();
  const applications = db.getApplications();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [recomSkill, setRecomSkill] = useState('System Design & Microservices');
  const [recomDept, setRecomDept] = useState('CSE & IT');
  const [recomAction, setRecomAction] = useState('4-Week Mandatory Hands-On Lab Course');

  const [councilRecommendations, setCouncilRecommendations] = useState([
    {
      id: 'rec-1',
      skill: 'Distributed Systems & Cloud Native Architecture',
      department: 'CSE / IT',
      action: '4-Week Hands-on Docker & Kubernetes Lab in Semester 7',
      status: 'Implemented',
      targetBatch: 'Class of 2025',
    },
    {
      id: 'rec-2',
      skill: 'Embedded Linux & RTOS Programming',
      department: 'ECE / EEE',
      action: 'Collaboration with L&T Technology Services for hardware testbeds',
      status: 'In Progress',
      targetBatch: 'Class of 2026',
    },
  ]);

  // Compute skill frequency in industry postings vs student profiles
  const industryDemandMap: Record<string, number> = {};
  opportunities.forEach(opp => {
    opp.requiredSkills.forEach(sk => {
      industryDemandMap[sk] = (industryDemandMap[sk] || 0) + 1;
    });
  });

  const studentSupplyMap: Record<string, number> = {};
  students.forEach(st => {
    (st.skills || []).forEach(sk => {
      studentSupplyMap[sk.name] = (studentSupplyMap[sk.name] || 0) + 1;
    });
  });

  // Top skill comparison data
  const topSkillsList = [
    'React',
    'Python',
    'Java',
    'SQL',
    'Docker',
    'TypeScript',
    'Data Structures & Algorithms',
    'System Design',
    'C++',
    'Cloud Fundamentals',
  ];

  const skillGapComparisonData = topSkillsList
    .filter(sk => !skillSearch || sk.toLowerCase().includes(skillSearch.toLowerCase()))
    .map(sk => {
      const demand = industryDemandMap[sk] || Math.floor(2 + (sk.length % 3));
      const supply = studentSupplyMap[sk] || Math.floor(1 + (sk.length % 2));
      const gap = demand - supply;
      return {
        skill: sk.length > 14 ? sk.slice(0, 12) + '..' : sk,
        fullSkill: sk,
        industryDemand: demand,
        studentSupply: supply,
        deficit: gap > 0 ? gap : 0,
      };
    });

  // Department Comparative Data
  const branchData = [
    {
      branch: 'CSE',
      fullTitle: 'Computer Science & Engineering',
      readiness: 84.5,
      total: 180,
      eligible: 165,
      placed: 142,
      avgCtc: '₹9.4 LPA',
      highestCtc: '₹44.5 LPA (Microsoft)',
      topRecruiter: 'Microsoft, Amazon, TCS',
      nbaScore: '780/1000 (Tier-1)',
    },
    {
      branch: 'IT',
      fullTitle: 'Information Technology',
      readiness: 81.2,
      total: 120,
      eligible: 108,
      placed: 92,
      avgCtc: '₹8.6 LPA',
      highestCtc: '₹24.0 LPA (Amazon)',
      topRecruiter: 'AWS, Cognizant, Infosys',
      nbaScore: '765/1000 (Tier-1)',
    },
    {
      branch: 'ECE',
      fullTitle: 'Electronics & Communication Eng.',
      readiness: 79.8,
      total: 160,
      eligible: 140,
      placed: 118,
      avgCtc: '₹7.8 LPA',
      highestCtc: '₹16.5 LPA (Cisco)',
      topRecruiter: 'L&T Tech, Qualcomm, TCS',
      nbaScore: '772/1000 (Tier-1)',
    },
    {
      branch: 'AIDS',
      fullTitle: 'Artificial Intelligence & Data Science',
      readiness: 83.0,
      total: 60,
      eligible: 56,
      placed: 48,
      avgCtc: '₹9.1 LPA',
      highestCtc: '₹22.0 LPA (Deloitte)',
      topRecruiter: 'Deloitte, Mu Sigma, TCS',
      nbaScore: 'Accredited (Tier-1)',
    },
    {
      branch: 'EEE',
      fullTitle: 'Electrical & Electronics Engineering',
      readiness: 73.4,
      total: 90,
      eligible: 76,
      placed: 58,
      avgCtc: '₹6.2 LPA',
      highestCtc: '₹12.0 LPA (Schneider)',
      topRecruiter: 'Schneider, L&T, Tech M',
      nbaScore: '740/1000 (Tier-1)',
    },
    {
      branch: 'MECH',
      fullTitle: 'Mechanical Engineering',
      readiness: 71.0,
      total: 110,
      eligible: 92,
      placed: 67,
      avgCtc: '₹5.8 LPA',
      highestCtc: '₹10.5 LPA (Tata Motors)',
      topRecruiter: 'Tata Motors, JSW, Bosch',
      nbaScore: '750/1000 (Tier-1)',
    },
  ];

  // Placement Salary Distribution
  const salaryTiersData = [
    { name: 'Super Dream (> ₹15 LPA)', value: 28, fill: '#6366f1' },
    { name: 'Dream (₹8 - ₹15 LPA)', value: 72, fill: '#3b82f6' },
    { name: 'Core Engineering (₹5 - ₹8 LPA)', value: 164, fill: '#10b981' },
    { name: 'IT Services & Mass (₹3.5 - ₹5 LPA)', value: 112, fill: '#f59e0b' },
  ];

  const totalPlacedOverall = branchData.reduce((acc, b) => acc + b.placed, 0);
  const totalEligibleOverall = branchData.reduce((acc, b) => acc + b.eligible, 0);
  const institutionPlacementRate = Math.round((totalPlacedOverall / totalEligibleOverall) * 100);

  const filteredBranches = branchData.filter(
    b => selectedDeptFilter === 'All' || b.branch === selectedDeptFilter
  );

  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recomSkill.trim() || !recomAction.trim()) return;

    const newRec = {
      id: `rec-${Date.now()}`,
      skill: recomSkill.trim(),
      department: recomDept,
      action: recomAction.trim(),
      status: 'Under Review',
      targetBatch: 'Class of 2026',
    };

    setCouncilRecommendations(prev => [newRec, ...prev]);
    setShowRecommendationModal(false);
    setRecomSkill('');
    setRecomAction('');
    showToast(
      'Recommendation Recorded',
      `Academic Council advisory logged for ${newRec.department}: ${newRec.action}`,
      'success'
    );
  };

  const handleExportComparativeCSV = () => {
    const headers = [
      'Branch Code,Department Full Name,Total Enrolled,Eligible Cohort,Placed Students,Placement Rate (%),Avg Readiness Index,Average CTC,Highest CTC,Top Hiring Partners,NBA Accreditation',
    ];
    const rows = branchData.map(b => {
      const rate = Math.round((b.placed / b.eligible) * 100);
      return `"${b.branch}","${b.fullTitle}",${b.total},${b.eligible},${b.placed},${rate},${b.readiness},"${b.avgCtc}","${b.highestCtc}","${b.topRecruiter}","${b.nbaScore}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join('\n'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GMRIT_Institutional_Department_Comparison_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Department Report Exported', 'Downloaded complete institutional comparison matrix as CSV.', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Workspace Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Institutional Governance & Employability Analytics
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                GMRIT Rajam
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>NAAC A+ & NBA Tier-1 Autonomous Institute</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl">
              High-level strategic governance console for Principal, Deans, and Academic Council monitoring cross-departmental readiness, industry-curriculum gap alignment, and accreditation benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportComparativeCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-indigo-300" />
              <span>Export Comparison CSV</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Synchronized with Sidebar) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Institutional Analytics Overview', icon: BarChart3, badge: `${institutionPlacementRate}% Placed` },
            { id: 'departments', label: 'Department Comparison & NBA Benchmark', icon: Building2, badge: `${branchData.length} Branches` },
            { id: 'skill-trends', label: 'Industry Skill Trends & Gap Analysis', icon: Compass, badge: 'Curriculum' },
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
      {/* TAB 1: INSTITUTIONAL ANALYTICS OVERVIEW */}
      {/* ========================================================= */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 4 Macro KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Institutional Placement Rate
                </span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">{institutionPlacementRate}%</div>
              <span className="text-xs text-slate-400 block">
                {totalPlacedOverall} of {totalEligibleOverall} eligible placed
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Campus Composite Readiness
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-indigo-600">79.2 / 100</div>
              <span className="text-xs text-slate-400 block">Weighted average across 6 engineering branches</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Highest Campus Package
                </span>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">₹44.5 LPA</div>
              <span className="text-xs text-indigo-600 font-semibold block">Microsoft India • SDE</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Corporate Recruiters
                </span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Building2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-blue-600">42 Firms</div>
              <span className="text-xs text-slate-400 block">Visiting Tier-1 MNCs & Product Startups</span>
            </div>
          </div>

          {/* Visualizations: Cross-Department Readiness & Package Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Comparison Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Branch-wise Readiness vs Placement Conversion</span>
                </h3>
                <button
                  onClick={() => handleTabChange('departments')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="readiness" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Avg Readiness Index" />
                    <Bar
                      dataKey={b => Math.round((b.placed / b.eligible) * 100)}
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      name="Placement Rate (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Salary Tier Pie Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-600" />
                  <span>Campus Compensation Tier Breakdown</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">376 Total Offers</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryTiersData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${(entry.name || '').split(' ')[0]} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                    >
                      {salaryTiersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DEPARTMENT COMPARISON & ACCREDITATION BENCHMARK */}
      {/* ========================================================= */}
      {currentTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>Departmental Performance & NBA Tier-1 Benchmarks ({filteredBranches.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehensive audit of academic branches, median packages, student placement outcomes, and accreditation audit scores.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDeptFilter}
                  onChange={e => setSelectedDeptFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="AIDS">AIDS</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                </select>

                <button
                  onClick={handleExportComparativeCSV}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Department Comparison Cards / Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4">Branch / Department</th>
                    <th className="py-3 px-3">Enrolled / Eligible</th>
                    <th className="py-3 px-3">Placement Conversion</th>
                    <th className="py-3 px-3">Avg SCIC Readiness</th>
                    <th className="py-3 px-3">Package Compensation</th>
                    <th className="py-3 px-3">Top Marquee Recruiters</th>
                    <th className="py-3 px-4">NBA Tier-1 Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBranches.map(b => {
                    const rate = Math.round((b.placed / b.eligible) * 100);
                    return (
                      <tr key={b.branch} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{b.fullTitle}</div>
                          <span className="text-[11px] font-mono text-indigo-600 font-bold">{b.branch}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-900">{b.total} Enrolled</span>
                          <span className="block text-[10px] text-slate-400">{b.eligible} Eligible Cohort</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-emerald-700 text-xs">{rate}%</span>
                            <span className="text-[11px] text-slate-500 font-medium">({b.placed} Placed)</span>
                          </div>
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${rate}%` }}></div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-extrabold text-slate-900 text-xs">{b.readiness} / 100</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">Avg: {b.avgCtc}</div>
                          <span className="text-[10px] text-indigo-700 font-semibold block">Max: {b.highestCtc}</span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600">
                          {b.topRecruiter}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {b.nbaScore}
                          </span>
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
      {/* TAB 3: INDUSTRY SKILL TRENDS & GAP ANALYSIS */}
      {/* ========================================================= */}
      {currentTab === 'skill-trends' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Corporate Skill Demand vs Student Supply Alignment Matrix</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Cross-references recruiter tech stack specifications against student profile competencies to spotlight curriculum revision priorities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRecommendationModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Propose Academic Council Advisory</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter skills (e.g. Docker, Python, System Design)..."
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <span className="text-xs text-slate-400 font-medium">
                Analysis based on {opportunities.length} live corporate job postings & {students.length} student profiles.
              </span>
            </div>
          </div>

          {/* Demand vs Supply Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Industry Requirement Volume vs Student Cohort Supply</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Headcount / Postings</span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="industryDemand" fill="#6366f1" radius={[6, 6, 0, 0]} name="Recruiter Job Postings" />
                  <Bar dataKey="studentSupply" fill="#10b981" radius={[6, 6, 0, 0]} name="Verified Student Supply" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Academic Council Recommendations Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Academic Council Curriculum Interventions & Bridge Directives</span>
              </h3>
              <span className="text-xs text-slate-400">Institutional Action Plan</span>
            </div>

            <div className="space-y-3">
              {councilRecommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rec.skill}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'Implemented'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <div className="text-slate-600 flex items-center justify-between">
                    <span>Department: <strong>{rec.department}</strong></span>
                    <span>Target Cohort: {rec.targetBatch}</span>
                  </div>

                  <p className="text-slate-700 text-xs font-medium pt-1">
                    Directive: {rec.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PROPOSE ACADEMIC COUNCIL ADVISORY */}
      {/* ========================================================= */}
      {showRecommendationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Academic Council Advisory</h3>
              <button onClick={() => setShowRecommendationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecommendation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Technology / Skill Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Databases & NoSQL Architecture"
                  value={recomSkill}
                  onChange={e => setRecomSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Department(s)</label>
                <input
                  type="text"
                  value={recomDept}
                  onChange={e => setRecomDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recommended Academic Intervention *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Introduce 30-hour hands-on capstone sprint on Apache Kafka and Redis cluster configuration before 7th semester campus drives."
                  value={recomAction}
                  onChange={e => setRecomAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecommendationModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Submit Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
