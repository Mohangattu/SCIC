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
  StudentLearningProgress,
  StudentProfile,
  User,
} from '../types';
import {
  COMPREHENSIVE_ASSESSMENTS,
  COMPREHENSIVE_CODING_CHALLENGES,
} from './assessmentData';

const STORAGE_KEYS = {
  USERS: 'scic_gmrit_users_v2',
  STUDENT_PROFILES: 'scic_gmrit_students_v2',
  OPPORTUNITIES: 'scic_gmrit_opportunities_v2',
  APPLICATIONS: 'scic_gmrit_applications_v2',
  ASSESSMENTS: 'scic_gmrit_assessments_v3',
  ASSESSMENT_ATTEMPTS: 'scic_gmrit_attempts_v3',
  CODING_CHALLENGES: 'scic_gmrit_coding_challenges_v3',
  CODING_SUBMISSIONS: 'scic_gmrit_coding_submissions_v3',
  LEARNING_RESOURCES: 'scic_gmrit_learning_v2',
  LEARNING_PROGRESS: 'scic_gmrit_learning_progress_v2',
  NOTIFICATIONS: 'scic_gmrit_notifications_v2',
  MENTORSHIPS: 'scic_gmrit_mentorships_v2',
  PLACEMENT_DRIVES: 'scic_gmrit_drives_v2',
};

