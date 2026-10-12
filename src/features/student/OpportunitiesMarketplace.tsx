import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  HelpCircle,
  MapPin,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { calculateMatchScore } from '../../services/matcher';
import { Application, MatchResult, Opportunity, OpportunityType } from '../../types';

export const OpportunitiesMarketplace: React.FC = () => {
  const { currentStudentProfile, currentUser } = useAuth();
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'openings'>('match');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchResult | null>(null);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const opportunities = db.getOpportunities().filter(o => o.status === 'active');
  const existingApplications = db
    .getApplications()
    .filter(a => a.studentId === currentUser?.id);

  const profile = currentStudentProfile;

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter(opp => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.requiredSkills.some(s => s.toLowerCase().includes(q)) ||
        opp.description.toLowerCase().includes(q);

      const matchesType = selectedType === 'All' || opp.type === selectedType;

      const matchesDept =
        selectedDepartment === 'All' ||
        opp.allowedDepartments.includes('All') ||
        opp.allowedDepartments.some(d => d.toLowerCase() === selectedDepartment.toLowerCase());

      return matchesSearch && matchesType && matchesDept;
    })
    .map(opp => {
      const match = profile ? calculateMatchScore(profile, opp) : null;
      const isAlreadyApplied = existingApplications.some(a => a.opportunityId === opp.id);
      return { opp, match, isAlreadyApplied };
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = a.match ? a.match.overallScore : 0;
        const scoreB = b.match ? b.match.overallScore : 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'deadline') {
        return new Date(a.opp.deadline).getTime() - new Date(b.opp.deadline).getTime();
      }
      return b.opp.openings - a.opp.openings;
    });

  const handleOpenExplain = (opp: Opportunity) => {
    if (!profile) return;
    const match = calculateMatchScore(profile, opp);
    setSelectedOpportunity(opp);
    setMatchDetails(match);
    setShowExplainModal(true);
  };

  const handleApply = (opp: Opportunity, match: MatchResult | null) => {
    if (!profile || !currentUser) {
      showToast('Error', 'Please log in as a student to apply.', 'error');
      return;
    }

    if (!match || !match.isEligible) {
      showToast(
        'Eligibility Criteria Unmet',
        match?.eligibilityIssues[0] || 'You do not meet the minimum criteria for this drive.',
        'error'
      );
      return;
    }

    // Check duplicate
    const isDup = existingApplications.some(a => a.opportunityId === opp.id);
    if (isDup) {
      showToast('Already Applied', 'You have already submitted an application for this drive.', 'warning');
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        studentId: currentUser.id,
        studentName: profile.fullName,
        studentEmail: profile.email,
        studentDepartment: profile.department,
        studentCgpa: profile.cgpa,
        studentRollNumber: profile.rollNumber,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        company: opp.company,
        appliedDate: new Date().toISOString(),
        status: 'Applied',
        statusHistory: [
          {
            status: 'Applied',
            timestamp: new Date().toISOString(),
            note: 'Application successfully registered through SCIC Campus Portal.',
          },
        ],
        matchScore: match.overallScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
      };

      db.saveApplication(newApp);

      // Notify recruiter
      db.addNotification({
        id: `notif-${Date.now()}`,
        userId: opp.recruiterId,
        title: `New Candidate: ${profile.fullName}`,
        message: `${profile.fullName} (${profile.department}, CGPA ${profile.cgpa.toFixed(2)}) applied for ${opp.title} with a ${match.overallScore}% match score.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Notify student
      db.addNotification({
        id: `notif-st-${Date.now()}`,
        userId: currentUser.id,
        title: `Applied to ${opp.company}`,
        message: `Your application for ${opp.title} was submitted. Track status under Application Tracker.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
      });

      setIsApplying(false);
      showToast('Application Submitted!', `Successfully applied for ${opp.title} at ${opp.company}.`, 'success');
    }, 400);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Opportunities Marketplace</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Campus & Industry Drives
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse active full-time campus placements, summer internships, and industry capstone projects with explainable matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
          >
            <option value="match">Match Score (Highest First)</option>
            <option value="deadline">Application Deadline (Urgent First)</option>
            <option value="openings">Available Openings</option>
          </select>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role title, company, or required skill (e.g. React, Java, Microsoft)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Summer Internship">Summer Internship</option>
            <option value="Industry Project">Industry Project</option>
          </select>

          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="AIDS">AI & Data Science</option>
            <option value="MECH">Mechanical</option>
            <option value="EEE">EEE</option>
          </select>
        </div>
      </div>

      {/* Opportunity Grid */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No opportunities matched your search criteria. Try removing filters.
          </div>
        ) : (
          filteredOpportunities.map(({ opp, match, isAlreadyApplied }) => (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 p-5 shadow-2xs transition-all hover:shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-900">{opp.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {opp.type}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {opp.workArrangement}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{opp.company}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.location}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-900">{opp.stipendOrSalary}</span>
                    <span>•</span>
                    <span className="text-slate-500">Openings: {opp.openings}</span>
                  </div>
                </div>

                {/* Score & Eligibility Pills */}
                {match && (
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => handleOpenExplain(opp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-transform hover:scale-105 ${
                        match.overallScore >= 80
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : match.overallScore >= 60
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                      title="Click to view full 5-factor mathematical score breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match.overallScore}% Match</span>
                    </button>

                    <span
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold ${
                        match.isEligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {match.isEligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {opp.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-semibold mr-1">Required Skills:</span>
                {opp.requiredSkills.map(sk => {
                  const hasSkill = (profile?.skills || []).some(
                    s => s.name.toLowerCase() === sk.toLowerCase()
                  );
                  return (
                    <span
                      key={sk}
                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border ${
                        hasSkill
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {sk} {hasSkill && '✓'}
                    </span>
                  );
                })}
              </div>

              {/* Bottom Criteria & Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span>Min CGPA: <strong className="text-slate-800">{opp.minCgpa.toFixed(1)}</strong></span>
                  <span>•</span>
                  <span>Max Backlogs: <strong className="text-slate-800">{opp.maxBacklogsAllowed}</strong></span>
                  <span>•</span>
                  <span>Deadline: <strong className="text-slate-800">{new Date(opp.deadline).toLocaleDateString()}</strong></span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleOpenExplain(opp)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Explain Score
                  </button>

                  {isAlreadyApplied ? (
                    <span className="px-4 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(opp, match)}
                      disabled={isApplying || (match ? !match.isEligible : false)}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs shadow-2xs transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Explain Match Score & Eligibility Details */}
      {showExplainModal && selectedOpportunity && matchDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Explainable Match Breakdown
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedOpportunity.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpportunity.company}</p>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Score Pill */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Overall Composite Match</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-indigo-600">
                    {matchDetails.overallScore}%
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      matchDetails.isEligible
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {matchDetails.isEligible ? 'Mandatory Criteria Met' : 'Ineligible'}
                  </span>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500 max-w-xs">
                {matchDetails.recommendation}
              </div>
            </div>

            {/* Eligibility Issues Alert (if any) */}
            {!matchDetails.isEligible && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Mandatory Eligibility Notice:</span>
                </span>
                {matchDetails.eligibilityIssues.map((issue, idx) => (
                  <p key={idx} className="pl-5 text-[11px]">{issue}</p>
                ))}
              </div>
            )}

            {/* 5-Factor Weighted Mathematical Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Configurable 5-Factor Mathematical Model
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>1. Direct Skill Match (Weight: 40%)</span>
                    <span>{matchDetails.skillMatchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${matchDetails.skillMatchScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>2. Semantic & Category Alignment (Weight: 25%)</span>
                    <span>{matchDetails.semanticScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${matchDetails.semanticScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>3. Relevant Project / Internship Experience (Weight: 15%)</span>
                    <span>{matchDetails.experienceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${matchDetails.experienceScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>4. Academic Standing & CGPA (Weight: 10%)</span>
                    <span>{matchDetails.eligibilityScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${matchDetails.eligibilityScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>5. Student Preferences & Role Alignment (Weight: 10%)</span>
                    <span>{matchDetails.preferencesScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${matchDetails.preferencesScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skills list */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">
                  Matched Skills ({matchDetails.matchedSkills.length}):
                </span>
                <p className="text-[11px] text-slate-700">
                  {matchDetails.matchedSkills.join(', ') || 'None'}
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-800 block mb-1">
                  Missing Skills ({matchDetails.missingSkills.length}):
                </span>
                <p className="text-[11px] text-slate-700">
                  {matchDetails.missingSkills.join(', ') || 'None! All matched.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
