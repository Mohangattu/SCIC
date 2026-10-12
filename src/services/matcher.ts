import { MatchResult, Opportunity, StudentProfile } from '../types';
import { normalizeSkill } from './taxonomy';

export interface MatchingWeights {
  skillWeight: number; // default 0.40
  semanticWeight: number; // default 0.25
  experienceWeight: number; // default 0.15
  eligibilityWeight: number; // default 0.10
  preferencesWeight: number; // default 0.10
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  skillWeight: 0.40,
  semanticWeight: 0.25,
  experienceWeight: 0.15,
  eligibilityWeight: 0.10,
  preferencesWeight: 0.10,
};

/**
 * Calculates an explainable match score between a StudentProfile and an Opportunity.
 * Evaluates mandatory eligibility criteria separately and outputs clear justifications.
 */
export function calculateMatchScore(
  student: StudentProfile,
  opportunity: Opportunity,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchResult {
  const eligibilityIssues: string[] = [];
  const reasons: string[] = [];

  // --- 1. MANDATORY ELIGIBILITY CHECKS ---
  let isEligible = true;

  // CGPA Check
  if (opportunity.minCgpa > 0 && student.cgpa < opportunity.minCgpa) {
    isEligible = false;
    eligibilityIssues.push(
      `CGPA Cutoff: Requires minimum ${opportunity.minCgpa.toFixed(2)}, current student CGPA is ${student.cgpa.toFixed(2)}.`
    );
  }

  // Standing Backlogs Check
  if (student.standingBacklogs > opportunity.maxBacklogsAllowed) {
    isEligible = false;
    eligibilityIssues.push(
      `Backlogs: Company permits maximum ${opportunity.maxBacklogsAllowed} active backlogs. Student has ${student.standingBacklogs}.`
    );
  }

  // Department / Branch Check
  const allowed = opportunity.allowedDepartments || ['All'];
  const matchesBranch =
    allowed.includes('All') ||
    allowed.some(d => d.toLowerCase() === student.department.toLowerCase()) ||
    allowed.some(d => student.department.toLowerCase().includes(d.toLowerCase()));

  if (!matchesBranch) {
    isEligible = false;
    eligibilityIssues.push(
      `Branch Criteria: Open for [${allowed.join(', ')}]. Student is in ${student.department}.`
    );
  }

  // --- 2. SKILL MATCH (40%) ---
  const studentSkillNames = (student.skills || []).map(s => normalizeSkill(s.name).canonical.toLowerCase());
  const requiredSkills = opportunity.requiredSkills.map(s => normalizeSkill(s).canonical);
  const preferredSkills = (opportunity.preferredSkills || []).map(s => normalizeSkill(s).canonical);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const partiallyMatchedSkills: string[] = [];

  for (const req of requiredSkills) {
    const reqLower = req.toLowerCase();
    const hasExact = studentSkillNames.includes(reqLower);
    const hasPartial = !hasExact && studentSkillNames.some(s => s.includes(reqLower) || reqLower.includes(s));

    if (hasExact) {
      matchedSkills.push(req);
    } else if (hasPartial) {
      partiallyMatchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  // Check preferred skills for bonus
  let preferredMatchedCount = 0;
  for (const pref of preferredSkills) {
    const prefLower = pref.toLowerCase();
    if (studentSkillNames.includes(prefLower)) {
      preferredMatchedCount++;
    }
  }

  const totalRequired = Math.max(requiredSkills.length, 1);
  const rawSkillScore =
    (matchedSkills.length * 1.0 + partiallyMatchedSkills.length * 0.5) / totalRequired;
  // Factor in bonus for preferred skills up to 10% extra
  const preferredBonus = preferredSkills.length > 0 ? (preferredMatchedCount / preferredSkills.length) * 0.1 : 0;
  const skillMatchScore = Math.min(100, Math.round((rawSkillScore + preferredBonus) * 100));

  if (matchedSkills.length > 0) {
    reasons.push(`Matched ${matchedSkills.length}/${requiredSkills.length} required technical skills (${matchedSkills.slice(0, 3).join(', ')}).`);
  }
  if (missingSkills.length > 0) {
    reasons.push(`Missing ${missingSkills.length} core requirements: ${missingSkills.join(', ')}.`);
  }

  // --- 3. SEMANTIC / TAXONOMY ALIGNMENT (25%) ---
  // Evaluates skill categories balance and technology domain overlap
  const studentCategories = new Set((student.skills || []).map(s => s.category));
  let semanticMatches = 0;
  let totalEvaluated = 0;

  for (const req of requiredSkills) {
    const { category } = normalizeSkill(req);
    totalEvaluated++;
    if (studentCategories.has(category)) {
      semanticMatches++;
    }
  }
  const semanticRatio = totalEvaluated > 0 ? semanticMatches / totalEvaluated : 0.8;
  const semanticScore = Math.round(semanticRatio * 100);

  // --- 4. RELEVANT EXPERIENCE & PROJECTS (15%) ---
  // Evaluates whether student has demonstrated internships or projects matching job technologies
  let experienceScore = 50; // base score
  const studentProjects = student.projects || [];
  const studentExperience = student.experience || [];

  if (studentProjects.length >= 2) experienceScore += 20;
  else if (studentProjects.length === 1) experienceScore += 10;

  if (studentExperience.length >= 1) experienceScore += 25;

  // Project keyword overlap
  const projectTech = studentProjects.flatMap(p => (p.technologies || []).map(t => t.toLowerCase()));
  const overlap = requiredSkills.filter(r => projectTech.some(pt => pt.includes(r.toLowerCase())));
  if (overlap.length > 0) {
    experienceScore += 15;
    reasons.push(`Verified ${overlap.length} required skills demonstrated in student campus projects.`);
  }
  experienceScore = Math.min(100, Math.max(0, experienceScore));

  // --- 5. EDUCATION & ELIGIBILITY SCORE (10%) ---
  let eligibilityScore = 60;
  if (student.cgpa >= 8.5) eligibilityScore = 100;
  else if (student.cgpa >= 8.0) eligibilityScore = 90;
  else if (student.cgpa >= 7.5) eligibilityScore = 80;
  else if (student.cgpa >= 7.0) eligibilityScore = 70;

  if (student.standingBacklogs === 0) eligibilityScore += 10;
  eligibilityScore = Math.min(100, eligibilityScore);

  // --- 6. PREFERENCES SCORE (10%) ---
  let preferencesScore = 70;
  if (student.targetRole && opportunity.title.toLowerCase().includes(student.targetRole.toLowerCase())) {
    preferencesScore += 20;
    reasons.push(`Role aligns directly with student career objective (${student.targetRole}).`);
  }
  if (
    student.preferredLocation &&
    (opportunity.location.toLowerCase().includes(student.preferredLocation.toLowerCase()) ||
      opportunity.workArrangement === 'Remote')
  ) {
    preferencesScore += 10;
  }
  preferencesScore = Math.min(100, preferencesScore);

  // --- WEIGHTED SUM ---
  const weightedTotal =
    skillMatchScore * weights.skillWeight +
    semanticScore * weights.semanticWeight +
    experienceScore * weights.experienceWeight +
    eligibilityScore * weights.eligibilityWeight +
    preferencesScore * weights.preferencesWeight;

  const overallScore = Math.round(weightedTotal);

  // Recommendations
  let recommendation = '';
  if (!isEligible) {
    recommendation = `Not currently eligible due to mandatory requirements (${eligibilityIssues[0]}). Contact CDC placement cell if eligible for exemption.`;
  } else if (overallScore >= 80) {
    recommendation = 'Strong Match! High probability of shortlisting. Review technical interview topics and submit application promptly.';
  } else if (overallScore >= 60) {
    recommendation = 'Good Candidate Profile. Complete missing skills in learning roadmap to boost shortlisting odds.';
  } else {
    recommendation = 'Moderate Match. Recommended to complete prerequisite projects before applying.';
  }

  return {
    overallScore,
    skillMatchScore,
    semanticScore,
    experienceScore,
    eligibilityScore,
    preferencesScore,
    isEligible,
    eligibilityIssues,
    matchedSkills,
    partiallyMatchedSkills,
    missingSkills,
    reasons,
    recommendation,
  };
}
