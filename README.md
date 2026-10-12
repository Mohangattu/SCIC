# SCIC — Smart Campus and Industry Connect System
**Institution:** GMR Institute of Technology (GMRIT), Rajam, Andhra Pradesh (Autonomous, NAAC 'A' Grade, NBA Accredited)

SCIC connects graduating engineering students, corporate recruiters, faculty mentors, alumni, and placement officers (CDC) through an intelligent, explainable employability platform.

---

## 1. Core Problem & System Architecture

### The Problem
The critical gap between traditional academic learning and industry expectations:
- Students lack clarity on which skills they possess, which are missing for their target roles, and how recruiters evaluate candidates.
- Recruiters lack trustworthy, verified skill signals beyond GPA numbers.
- Career Development Cells (CDC) and Institutional Directors need real-time placement funnels and curriculum-industry skill gap data.

### The SCIC Core Workflow
```
Student Profile + Resume + Assessments + Projects
  → Skill Extraction and Normalization (Taxonomy Engine)
  → Industry Requirement Analysis (Gemini 3.8 Flash)
  → Skill-Gap Analysis & 4-Week Actionable Roadmap
  → Explainable 5-Factor Mathematical Matching
  → Learning Recommendations & Milestone Tracking
  → Real-Time Recruitment Pipeline (ATS)
  → Placement Funnel & Institutional Analytics (NAAC/NIRF)
```

---

## 2. Six Distinct Roles Supported

1. **Student** (`user-student-1`, Rahul Sharma, CSE 4th Year)
   - Profile completeness & SCIC readiness index (0–100)
   - AI Resume Intelligence with multimodal Gemini 3.8 Flash
   - Skill-Gap Explorer with 4-week actionable learning roadmaps
   - Opportunities Marketplace with explainable 5-factor matching & 1-click apply
   - Real-time Application Lifecycle Tracker with interview scheduling details
   - Objective Skill Assessments Hub with automated verified badges
   - Recruiter-ready Digital Portfolio with shareable URL slug

2. **Recruiter / Industry** (`user-recruiter-1`, Microsoft India & TCS)
   - Company profile & active placement drives
   - Opportunity publishing with skill requirements
   - Candidate screening ATS pipeline with match score ranking & filters
   - Application status lifecycle updates (Review → Shortlist → Interview → Offer)
   - Campus interview scheduling & panel management

3. **Placement / CDC Administrator** (`user-cdc-1`, Prof. M. Ramana Rao, Dean Placement)
   - Campus drive calendar & visiting company schedules
   - Recruitment funnel: Applied → Eligible → Shortlisted → Interviewed → Selected
   - Verified campus placement rate calculation
   - Department-wise student readiness directory
   - One-click NAAC & NIRF compliant CSV report export

4. **Faculty & Mentors** (`user-faculty-1`, Dr. K. Venkata Rao, Professor & HOD CSE)
   - Assigned mentee cohort monitoring & academic standing
   - Student project endorsement & laboratory demonstration reviews
   - Industry-academia research & Faculty Development Program (FDP) proposals

5. **Alumni Network** (`user-alumni-1`, Priya Ananth, AWS SDE II, Class of 2022)
   - 1-on-1 career mentorship scheduling
   - Technical interview defense & mock system design sessions
   - Industry referral sharing

6. **Institutional Administrator** (`user-inst-1`, Dr. C.L.V.R.S.V. Prasad, Principal & Director)
   - Interactive Recharts analytics: Industry Demand vs Student Supply
   - Branch-wise placement rates and readiness comparisons
   - Placement salary package tiers (Super Dream, Dream, Core)

---

## 3. Explainable 5-Factor Matching Formula

SCIC calculates match percentages using a transparent, weighted formula:
$$\text{Match Score} = (0.40 \times \text{Skill Match}) + (0.25 \times \text{Semantic Alignment}) + (0.15 \times \text{Experience}) + (0.10 \times \text{Academic Eligibility}) + (0.10 \times \text{Preferences})$$

### Mandatory Eligibility Rules
Mandatory criteria are evaluated strictly and independently from the match score:
- **CGPA Cutoff**: If a drive requires $\ge 8.0$ and student has $7.8$, they are flagged as `Ineligible` regardless of technical skill score.
- **Standing Backlogs**: Verified against corporate criteria ($0$ max backlogs).
- **Branch / Department**: Allowed branch restrictions enforced (e.g. CSE/IT/ECE only).

---

## 4. AI & Gemini Integration (Server-Side)

In compliance with AI Studio and Gemini SDK architectural standards:
- All `@google/genai` calls execute **exclusively on the server side** in `server.ts`.
- Model: `gemini-3.8-flash`.
- Telemetry: `User-Agent: 'aistudio-build'` configured in `httpOptions`.
- Endpoints:
  - `POST /api/gemini/analyze-resume`: Multimodal resume text/PDF parsing with strict structured JSON schema.
  - `POST /api/gemini/skill-gap`: Role-specific 4-week roadmap generation.
  - `POST /api/gemini/interview-prep`: Targeted mock interview defense scenarios.
- Resilient Fallback: If `GEMINI_API_KEY` is not present, deterministic campus heuristics execute seamlessly without downtime.

---

## 5. Technology Stack & Verification

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Full-Stack Server**: Node.js, Express, tsx (`server.ts` with Vite middlewares in development)
- **Data Persistence**: Local Enterprise Storage (IndexedDB / LocalStorage) with reactive cross-component synchronization
- **Verification**: `npm run build` and `npm run lint` compile cleanly without TypeScript errors.