// --- INITIAL SEED DATA ---
export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Rahul Sharma',
    email: 'rahul.21cse045@gmrit.edu.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    createdAt: '2024-01-15T09:00:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-student-2',
    name: 'Sneha Reddy',
    email: 'sneha.21ece012@gmrit.edu.in',
    role: 'student',
    department: 'Electronics & Communication Engineering',
    createdAt: '2024-01-16T10:00:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-student-3',
    name: 'Ananya Patel',
    email: 'ananya.21it022@gmrit.edu.in',
    role: 'student',
    department: 'Information Technology',
    createdAt: '2024-01-18T11:00:00.000Z',
  },
  {
    id: 'user-recruiter-1',
    name: 'Vikramaditya Sen',
    email: 'vikram.sen@microsoft.com',
    role: 'recruiter',
    company: 'Microsoft India',
    title: 'University Talent Acquisition Lead',
    createdAt: '2023-11-01T08:00:00.000Z',
  },
  {
    id: 'user-recruiter-2',
    name: 'Nisha Sundaram',
    email: 'nisha.sundaram@tcs.com',
    role: 'recruiter',
    company: 'Tata Consultancy Services',
    title: 'Campus Relations Manager',
    createdAt: '2023-11-10T08:00:00.000Z',
  },
  {
    id: 'user-faculty-1',
    name: 'Dr. K. Venkata Rao',
    email: 'venkatarao.k@gmrit.edu.in',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    title: 'Professor & Head of Department',
    createdAt: '2023-08-01T08:00:00.000Z',
  },
  {
    id: 'user-alumni-1',
    name: 'Priya Ananth',
    email: 'priya.alumni2022@gmail.com',
    role: 'alumni',
    company: 'Amazon Web Services',
    title: 'Software Development Engineer II (Alumni 2022 Batch)',
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 'user-cdc-1',
    name: 'Prof. M. Ramana Rao',
    email: 'cdc.head@gmrit.edu.in',
    role: 'cdc_admin',
    department: 'Career Development Center (CDC)',
    title: 'Dean - Training & Placement',
    createdAt: '2023-06-01T08:00:00.000Z',
  },
  {
    id: 'user-inst-1',
    name: 'Dr. C.L.V.R.S.V. Prasad',
    email: 'principal@gmrit.edu.in',
    role: 'institutional_admin',
    department: 'GMRIT Administration',
    title: 'Principal & Director, GMRIT',
    createdAt: '2023-05-01T08:00:00.000Z',
  },
];

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    userId: 'user-student-1',
    fullName: 'Rahul Sharma',
    email: 'rahul.21cse045@gmrit.edu.in',
    phone: '+91 98480 22334',
    rollNumber: '21341A0545',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    academicYear: '4th Year (Final Year)',
    graduationYear: 2025,
    cgpa: 8.45,
    standingBacklogs: 0,
    preferredLocation: 'Hyderabad, Bengaluru, Visakhapatnam',
    targetRole: 'Full Stack Developer',
    careerObjective:
      'Passionate engineering graduate seeking a challenging Software Engineering role in product-driven environments with high scalability and modern cloud architecture.',
    skills: [
      { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced', verified: true, sourceEvidence: 'Assessment Passed' },
      { name: 'TypeScript', category: 'Programming', proficiency: 'Intermediate', verified: true, sourceEvidence: 'Portfolio Project' },
      { name: 'React', category: 'Web Development', proficiency: 'Advanced', verified: true, sourceEvidence: 'Hackathon Win' },
      { name: 'Node.js', category: 'Backend Development', proficiency: 'Intermediate', verified: false, sourceEvidence: 'Resume' },
      { name: 'PostgreSQL', category: 'Databases', proficiency: 'Intermediate', verified: true, sourceEvidence: 'Coursework Lab' },
      { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', proficiency: 'Advanced', verified: true, sourceEvidence: 'CDC Assessment (92%)' },
      { name: 'Git', category: 'Cloud & DevOps', proficiency: 'Intermediate', verified: false },
      { name: 'Python', category: 'Programming', proficiency: 'Intermediate', verified: true },
    ],
    softSkills: ['Analytical Problem Solving', 'Technical Communication', 'Team Collaboration', 'Adaptability'],
    projects: [
      {
        id: 'proj-1',
        title: 'Smart Campus Event Hub',
        description:
          'Built a full-stack campus event management platform for GMRIT student clubs featuring QR-based check-in, real-time seat reservation, and email alerts.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        link: 'https://github.com/rahul-gmrit/campus-hub',
        startDate: 'Jan 2024',
        endDate: 'Apr 2024',
        verified: true,
      },
      {
        id: 'proj-2',
        title: 'Agricultural Leaf Disease Classifier',
        description:
          'Trained lightweight CNN deep learning model with 93% accuracy on local crop datasets and deployed on web portal for local farmers in Rajam district.',
        technologies: ['Python', 'TensorFlow', 'Flask', 'OpenCV'],
        link: 'https://github.com/rahul-gmrit/agri-leaf-classifier',
        startDate: 'Jul 2023',
        endDate: 'Nov 2023',
        verified: true,
      },
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Summer Software Development Intern',
        organization: 'GMR Varalakshmi Foundation Digital Center',
        duration: 'June 2024 – August 2024 (2 months)',
        description: 'Engineered student record verification services, refactored database queries resulting in a 32% latency reduction.',
        type: 'Internship',
      },
    ],
    certifications: [
      { id: 'cert-1', name: 'NPTEL: Programming, Data Structures and Algorithms Using Python (Elite+Silver)', issuer: 'IIT Madras', year: '2023' },
      { id: 'cert-2', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
    ],
    readinessScore: 82,
    portfolioPublic: true,
    publicSlug: 'rahul-sharma-21cse',
    resumeFileName: 'Rahul_Sharma_GMRIT_Resume_2025.pdf',
    resumeLastAnalyzed: '2024-09-20T10:30:00Z',
  },
  {
    userId: 'user-student-2',
    fullName: 'Sneha Reddy',
    email: 'sneha.21ece012@gmrit.edu.in',
    phone: '+91 99591 44552',
    rollNumber: '21341A0412',
    department: 'Electronics & Communication Engineering',
    degree: 'B.Tech',
    academicYear: '4th Year (Final Year)',
    graduationYear: 2025,
    cgpa: 8.82,
    standingBacklogs: 0,
    preferredLocation: 'Bengaluru, Hyderabad, Chennai',
    targetRole: 'Embedded Systems & IoT Engineer',
    careerObjective: 'Aspiring hardware-software co-design engineer focusing on ARM microcontrollers, embedded RTOS, and edge intelligence.',
    skills: [
      { name: 'C', category: 'Programming', proficiency: 'Advanced', verified: true },
      { name: 'C++', category: 'Programming', proficiency: 'Intermediate', verified: true },
      { name: 'Python', category: 'Programming', proficiency: 'Intermediate', verified: true },
      { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', proficiency: 'Intermediate', verified: true },
      { name: 'Operating Systems', category: 'CS Fundamentals', proficiency: 'Intermediate', verified: false },
    ],
    softSkills: ['Critical Thinking', 'Lab Leadership', 'Technical Documentation'],
    projects: [
      {
        id: 'proj-21',
        title: 'Smart Campus LoRaWAN Air Quality Node',
        description: 'Solar-powered ambient sensor node measuring PM2.5 and temperature across GMRIT campus blocks.',
        technologies: ['C', 'STM32', 'FreeRTOS', 'LoRaWAN'],
        verified: true,
      },
    ],
    experience: [],
    certifications: [
      { id: 'cert-21', name: 'ARM Cortex-M Microcontroller Programming', issuer: 'Coursera', year: '2023' },
    ],
    readinessScore: 76,
    portfolioPublic: true,
    publicSlug: 'sneha-reddy-21ece',
  },
  {
    userId: 'user-student-3',
    fullName: 'Ananya Patel',
    email: 'ananya.21it022@gmrit.edu.in',
    phone: '+91 94401 77661',
    rollNumber: '21341A1222',
    department: 'Information Technology',
    degree: 'B.Tech',
    academicYear: '4th Year (Final Year)',
    graduationYear: 2025,
    cgpa: 7.92,
    standingBacklogs: 0,
    preferredLocation: 'Bengaluru, Pune, Hyderabad',
    targetRole: 'Cloud DevOps Engineer',
    careerObjective: 'DevOps enthusiast dedicated to automating infrastructure, CI/CD pipelines, and cloud security monitoring.',
    skills: [
      { name: 'Python', category: 'Programming', proficiency: 'Intermediate' },
      { name: 'Linux', category: 'Cloud & DevOps', proficiency: 'Advanced' },
      { name: 'Docker', category: 'Cloud & DevOps', proficiency: 'Intermediate' },
      { name: 'Git', category: 'Cloud & DevOps', proficiency: 'Advanced' },
      { name: 'AWS', category: 'Cloud & DevOps', proficiency: 'Beginner' },
    ],
    softSkills: ['Troubleshooting', 'Automation Mindset'],
    projects: [],
    experience: [],
    certifications: [],
    readinessScore: 68,
    portfolioPublic: false,
    publicSlug: 'ananya-patel-21it',
  },
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    recruiterId: 'user-recruiter-1',
    company: 'Microsoft India',
    title: 'Software Development Engineer - Campus 2025',
    type: 'Full-time',
    workArrangement: 'Hybrid',
    location: 'Hyderabad / Bengaluru',
    stipendOrSalary: '₹14,50,000 - ₹18,00,000 LPA',
    description:
      'We are looking for inventive graduating engineers to design, build, and deploy hyper-scale cloud services on Microsoft Azure and Office 365 platforms. Candidates will work with cutting-edge distributed systems, resilient microservices, and AI integrations.',
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java', 'Object-Oriented Programming', 'System Design'],
    preferredSkills: ['TypeScript', 'Azure', 'Docker', 'Distributed Systems'],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    allowedDepartments: ['CSE', 'IT', 'ECE', 'AIDS'],
    openings: 8,
    deadline: '2026-11-15',
    status: 'active',
    createdAt: '2024-09-01T10:00:00Z',
    driveDate: '2026-11-20',
    applicationInstructions: 'Shortlisted candidates will take a 90-minute online coding round followed by 3 rounds of technical interviews.',
  },
  {
    id: 'opp-2',
    recruiterId: 'user-recruiter-1',
    company: 'Microsoft India',
    title: 'Cloud & AI Engineer Intern (6 Months)',
    type: 'Internship',
    workArrangement: 'Hybrid',
    location: 'Hyderabad',
    stipendOrSalary: '₹65,000 / month',
    description:
      'Exciting 6-month pre-placement internship for 4th year students. Join our Core Services Engineering group to automate cloud monitoring, optimize latency, and experiment with Generative AI workflows.',
    requiredSkills: ['Python', 'Cloud & DevOps', 'RESTful APIs', 'Git'],
    preferredSkills: ['Docker', 'Azure', 'Machine Learning'],
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    allowedDepartments: ['All'],
    openings: 5,
    deadline: '2026-11-10',
    status: 'active',
    createdAt: '2024-09-05T10:00:00Z',
    driveDate: '2026-11-18',
  },
  {
    id: 'opp-3',
    recruiterId: 'user-recruiter-2',
    company: 'Tata Consultancy Services',
    title: 'TCS Digital — Full Stack Engineer',
    type: 'Full-time',
    workArrangement: 'On-site',
    location: 'Visakhapatnam / Hyderabad / Bengaluru',
    stipendOrSalary: '₹7,50,000 - ₹9,00,000 LPA',
    description:
      'TCS Digital premier hiring track for top technical performers at GMRIT. Opportunity to work on modern client digital transformations using React, Spring Boot, microservices, and cloud-native databases.',
    requiredSkills: ['Java', 'React', 'SQL', 'Data Structures & Algorithms', 'RESTful APIs'],
    preferredSkills: ['Spring Boot', 'TypeScript', 'Docker', 'PostgreSQL'],
    minCgpa: 7.0,
    maxBacklogsAllowed: 0,
    allowedDepartments: ['CSE', 'IT', 'ECE', 'EEE', 'AIDS'],
    openings: 25,
    deadline: '2026-11-25',
    status: 'active',
    createdAt: '2024-09-10T10:00:00Z',
    driveDate: '2026-12-02',
  },
  {
    id: 'opp-4',
    recruiterId: 'user-recruiter-2',
    company: 'Tata Consultancy Services',
    title: 'TCS Ninja — Systems Engineer',
    type: 'Full-time',
    workArrangement: 'On-site',
    location: 'Pan India',
    stipendOrSalary: '₹3,60,000 - ₹4,20,000 LPA',
    description:
      'Campus-wide engineering recruitment drive for all branches. Comprehensive initial training at TCS Learning Centers followed by deployment to enterprise IT and infrastructure projects.',
    requiredSkills: ['C', 'Java', 'SQL', 'Analytical Problem Solving'],
    preferredSkills: ['Python', 'HTML5'],
    minCgpa: 6.0,
    maxBacklogsAllowed: 1,
    allowedDepartments: ['All'],
    openings: 60,
    deadline: '2026-12-05',
    status: 'active',
    createdAt: '2024-09-12T10:00:00Z',
  },
  {
    id: 'opp-5',
    recruiterId: 'user-recruiter-1',
    company: 'L&T Technology Services',
    title: 'Embedded Systems & Firmware Trainee',
    type: 'Full-time',
    workArrangement: 'On-site',
    location: 'Bengaluru / Mysuru',
    stipendOrSalary: '₹6,00,000 - ₹8,00,000 LPA',
    description:
      'Design firmware and real-time drivers for industrial automotive controllers and aerospace sub-systems. Hands-on laboratory training on modern microcontrollers.',
    requiredSkills: ['C', 'C++', 'Operating Systems', 'Microcontrollers'],
    preferredSkills: ['RTOS', 'Linux', 'Python'],
    minCgpa: 7.2,
    maxBacklogsAllowed: 0,
    allowedDepartments: ['ECE', 'EEE', 'CSE'],
    openings: 12,
    deadline: '2026-11-30',
    status: 'active',
    createdAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'opp-6',
    recruiterId: 'user-recruiter-2',
    company: 'GMR Innovation Labs',
    title: 'Smart Campus IoT & Industry 4.0 Project',
    type: 'Industry Project',
    workArrangement: 'On-site',
    location: 'GMRIT Campus, Rajam',
    stipendOrSalary: '₹15,000 / month Fellowship',
    description:
      'Funded industry capstone project sponsored by GMR Varalakshmi Foundation. Build sensor network pipelines and telemetry dashboards for campus solar microgrids.',
    requiredSkills: ['Python', 'RESTful APIs', 'React', 'Git'],
    preferredSkills: ['IoT Protocols', 'MQTT', 'Docker'],
    minCgpa: 6.5,
    maxBacklogsAllowed: 0,
    allowedDepartments: ['All'],
    openings: 6,
    deadline: '2026-11-05',
    status: 'active',
    createdAt: '2024-09-18T10:00:00Z',
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    studentId: 'user-student-1',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.21cse045@gmrit.edu.in',
    studentDepartment: 'Computer Science & Engineering',
    studentCgpa: 8.45,
    studentRollNumber: '21341A0545',
    opportunityId: 'opp-3',
    opportunityTitle: 'TCS Digital — Full Stack Engineer',
    company: 'Tata Consultancy Services',
    appliedDate: '2024-09-12T14:30:00Z',
    status: 'Interview',
    statusHistory: [
      { status: 'Applied', timestamp: '2024-09-12T14:30:00Z', note: 'Application registered successfully via SCIC' },
      { status: 'Under Review', timestamp: '2024-09-14T09:15:00Z', note: 'Profile screened by campus hiring team' },
      { status: 'Shortlisted', timestamp: '2024-09-18T16:00:00Z', note: 'High match score (88%) verified with CGPA 8.45' },
      { status: 'Assessment', timestamp: '2024-09-22T11:00:00Z', note: 'TCS Digital Coding Round completed - Score 88/100' },
      { status: 'Interview', timestamp: '2024-09-28T10:00:00Z', note: 'Technical Interview scheduled with Principal Architect' },
    ],
    recruiterNotes: 'Candidate has strong React and SQL hands-on foundation. Verified GitHub repository of campus event hub.',
    matchScore: 88,
    matchedSkills: ['React', 'Java', 'SQL', 'Data Structures & Algorithms', 'RESTful APIs'],
    missingSkills: ['Spring Boot'],
    interviewDetails: {
      date: '2026-10-16',
      time: '14:30 IST',
      mode: 'GMRIT Campus Placement Cell (Block 3)',
      meetingLinkOrVenue: 'Interview Panel Room 204, CDC Placement Block',
      interviewerName: 'Nisha Sundaram (HR) & K. Somasekhar (Tech Lead)',
    },
  },
  {
    id: 'app-2',
    studentId: 'user-student-1',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.21cse045@gmrit.edu.in',
    studentDepartment: 'Computer Science & Engineering',
    studentCgpa: 8.45,
    studentRollNumber: '21341A0545',
    opportunityId: 'opp-1',
    opportunityTitle: 'Software Development Engineer - Campus 2025',
    company: 'Microsoft India',
    appliedDate: '2024-09-15T11:20:00Z',
    status: 'Under Review',
    statusHistory: [
      { status: 'Applied', timestamp: '2024-09-15T11:20:00Z', note: 'Application submitted' },
      { status: 'Under Review', timestamp: '2024-09-20T10:00:00Z', note: 'Initial resume screening in progress' },
    ],
    matchScore: 84,
    matchedSkills: ['Data Structures & Algorithms', 'Java', 'Object-Oriented Programming', 'TypeScript'],
    missingSkills: ['System Design', 'C++'],
  },
  {
    id: 'app-3',
    studentId: 'user-student-2',
    studentName: 'Sneha Reddy',
    studentEmail: 'sneha.21ece012@gmrit.edu.in',
    studentDepartment: 'Electronics & Communication Engineering',
    studentCgpa: 8.82,
    studentRollNumber: '21341A0412',
    opportunityId: 'opp-5',
    opportunityTitle: 'Embedded Systems & Firmware Trainee',
    company: 'L&T Technology Services',
    appliedDate: '2024-09-16T12:00:00Z',
    status: 'Shortlisted',
    statusHistory: [
      { status: 'Applied', timestamp: '2024-09-16T12:00:00Z' },
      { status: 'Under Review', timestamp: '2024-09-18T10:00:00Z' },
      { status: 'Shortlisted', timestamp: '2024-09-24T15:00:00Z', note: 'Strong academic record (8.82 CGPA) and ARM Cortex project' },
    ],
    matchScore: 82,
    matchedSkills: ['C', 'C++', 'Operating Systems'],
    missingSkills: ['Microcontrollers'],
  },
  {
    id: 'app-4',
    studentId: 'user-student-3',
    studentName: 'Ananya Patel',
    studentEmail: 'ananya.21it022@gmrit.edu.in',
    studentDepartment: 'Information Technology',
    studentCgpa: 7.92,
    studentRollNumber: '21341A1222',
    opportunityId: 'opp-2',
    opportunityTitle: 'Cloud & AI Engineer Intern (6 Months)',
    company: 'Microsoft India',
    appliedDate: '2024-09-18T09:00:00Z',
    status: 'Applied',
    statusHistory: [{ status: 'Applied', timestamp: '2024-09-18T09:00:00Z' }],
    matchScore: 75,
    matchedSkills: ['Python', 'Cloud & DevOps', 'Git'],
    missingSkills: ['RESTful APIs'],
  },
];

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
    provider: 'PostgreSQL Official Docs & Use The Index Luke',
    estimatedHours: 10,
    url: 'https://use-the-index-luke.com/',
    description: 'Learn EXPLAIN ANALYZE, B-Tree index traversal, multi-column indexes, and query planning mechanics.',
    freeTier: true,
  },
  {
    id: 'lr-5',
    title: 'Spring Boot 3 Microservices Architecture',
    skillCovered: 'Spring Boot',
    category: 'Backend Development',
    resourceType: 'Course',
    provider: 'Baeldung & Spring.io Guides',
    estimatedHours: 18,
    url: 'https://spring.io/guides',
    description: 'Step-by-step tutorials on building Spring Boot REST controllers, Spring Data JPA repositories, and security filters.',
    freeTier: true,
  },
  {
    id: 'lr-6',
    title: 'AWS Cloud Practitioner Foundational Lab Essentials',
    skillCovered: 'AWS',
    category: 'Cloud & DevOps',
    resourceType: 'Certification',
    provider: 'AWS Skill Builder',
    estimatedHours: 15,
    url: 'https://aws.amazon.com/training/',
    description: 'Official free AWS modules covering EC2, S3, IAM policies, VPC basics, and CloudWatch metrics.',
    freeTier: true,
  },
];

