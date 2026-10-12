import {
  Application,
  Assessment,
  AssessmentAttempt,
  CodingChallenge,
  CodingSubmission,
  LearningResource,
  MentorshipSession,
  NotificationItem,
  Opportunity,
  PlacementDrive,
  RegistrationPayload,
  StudentLearningProgress,
  StudentProfile,
  User,
  UserRole,
} from '../types';
import {
  COMPREHENSIVE_ASSESSMENTS,
  COMPREHENSIVE_CODING_CHALLENGES,
} from './assessmentData';

const STORAGE_KEYS = {
  USERS: 'scic_gmrit_clean_users_v4',
  STUDENT_PROFILES: 'scic_gmrit_clean_students_v4',
  OPPORTUNITIES: 'scic_gmrit_clean_opportunities_v4',
  APPLICATIONS: 'scic_gmrit_clean_applications_v4',
  ASSESSMENTS: 'scic_gmrit_assessments_v4',
  ASSESSMENT_ATTEMPTS: 'scic_gmrit_clean_attempts_v4',
  CODING_CHALLENGES: 'scic_gmrit_coding_challenges_v4',
  CODING_SUBMISSIONS: 'scic_gmrit_clean_coding_submissions_v4',
  LEARNING_RESOURCES: 'scic_gmrit_learning_v4',
  LEARNING_PROGRESS: 'scic_gmrit_clean_learning_progress_v4',
  NOTIFICATIONS: 'scic_gmrit_clean_notifications_v4',
  MENTORSHIPS: 'scic_gmrit_clean_mentorships_v4',
  PLACEMENT_DRIVES: 'scic_gmrit_clean_drives_v4',
  OTPS: 'scic_gmrit_clean_otps_v4',
};

// --- INITIAL CLEAN DATA (ZERO DUMMY DATA) ---
export const INITIAL_USERS: User[] = [];
export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [];
export const INITIAL_OPPORTUNITIES: Opportunity[] = [];
export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_MENTORSHIPS: MentorshipSession[] = [];

// Templates for Diagnostic Tests & Coding Practice (Curriculum Standards)
export const INITIAL_ASSESSMENTS: Assessment[] = COMPREHENSIVE_ASSESSMENTS;
export const INITIAL_CODING_CHALLENGES: CodingChallenge[] = COMPREHENSIVE_CODING_CHALLENGES;

export const INITIAL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'lr-1',
    title: 'Official TypeScript Handbook — Advanced Typing & Generics',
    skillCovered: 'TypeScript',
    category: 'Programming',
    resourceType: 'Documentation',
    provider: 'Microsoft Docs',
    estimatedHours: 8,
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Comprehensive official guide on union types, type guards, generics, keyof operators, and strict configuration.',
    freeTier: true,
  },
  {
    id: 'lr-2',
    title: 'System Design Primer for Campus Placements',
    skillCovered: 'System Design',
    category: 'CS Fundamentals',
    resourceType: 'Documentation',
    provider: 'GitHub Open Source (Donne Martin)',
    estimatedHours: 24,
    url: 'https://github.com/donnemartin/system-design-primer',
    description: 'Industry-standard primer explaining caching, load balancers, database sharding, consistency models, and microservices.',
    freeTier: true,
  },
  {
    id: 'lr-3',
    title: 'Docker & Containerization for Full Stack Developers',
    skillCovered: 'Docker',
    category: 'Cloud & DevOps',
    resourceType: 'Course',
    provider: 'FreeCodeCamp',
    estimatedHours: 6,
    url: 'https://www.freecodecamp.org/news/tag/docker/',
    description: 'Hands-on practical walkthrough building multi-stage Dockerfiles, Docker Compose files, and volume mounts.',
    freeTier: true,
  },
  {
    id: 'lr-4',
    title: 'PostgreSQL Performance Optimization & Indexing Guide',
    skillCovered: 'PostgreSQL',
    category: 'Databases',
    resourceType: 'Practice',
    provider: 'PostgreSQL Official Docs',
    estimatedHours: 10,
    url: 'https://use-the-index-luke.com/',
    description: 'Learn EXPLAIN ANALYZE, B-Tree index traversal, multi-column indexes, and query planning mechanics.',
    freeTier: true,
  },
];

