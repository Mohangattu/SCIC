import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { calculateMatchScore } from '../../services/matcher';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, currentStudentProfile } = useAuth();
  const opportunities = db.getOpportunities().filter(o => o.status === 'active');
  const applications = db.getApplications().filter(a => a.studentId === currentUser?.id);
  const attempts = db.getAttempts(currentUser?.id);

  const profile = currentStudentProfile;
  if (!profile) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading student profile... Please ensure a student persona is selected.
      </div>
    );
  }

  // Calculate top opportunity matches
  const matchedOpportunities = opportunities
    .map(opp => ({
      opp,
      match: calculateMatchScore(profile, opp),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore)
    .slice(0, 3);

  // Group skills by category
  const skillsByCategory = (profile.skills || []).reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof profile.skills>);

  // Check upcoming interviews
  const upcomingInterview = applications.find(
    a => a.status === 'Interview' && a.interviewDetails?.date
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                GMRIT Student Portal
              </span>
              <span className="text-xs text-slate-400">Roll No: {profile.rollNumber}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {profile.fullName}!
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              {profile.department} • {profile.academicYear} • CGPA: {profile.cgpa.toFixed(2)}/10.0
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('resume-ai')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>AI Resume Analysis</span>
            </button>
            <button
              onClick={() => onNavigate('skill-gap')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Explore Skill-Gap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Interview Alert Box (if present) */}
      {upcomingInterview && upcomingInterview.interviewDetails && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white mt-0.5 sm:mt-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                  Upcoming Campus Interview
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
                  {upcomingInterview.company}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {upcomingInterview.opportunityTitle}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Date: <strong className="text-slate-900">{upcomingInterview.interviewDetails.date}</strong> at{' '}
                <strong className="text-slate-900">{upcomingInterview.interviewDetails.time}</strong> • Venue:{' '}
                {upcomingInterview.interviewDetails.meetingLinkOrVenue}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('applications')}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shrink-0 transition-colors"
          >
            View Details & Interview Prep
          </button>
        </div>
      )}

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Index */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">SCIC Readiness Score</span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{profile.readinessScore}</span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${profile.readinessScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Targeting: <strong className="text-slate-700">{profile.targetRole || 'Software Developer'}</strong>
          </p>
        </div>

        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Profile Completeness</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">88%</span>
            <span className="text-xs font-semibold text-emerald-600">Ready for Drives</span>
          </div>
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Resume & Projects Verified</span>
          </p>
          <button
            onClick={() => onNavigate('profile')}
            className="text-[11px] text-indigo-600 font-semibold mt-2 hover:underline inline-block"
          >
            Edit Profile & Credentials →
          </button>
        </div>

        {/* Active Applications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Applications</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{applications.length}</span>
            <span className="text-xs text-slate-400">Total submitted</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
            <span>In Review: {applications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length}</span>
            <span className="font-semibold text-indigo-600">Interview: {applications.filter(a => a.status === 'Interview').length}</span>
          </div>
          <button
            onClick={() => onNavigate('applications')}
            className="text-[11px] text-indigo-600 font-semibold mt-2 hover:underline inline-block"
          >
            Track Status Timeline →
          </button>
        </div>

        {/* Verified Assessments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verified Assessments</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{attempts.length}</span>
            <span className="text-xs text-emerald-600 font-medium">Badges Earned</span>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Objective tests validating core DSA & engineering skills.
          </p>
          <button
            onClick={() => onNavigate('assessments')}
            className="text-[11px] text-indigo-600 font-semibold mt-2 hover:underline inline-block"
          >
            Take New Assessment →
          </button>
        </div>
      </div>

      {/* Main Grid: Skills Matrix + Recommended Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recommended Jobs with Explainable Matching */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Explainable Match Recommendations</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Computed via 5-factor weighted algorithm based on your profile & skills
                </p>
              </div>
              <button
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All ({opportunities.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {matchedOpportunities.map(({ opp, match }) => (
                <div
                  key={opp.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{opp.title}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {opp.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                        <strong className="text-indigo-700">{opp.company}</strong>
                        <span>•</span>
                        <span>{opp.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800">{opp.stipendOrSalary}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {/* Match Score Badge */}
                      <div
                        className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                          match.overallScore >= 80
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : match.overallScore >= 60
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {match.overallScore}% Match
                      </div>

                      {/* Eligibility Pill */}
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          match.isEligible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {match.isEligible ? 'Eligible' : 'Check Criteria'}
                      </span>
                    </div>
                  </div>

                  {/* Reasons summary & required skills */}
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">Required Skills:</span>
                      {opp.requiredSkills.map(sk => {
                        const hasSkill = (profile.skills || []).some(
                          s => s.name.toLowerCase() === sk.toLowerCase()
                        );
                        return (
                          <span
                            key={sk}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              hasSkill
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {sk} {hasSkill && '✓'}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => onNavigate('opportunities')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 self-end sm:self-auto"
                    >
                      View & Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications Tracker Snippet */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>My Active Applications</span>
              </h2>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Full Tracker →
              </button>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                You haven't applied to any opportunities yet. Explore the marketplace above!
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.map(app => (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{app.opportunityTitle}</div>
                      <div className="text-xs text-slate-500">
                        {app.company} • Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          app.status === 'Selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Interview'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Skills Breakdown & Actions */}
        <div className="space-y-6">
          {/* Current Skills Matrix Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Verified Skills Matrix</span>
              </h2>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, list]) => (
                <div key={category}>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    {category} ({list.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map(s => (
                      <span
                        key={s.name}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1 border ${
                          s.verified
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{s.name}</span>
                        {s.verified && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Skill-Gap Trigger */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-xs">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Target Role Intelligence</span>
            </div>
            <h3 className="text-base font-bold mt-1">
              Want to become a {profile.targetRole || 'Full Stack Engineer'}?
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Our AI engine has compared your current GMRIT profile against tier-1 company requirements.
              Discover your critical missing skills and follow a curated 4-week learning roadmap.
            </p>
            <button
              onClick={() => onNavigate('skill-gap')}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs shadow-sm transition-colors text-center"
            >
              Generate 4-Week Skill Gap Roadmap →
            </button>
          </div>

          {/* Digital Portfolio Callout */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>Shareable Student Portfolio</span>
            </h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Your verified skills, projects, and assessments are published to a recruiter-ready web portfolio.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onNavigate('portfolio')}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-center transition-colors"
              >
                Preview Digital Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