export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: 'drive-1',
    company: 'Microsoft India',
    date: '2026-11-20',
    roles: ['Software Development Engineer', 'Cloud Intern'],
    venue: 'GMRIT Campus Auditorium & CDC Online Lab Block',
    rounds: ['Online Coding Test', 'Technical Round 1', 'Technical Round 2', 'Leadership Fit'],
    eligibleBranches: ['CSE', 'IT', 'ECE', 'AIDS'],
    minCgpa: 8.0,
    status: 'Upcoming',
    category: 'Super Dream',
    salaryPackage: '₹44.50 LPA (Full-time) / ₹80,000/mo',
    maxBacklogs: 0,
    contactSpoc: 'Mr. Arvind Swaminathan (University Talent Lead)',
    notes: 'Shortlisted candidates will report to Lab 2 at 8:30 AM with college ID card.',
  },
  {
    id: 'drive-2',
    company: 'Tata Consultancy Services',
    date: '2026-12-02',
    roles: ['TCS Digital', 'TCS Ninja', 'TCS Prime'],
    venue: 'GMRIT Main Seminar Hall & CDC Computer Lab 4',
    rounds: ['National Qualifier Test', 'Technical Interview', 'HR Interview'],
    eligibleBranches: ['All'],
    minCgpa: 6.5,
    status: 'Upcoming',
    category: 'Dream',
    salaryPackage: '₹7.50 LPA - ₹9.00 LPA (Digital) / ₹3.80 LPA (Ninja)',
    maxBacklogs: 1,
    contactSpoc: 'Ms. Keerthi Varma (Regional Campus Lead)',
    notes: 'Mandatory PAN card and TCS NextStep registration confirmation required.',
  },
  {
    id: 'drive-3',
    company: 'L&T Technology Services',
    date: '2026-11-30',
    roles: ['Embedded Systems Trainee', 'IoT Solutions Engineer'],
    venue: 'ECE Department Conference Hall & CDC Seminar Room',
    rounds: ['Aptitude & Core Electronics Test', 'Technical Panel', 'Managerial'],
    eligibleBranches: ['ECE', 'EEE', 'CSE'],
    minCgpa: 7.2,
    status: 'Upcoming',
    category: 'Core Engineering',
    salaryPackage: '₹6.50 LPA - ₹8.00 LPA',
    maxBacklogs: 0,
    contactSpoc: 'Dr. K. Srinivas (Placement Coordinator)',
    notes: 'Bring 2 copies of physical resume and hardware project documentation.',
  },
  {
    id: 'drive-4',
    company: 'Amazon Web Services',
    date: '2026-10-28',
    roles: ['Cloud Support Associate', 'Solutions Architect Intern'],
    venue: 'Virtual & CDC Video Conference Suite',
    rounds: ['Online Debugging & Work Styles Assessment', 'Virtual Bar Raiser', 'Technical Interview'],
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    minCgpa: 7.8,
    status: 'Ongoing',
    category: 'Super Dream',
    salaryPackage: '₹22.00 LPA - ₹28.50 LPA',
    maxBacklogs: 0,
    contactSpoc: 'Deepak Nair (AWS University Programs)',
    notes: 'Interviews are currently underway for shortlisted candidates from Round 1.',
  },
  {
    id: 'drive-5',
    company: 'Cognizant Technology Solutions',
    date: '2026-10-15',
    roles: ['GenC Next Developer', 'GenC Elevate Analyst'],
    venue: 'CDC Auditorium & Online Labs 1, 2, 3',
    rounds: ['Aptitude & Skill-based Coding', 'Technical Interview', 'HR Discussion'],
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical'],
    minCgpa: 6.8,
    status: 'Completed',
    category: 'Dream',
    salaryPackage: '₹6.75 LPA - ₹9.25 LPA',
    maxBacklogs: 0,
    contactSpoc: 'Harika Das (Cognizant HR Campus)',
    notes: 'Drive completed successfully. 42 offers generated across departments.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'TCS Digital Interview Scheduled!',
    message: 'Your Technical Interview is scheduled on 16th Oct at 14:30 IST in CDC Block Room 204. Good luck!',
    type: 'interview',
    read: false,
    createdAt: '2024-09-28T10:05:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'New Campus Drive Announced: Microsoft India',
    message: 'Microsoft Campus 2025 hiring drive opened for CSE/IT/ECE. Check eligibility and match score.',
    type: 'info',
    read: true,
    createdAt: '2024-09-02T09:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-recruiter-2',
    title: 'New Applicant for TCS Digital',
    message: 'Rahul Sharma (CGPA 8.45, 88% Match) submitted an application for TCS Digital.',
    type: 'info',
    read: false,
    createdAt: '2024-09-12T14:31:00Z',
  },
];

