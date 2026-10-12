export type UserRole =
  | 'student'
  | 'recruiter'
  | 'faculty'
  | 'alumni'
  | 'cdc_admin'
  | 'institutional_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  title?: string;
  company?: string;
  createdAt: string;
}

export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'Backend Development'
  | 'Databases'
  | 'Cloud & DevOps'
  | 'AI & Machine Learning'
  | 'Data Analytics'
  | 'CS Fundamentals'
  | 'Soft Skills';

export interface SkillItem {
  id?: string;
  name: string;
  category: SkillCategory;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified?: boolean; // via assessment or project evaluation
  sourceEvidence?: string;
  confidence?: number;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  verified?: boolean;
}

export interface StudentExperience {
  id: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
  type: 'Internship' | 'Full-time' | 'Research' | 'Freelance';
}

export interface StudentCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string; // e.g., CSE, ECE, IT, MECH, CIVIL, EEE, AIDS
  degree: string; // e.g., B.Tech
  academicYear: string; // e.g., 4th Year (Final Year)
  graduationYear: number; // e.g., 2025
  cgpa: number; // e.g., 8.45
  standingBacklogs: number; // e.g., 0
  preferredLocation: string;
  targetRole: string; // e.g., Full Stack Developer
  careerObjective: string;
  skills: SkillItem[];
  softSkills: string[];
  projects: StudentProject[];
  experience: StudentExperience[];
  certifications: StudentCertification[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeLastAnalyzed?: string;
  readinessScore: number; // 0 - 100
  portfolioPublic: boolean;
  publicSlug: string;
}

export type OpportunityType =
  | 'Full-time'
  | 'Internship'
  | 'Summer Internship'
  | 'Industry Project'
  | 'Workshop'
  | 'Hackathon'
  | 'Mentorship';

export type WorkArrangement = 'On-site' | 'Remote' | 'Hybrid';

export interface Opportunity {
  id: string;
  recruiterId: string;
  company: string;
  companyLogo?: string;
  title: string;
  type: OpportunityType;
  workArrangement: WorkArrangement;
  location: string;
  stipendOrSalary: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minCgpa: number;
  maxBacklogsAllowed: number;
  allowedDepartments: string[]; // e.g., ['CSE', 'IT', 'ECE', 'All']
  openings: number;
  deadline: string;
  status: 'active' | 'closed';
  createdAt: string;
  driveDate?: string;
  applicationInstructions?: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Assessment'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentCgpa: number;
  studentRollNumber: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  recruiterNotes?: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  interviewDetails?: {
    date: string;
    time: string;
    mode: 'Online' | 'GMRIT Campus Placement Cell (Block 3)' | 'Company Office';
    meetingLinkOrVenue: string;
    interviewerName?: string;
  };
}

export interface MatchResult {
  overallScore: number; // 0 - 100
  skillMatchScore: number; // 40% weight
  semanticScore: number; // 25% weight
  experienceScore: number; // 15% weight
  eligibilityScore: number; // 10% weight
  preferencesScore: number; // 10% weight
  isEligible: boolean;
  eligibilityIssues: string[];
  matchedSkills: string[];
  partiallyMatchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  recommendation: string;
}

export interface LearningResource {
  id: string;
  title: string;
  skillCovered: string;
  category: SkillCategory;
  resourceType: 'Course' | 'Documentation' | 'Practice' | 'Project' | 'Certification';
  provider: string;
  estimatedHours: number;
  url: string;
  description: string;
  freeTier: boolean;
}

export interface StudentLearningProgress {
  id: string;
  studentId: string;
  resourceId: string;
  resourceTitle: string;
  skillName: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface AssessmentQuestion {
  id: string;
  category: string;
  difficulty: QuestionDifficulty;
  subject: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  category: SkillCategory;
  skill: string;
  subject: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  assessmentId: string;
  assessmentTitle: string;
  skill: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  attemptedAt: string;
  difficultyBreakdown?: {
    easyPassed: number;
    easyTotal: number;
    mediumPassed: number;
    mediumTotal: number;
    hardPassed: number;
    hardTotal: number;
  };
}

export interface CodingTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isHidden?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  subject: 'Data Structures' | 'Algorithms' | 'DBMS & SQL' | 'Core CS' | 'Full Stack Web';
  difficulty: QuestionDifficulty;
  category: SkillCategory;
  timeLimitMinutes: number;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    javascript: string;
    python: string;
  };
  solutionTemplate: string;
  testCases: CodingTestCase[];
  hints: string[];
}

export interface CodingSubmission {
  id: string;
  studentId: string;
  challengeId: string;
  challengeTitle: string;
  language: 'javascript' | 'python';
  code: string;
  passed: boolean;
  passedTestCases: number;
  totalTestCases: number;
  outputLog: string;
  submittedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'interview';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface MentorshipSession {
  id: string;
  alumniId: string;
  alumniName: string;
  alumniCompany: string;
  studentId: string;
  studentName: string;
  topic: string;
  scheduledDate: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  meetingNotes?: string;
}

export interface PlacementDrive {
  id: string;
  company: string;
  date: string;
  roles: string[];
  venue: string;
  rounds: string[];
  eligibleBranches: string[];
  minCgpa: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  category?: 'Super Dream' | 'Dream' | 'Core Engineering' | 'IT Services';
  salaryPackage?: string;
  maxBacklogs?: number;
  contactSpoc?: string;
  notes?: string;
}

export interface StudentRegistrationData {
  role: 'student';
  fullName: string;
  email: string;
  phone?: string;
  rollNumber: string;
  department: string;
  degree?: string;
  academicYear?: string;
  graduationYear: number;
  cgpa: number;
  standingBacklogs: number;
  targetRole?: string;
}

export interface RecruiterRegistrationData {
  role: 'recruiter';
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  industry?: string;
  location?: string;
}

export interface FacultyRegistrationData {
  role: 'faculty';
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  employeeId?: string;
  title?: string;
  specialization?: string;
}

export interface AlumniRegistrationData {
  role: 'alumni';
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  graduationYear: number;
  company: string;
  title?: string;
  location?: string;
  linkedin?: string;
}

export interface CDCRegistrationData {
  role: 'cdc_admin';
  fullName: string;
  email: string;
  phone?: string;
  employeeId?: string;
  title?: string;
  department?: string;
}

export interface AdminRegistrationData {
  role: 'institutional_admin';
  fullName: string;
  email: string;
  phone?: string;
  employeeId?: string;
  title?: string;
  department?: string;
}

export type RegistrationPayload =
  | StudentRegistrationData
  | RecruiterRegistrationData
  | FacultyRegistrationData
  | AlumniRegistrationData
  | CDCRegistrationData
  | AdminRegistrationData;