// --- REACTIVE EVENT EMITTER ---
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error('Error in db listener:', e);
    }
  });
}

export function subscribeToDb(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// --- HELPER STORAGE FUNCTIONS ---
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(val);
  } catch (err) {
    console.warn(`Failed to read ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

// --- STRICT ROLE EMAIL VALIDATION ---
export function validateRoleEmail(role: UserRole, email: string): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email format.' };
  }

  // Student and Alumni MUST end with @gmrit.edu.in
  if (role === 'student') {
    if (!trimmed.endsWith('@gmrit.edu.in')) {
      return {
        isValid: false,
        error: 'Student email must end with @gmrit.edu.in (e.g. 21341a0501@gmrit.edu.in)',
      };
    }
  } else if (role === 'alumni') {
    if (!trimmed.endsWith('@gmrit.edu.in')) {
      return {
        isValid: false,
        error: 'Alumni email must end with @gmrit.edu.in (e.g. alumni.name@gmrit.edu.in)',
      };
    }
  } else if (role === 'faculty') {
    if (!trimmed.endsWith('@gmrit.edu.in')) {
      return {
        isValid: false,
        error: 'Faculty email must end with @gmrit.edu.in',
      };
    }
  } else if (role === 'cdc_admin') {
    if (!trimmed.endsWith('@gmrit.edu.in')) {
      return {
        isValid: false,
        error: 'CDC Placement Head email must end with @gmrit.edu.in',
      };
    }
  } else if (role === 'institutional_admin') {
    if (!trimmed.endsWith('@gmrit.edu.in')) {
      return {
        isValid: false,
        error: 'Institutional Administrator email must end with @gmrit.edu.in',
      };
    }
  }

  return { isValid: true };
}

// --- OTP GENERATION & VERIFICATION ---
interface OtpRecord {
  code: string;
  expiresAt: number;
  email: string;
  role: UserRole;
}

export function generateAndStoreOtp(
  email: string,
  role: UserRole
): { success: boolean; otp: string; message: string } {
  const validation = validateRoleEmail(role, email);
  if (!validation.isValid) {
    return { success: false, otp: '', message: validation.error || 'Invalid email format' };
  }

  // Generate 6-digit numeric OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otps: Record<string, OtpRecord> = loadFromStorage(STORAGE_KEYS.OTPS, {});
  otps[email.trim().toLowerCase()] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    email: email.trim().toLowerCase(),
    role,
  };
  saveToStorage(STORAGE_KEYS.OTPS, otps);

  return {
    success: true,
    otp: code,
    message: `6-Digit OTP dispatched to ${email}`,
  };
}

export function verifyOtpCode(email: string, code: string): { isValid: boolean; error?: string } {
  const otps: Record<string, OtpRecord> = loadFromStorage(STORAGE_KEYS.OTPS, {});
  const record = otps[email.trim().toLowerCase()];

  if (!record) {
    return { isValid: false, error: 'No OTP requested for this email. Please request a new OTP code.' };
  }
  if (Date.now() > record.expiresAt) {
    return { isValid: false, error: 'OTP has expired. Please request a new verification code.' };
  }
  if (record.code !== code.trim()) {
    return { isValid: false, error: 'Invalid OTP code. Please enter the correct 6-digit code.' };
  }

  // Verified - clear used OTP
  delete otps[email.trim().toLowerCase()];
  saveToStorage(STORAGE_KEYS.OTPS, otps);
  return { isValid: true };
}

// --- DB ACCESS SERVICE ---
export const db = {
  // Users
  getUsers(): User[] {
    return loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },
  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  },
  saveUser(user: User): User {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    saveToStorage(STORAGE_KEYS.USERS, users);
    return user;
  },

  // Student Profiles
  getStudentProfiles(): StudentProfile[] {
    return loadFromStorage(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
  },
  getStudentProfile(userId: string): StudentProfile | undefined {
    return this.getStudentProfiles().find(p => p.userId === userId);
  },
  saveStudentProfile(profile: StudentProfile): StudentProfile {
    const profiles = this.getStudentProfiles();
    const idx = profiles.findIndex(p => p.userId === profile.userId);
    if (idx >= 0) {
      profiles[idx] = profile;
    } else {
      profiles.push(profile);
    }
    saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, profiles);
    return profile;
  },

  // Opportunities
  getOpportunities(): Opportunity[] {
    return loadFromStorage(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  },
  getOpportunityById(id: string): Opportunity | undefined {
    return this.getOpportunities().find(o => o.id === id);
  },
  saveOpportunity(opp: Opportunity): Opportunity {
    const opps = this.getOpportunities();
    const idx = opps.findIndex(o => o.id === opp.id);
    if (idx >= 0) {
      opps[idx] = opp;
    } else {
      opps.unshift(opp);
    }
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);
    return opp;
  },
  deleteOpportunity(id: string): void {
    const opps = this.getOpportunities().filter(o => o.id !== id);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);
  },

  // Applications
  getApplications(): Application[] {
    return loadFromStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },
  getApplicationById(id: string): Application | undefined {
    return this.getApplications().find(a => a.id === id);
  },
  saveApplication(app: Application): Application {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      apps[idx] = app;
    } else {
      apps.unshift(app);
    }
    saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);
    return app;
  },
  deleteApplication(id: string): void {
    const apps = this.getApplications().filter(a => a.id !== id);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);
  },

  // Assessments
  getAssessments(): Assessment[] {
    return loadFromStorage(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
  },
  getAssessmentById(id: string): Assessment | undefined {
    return this.getAssessments().find(a => a.id === id);
  },

  // Assessment Attempts
  getAttempts(studentId?: string): AssessmentAttempt[] {
    const attempts = loadFromStorage<AssessmentAttempt[]>(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, []);
    return studentId ? attempts.filter(a => a.studentId === studentId) : attempts;
  },
  saveAttempt(attempt: AssessmentAttempt): AssessmentAttempt {
    const attempts = this.getAttempts();
    attempts.unshift(attempt);
    saveToStorage(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, attempts);
    return attempt;
  },

  // Coding Challenges
  getCodingChallenges(): CodingChallenge[] {
    return loadFromStorage(STORAGE_KEYS.CODING_CHALLENGES, INITIAL_CODING_CHALLENGES);
  },
  getCodingChallengeById(id: string): CodingChallenge | undefined {
    return this.getCodingChallenges().find(c => c.id === id);
  },

  // Coding Submissions
  getCodingSubmissions(studentId?: string): CodingSubmission[] {
    const list = loadFromStorage<CodingSubmission[]>(STORAGE_KEYS.CODING_SUBMISSIONS, []);
    return studentId ? list.filter(s => s.studentId === studentId) : list;
  },
  saveCodingSubmission(sub: CodingSubmission): CodingSubmission {
    const list = this.getCodingSubmissions();
    list.unshift(sub);
    saveToStorage(STORAGE_KEYS.CODING_SUBMISSIONS, list);
    return sub;
  },

  // Learning Resources
  getLearningResources(): LearningResource[] {
    return loadFromStorage(STORAGE_KEYS.LEARNING_RESOURCES, INITIAL_LEARNING_RESOURCES);
  },

  // Learning Progress
  getLearningProgress(studentId: string): StudentLearningProgress[] {
    const list = loadFromStorage<StudentLearningProgress[]>(STORAGE_KEYS.LEARNING_PROGRESS, []);
    return list.filter(l => l.studentId === studentId);
  },
  saveLearningProgress(item: StudentLearningProgress): StudentLearningProgress {
    const all = loadFromStorage<StudentLearningProgress[]>(STORAGE_KEYS.LEARNING_PROGRESS, []);
    const idx = all.findIndex(x => x.id === item.id);
    if (idx >= 0) {
      all[idx] = item;
    } else {
      all.unshift(item);
    }
    saveToStorage(STORAGE_KEYS.LEARNING_PROGRESS, all);
    return item;
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    const all = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.userId === userId);
  },
  addNotification(item: NotificationItem): void {
    const all = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    all.unshift(item);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  },
  markNotificationRead(id: string): void {
    const all = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = all.find(n => n.id === id);
    if (item) {
      item.read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  },

  // Mentorships
  getMentorships(): MentorshipSession[] {
    return loadFromStorage(STORAGE_KEYS.MENTORSHIPS, INITIAL_MENTORSHIPS);
  },
  saveMentorship(m: MentorshipSession): MentorshipSession {
    const all = this.getMentorships();
    const idx = all.findIndex(x => x.id === m.id);
    if (idx >= 0) all[idx] = m;
    else all.unshift(m);
    saveToStorage(STORAGE_KEYS.MENTORSHIPS, all);
    return m;
  },

  // Placement Drives
  getPlacementDrives(): PlacementDrive[] {
    return loadFromStorage(STORAGE_KEYS.PLACEMENT_DRIVES, INITIAL_PLACEMENT_DRIVES);
  },
  savePlacementDrive(drive: PlacementDrive): PlacementDrive {
    const all = this.getPlacementDrives();
    const idx = all.findIndex(d => d.id === drive.id);
    if (idx >= 0) {
      all[idx] = drive;
    } else {
      all.unshift(drive);
    }
    saveToStorage(STORAGE_KEYS.PLACEMENT_DRIVES, all);
    return drive;
  },
  deletePlacementDrive(id: string): void {
    const all = this.getPlacementDrives().filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.PLACEMENT_DRIVES, all);
  },

  // Register New User in Database
  registerUser(payload: RegistrationPayload): User {
    const newUser: User = {
      id: `user-${payload.role}-${Date.now()}`,
      name: payload.fullName,
      email: payload.email.trim().toLowerCase(),
      role: payload.role,
      department: (payload as any).department,
      company: (payload as any).company,
      title: (payload as any).title,
      createdAt: new Date().toISOString(),
    };

    this.saveUser(newUser);

    // If Student, create initial StudentProfile with clean registered records
    if (payload.role === 'student') {
      const studentProfile: StudentProfile = {
        userId: newUser.id,
        fullName: payload.fullName,
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone || '+91 98480 00000',
        rollNumber: payload.rollNumber.toUpperCase(),
        department: payload.department,
        degree: payload.degree || 'B.Tech',
        academicYear: payload.academicYear || `${payload.graduationYear === 2025 ? '4th' : '3rd'} Year`,
        graduationYear: payload.graduationYear,
        cgpa: payload.cgpa,
        standingBacklogs: payload.standingBacklogs,
        preferredLocation: 'Hyderabad, Bengaluru, Visakhapatnam',
        targetRole: payload.targetRole || 'Software Development Engineer',
        careerObjective: `Motivated ${payload.department} student at GMRIT seeking corporate placement.`,
        skills: [
          { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', proficiency: 'Intermediate' },
          { name: 'Python', category: 'Programming', proficiency: 'Intermediate' },
          { name: 'Java', category: 'Programming', proficiency: 'Intermediate' },
        ],
        softSkills: ['Analytical Problem Solving', 'Communication', 'Teamwork'],
        projects: [],
        experience: [],
        certifications: [],
        readinessScore: Math.min(95, Math.max(30, Math.round(payload.cgpa * 9.2))),
        portfolioPublic: true,
        publicSlug: `${payload.rollNumber.toLowerCase()}-${payload.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      };
      this.saveStudentProfile(studentProfile);
    }

    return newUser;
  },

  // Reset demo data to default clean state
  resetAllDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    localStorage.setItem(STORAGE_KEYS.CODING_CHALLENGES, JSON.stringify(INITIAL_CODING_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.CODING_SUBMISSIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LEARNING_RESOURCES, JSON.stringify(INITIAL_LEARNING_RESOURCES));
    localStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MENTORSHIPS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PLACEMENT_DRIVES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OTPS, JSON.stringify({}));
    notifyListeners();
  },
};