export const INITIAL_MENTORSHIPS: MentorshipSession[] = [
  {
    id: 'ment-1',
    alumniId: 'user-alumni-1',
    alumniName: 'Priya Ananth',
    alumniCompany: 'Amazon Web Services',
    studentId: 'user-student-1',
    studentName: 'Rahul Sharma',
    topic: 'Resume Review & System Design Interview Preparation for Big Tech',
    scheduledDate: '2026-10-18',
    timeSlot: '17:00 – 17:45 IST',
    status: 'Confirmed',
    meetingNotes: 'Student asked for advice on explaining distributed database tradeoffs during campus rounds.',
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

// --- DB ACCESS SERVICE ---
export const db = {
  // Users
  getUsers(): User[] {
    return loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
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
    const attempts = loadFromStorage<AssessmentAttempt[]>(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, [
      {
        id: 'att-1',
        studentId: 'user-student-1',
        assessmentId: 'assess-1',
        assessmentTitle: 'Data Structures & Algorithms Diagnostic',
        skill: 'Data Structures & Algorithms',
        score: 28,
        totalMarks: 30,
        passed: true,
        attemptedAt: '2024-09-10T11:00:00Z',
      },
    ]);
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
    const list = loadFromStorage<StudentLearningProgress[]>(STORAGE_KEYS.LEARNING_PROGRESS, [
      {
        id: 'lp-1',
        studentId: 'user-student-1',
        resourceId: 'lr-2',
        resourceTitle: 'System Design Primer for Campus Placements',
        skillName: 'System Design',
        status: 'In Progress',
        startedAt: '2024-09-15T10:00:00Z',
      },
    ]);
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

  // Reset demo data to default clean state
  resetAllDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(INITIAL_STUDENT_PROFILES));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    localStorage.setItem(STORAGE_KEYS.CODING_CHALLENGES, JSON.stringify(INITIAL_CODING_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.CODING_SUBMISSIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LEARNING_RESOURCES, JSON.stringify(INITIAL_LEARNING_RESOURCES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.MENTORSHIPS, JSON.stringify(INITIAL_MENTORSHIPS));
    localStorage.setItem(STORAGE_KEYS.PLACEMENT_DRIVES, JSON.stringify(INITIAL_PLACEMENT_DRIVES));
    notifyListeners();
  },
};
