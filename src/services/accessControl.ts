import { UserRole } from '../types';

export interface RoleConfig {
  role: UserRole;
  title: string;
  clearanceLevel: number;
  clearanceLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  allowedViews: string[];
  capabilities: string[];
  description: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  student: {
    role: 'student',
    title: 'Student Scholar',
    clearanceLevel: 1,
    clearanceLabel: 'Clearance Tier 1: Learner Access',
    badgeBg: 'bg-blue-50 text-blue-700',
    badgeText: 'CSE 4th Year',
    badgeBorder: 'border-blue-200',
    accentColor: 'blue',
    allowedViews: [
      'dashboard',
      'resume-ai',
      'skill-gap',
      'opportunities',
      'applications',
      'profile',
      'assessments',
      'portfolio',
    ],
    capabilities: [
      'Self-Profile & Credentials Management',
      'Verified Multi-Tier Skill Assessments (Easy/Med/Hard)',
      'AI Resume Intelligence & Job Scoring',
      'Search & Apply for Campus Opportunities',
      'Application Progress Live Tracking',
      'Public Digital Shareable Portfolio',
    ],
    description:
      'Authorized to manage personal academic credentials, undertake skill assessments, optimize resumes, and apply to approved campus recruitment drives.',
  },

  alumni: {
    role: 'alumni',
    title: 'Distinguished Alumni',
    clearanceLevel: 2,
    clearanceLabel: 'Clearance Tier 2: Alumni Contributor',
    badgeBg: 'bg-amber-50 text-amber-700',
    badgeText: 'AWS SDE II (2022)',
    badgeBorder: 'border-amber-200',
    accentColor: 'amber',
    allowedViews: ['dashboard', 'mentorships', 'post-opportunity'],
    capabilities: [
      'Host 1-on-1 Mentorship & Mock Interviews',
      'Post Corporate Employee Referrals',
      'Track Mentee Engagements & Milestones',
      'Alumni Community Impact Metrics',
    ],
    description:
      'Authorized to post industry referrals, schedule mentorship sessions, conduct mock interviews, and advise final-year engineering scholars.',
  },

  faculty: {
    role: 'faculty',
    title: 'Faculty Mentor & HOD',
    clearanceLevel: 3,
    clearanceLabel: 'Clearance Tier 3: Academic Mentorship',
    badgeBg: 'bg-purple-50 text-purple-700',
    badgeText: 'Professor & HOD',
    badgeBorder: 'border-purple-200',
    accentColor: 'purple',
    allowedViews: ['dashboard', 'mentees', 'collaborations'],
    capabilities: [
      'Department Student Readiness Monitoring',
      'Student Mentee Audits & Project Endorsements',
      'Industry & Faculty Development Projects (FDP)',
      'Assign Academic Interventions & Bridge Tasks',
    ],
    description:
      'Authorized to audit departmental academic readiness, track student mentee progress, verify technical projects, and spearhead industry collaborations.',
  },

  recruiter: {
    role: 'recruiter',
    title: 'Corporate Talent Partner',
    clearanceLevel: 3,
    clearanceLabel: 'Clearance Tier 3: Industry Recruiter',
    badgeBg: 'bg-indigo-50 text-indigo-700',
    badgeText: 'Microsoft / TCS Talent Lead',
    badgeBorder: 'border-indigo-200',
    accentColor: 'indigo',
    allowedViews: ['dashboard', 'post-job', 'pipeline', 'profile'],
    capabilities: [
      'Post Verified Campus Opportunities & Job Profiles',
      'Applicant Tracking System (ATS) Pipeline Review',
      'Shortlist, Schedule Interviews & Make Job Offers',
      'Company Profile & Recruitment Preferences Desk',
    ],
    description:
      'Authorized to publish recruitment openings, evaluate student application dossiers, manage candidate pipelines, and disburse recruitment selections.',
  },

  cdc_admin: {
    role: 'cdc_admin',
    title: 'CDC Placement Head (Dean)',
    clearanceLevel: 4,
    clearanceLabel: 'Clearance Tier 4: Placement Directorate',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    badgeText: 'Dean Training & Placement',
    badgeBorder: 'border-emerald-200',
    accentColor: 'emerald',
    allowedViews: ['dashboard', 'drives', 'readiness', 'analytics'],
    capabilities: [
      'Manage Full Campus Drives Calendar & Scheduling',
      'Cross-Branch Student Readiness Matrix & Audit',
      'Nominate Candidates & Enforce Eligibility Criteria',
      'Accreditation Reporting & CSV Exporters (NAAC / NIRF)',
      'Dispatch Urgent Campus-Wide Broadcast Bulletins',
    ],
    description:
      'Full administrative authority over campus recruitment drives, company liaisons, candidate readiness oversight, and statutory accreditation datasets.',
  },

  institutional_admin: {
    role: 'institutional_admin',
    title: 'Institutional Directorate',
    clearanceLevel: 5,
    clearanceLabel: 'Clearance Tier 5: Institutional Governance',
    badgeBg: 'bg-slate-100 text-slate-800',
    badgeText: 'Principal & Director',
    badgeBorder: 'border-slate-300',
    accentColor: 'slate',
    allowedViews: ['dashboard', 'departments', 'skill-trends'],
    capabilities: [
      'Institutional Executive Governance & KPI Dashboards',
      'Inter-Departmental Performance & NBA Compliance Benchmarks',
      'Industry Emerging Skill Trends & Macro Market Forecasting',
      'Export Executive Institutional Accreditation Dossiers',
    ],
    description:
      'Highest institutional clearance. Governs college-wide employability indices, inter-departmental benchmarking, NBA/NAAC criteria, and macro curriculum strategic alignment.',
  },
};

/**
 * Checks whether a given role has clearance to view an activeView id.
 */
export function canAccessView(role: UserRole, viewId: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.allowedViews.includes(viewId);
}

/**
 * Returns roles that are permitted to access a given view.
 */
export function getPermittedRolesForView(viewId: string): UserRole[] {
  return (Object.keys(ROLE_CONFIGS) as UserRole[]).filter(r =>
    ROLE_CONFIGS[r].allowedViews.includes(viewId)
  );
}

export interface PermissionMatrixItem {
  feature: string;
  category: string;
  student: boolean;
  alumni: boolean;
  faculty: boolean;
  recruiter: boolean;
  cdc_admin: boolean;
  institutional_admin: boolean;
  description: string;
}

export const RBAC_PERMISSION_MATRIX: PermissionMatrixItem[] = [
  {
    feature: 'Core Student Assessments',
    category: 'Skill Verification',
    student: true,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Undertake multi-tier coding and core engineering assessments with verified credential badges.',
  },
  {
    feature: 'AI Resume Intelligence & Score',
    category: 'Student Hub',
    student: true,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Upload resumes for ATS scoring, action verb enhancement, and missing skill analysis.',
  },
  {
    feature: 'Job Applications & Digital Portfolio',
    category: 'Student Hub',
    student: true,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Submit campus applications and share public engineering portfolio link.',
  },
  {
    feature: 'Post Job Openings & AI Assistant',
    category: 'Industry Recruiter',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: true,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Publish full-time and internship openings with automated skill matching.',
  },
  {
    feature: 'ATS Pipeline & Candidate Evaluation',
    category: 'Industry Recruiter',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: true,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Screen applied candidates, change hiring stages (Applied -> Shortlisted -> Offered).',
  },
  {
    feature: 'Campus Drives Calendar & Scheduling',
    category: 'CDC Directorate',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: true,
    institutional_admin: false,
    description: 'Schedule corporate placement drives, setup venues, criteria, and interview dates.',
  },
  {
    feature: 'Student Readiness Matrix & Audit',
    category: 'CDC Directorate',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: true,
    institutional_admin: false,
    description: 'Inspect full student cohort readiness, standing backlogs, and assign bridge courses.',
  },
  {
    feature: 'Statutory NAAC & NIRF Data Export',
    category: 'CDC Directorate',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: true,
    institutional_admin: true,
    description: 'Download verified CSV datasets formatted for Criterion 5.2.1 and NIRF submissions.',
  },
  {
    feature: 'Department Readiness & Mentee Oversight',
    category: 'Academic Faculty',
    student: false,
    alumni: false,
    faculty: true,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Oversee student mentees, endorse research/capstone projects, and track department readiness.',
  },
  {
    feature: 'Industry & FDP Collaborations',
    category: 'Academic Faculty',
    student: false,
    alumni: false,
    faculty: true,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Manage joint faculty-industry development programs, consultancies, and hackathons.',
  },
  {
    feature: '1-on-1 Mentorship Sessions Desk',
    category: 'Alumni Network',
    student: false,
    alumni: true,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Host mentorship office hours, conduct resume reviews, and guide junior scholars.',
  },
  {
    feature: 'Post Corporate Referrals',
    category: 'Alumni Network',
    student: false,
    alumni: true,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: false,
    description: 'Publish employee referral opportunities directly to campus talent pool.',
  },
  {
    feature: 'Institutional Analytics & NBA Benchmarks',
    category: 'Executive Governance',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: true,
    description: 'High-level executive KPIs, inter-branch benchmarking, and NBA outcome attainments.',
  },
  {
    feature: 'Industry Emerging Skill Trends Forecasting',
    category: 'Executive Governance',
    student: false,
    alumni: false,
    faculty: false,
    recruiter: false,
    cdc_admin: false,
    institutional_admin: true,
    description: 'Macro skill curriculum alignment, demand-versus-supply market forecasting.',
  },
];
