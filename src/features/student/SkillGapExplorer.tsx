import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { geminiApi, InterviewPrepResult, SkillGapAnalysisResult } from '../../services/gemini';
import { StudentLearningProgress } from '../../types';

const POPULAR_TARGET_ROLES = [
  'Full Stack Developer',
  'Cloud DevOps Engineer',
  'Data Engineer / AI Specialist',
  'Embedded & IoT Engineer',
  'Cybersecurity Analyst',
  'Mobile Application Engineer',
];

export const SkillGapExplorer: React.FC = () => {
  const { currentStudentProfile } = useAuth();
  const { showToast } = useNotification();

  const [selectedRole, setSelectedRole] = useState(
    currentStudentProfile?.targetRole || 'Full Stack Developer'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [gapData, setGapData] = useState<SkillGapAnalysisResult | null>(null);
  const [learningProgress, setLearningProgress] = useState<StudentLearningProgress[]>([]);
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrepResult | null>(null);
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);

  const studentSkills = currentStudentProfile?.skills || [];

  const loadProgress = () => {
    if (currentStudentProfile) {
      setLearningProgress(db.getLearningProgress(currentStudentProfile.userId));
    }
  };

  const runSkillGapAnalysis = async (role: string) => {
    setIsLoading(true);
    setInterviewPrep(null);
    try {
      const result = await geminiApi.getSkillGapAnalysis({
        studentSkills,
        targetRole: role,
        department: currentStudentProfile?.department,
      });
      setGapData(result);
    } catch (err: any) {
      showToast('Error', 'Failed to generate skill gap roadmap', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSkillGapAnalysis(selectedRole);
    loadProgress();
  }, [selectedRole, currentStudentProfile?.userId]);

  const toggleTaskStatus = (taskTitle: string, skillName: string) => {
    if (!currentStudentProfile) return;
    const existing = learningProgress.find(l => l.resourceTitle === taskTitle);
    const newStatus: 'Planned' | 'In Progress' | 'Completed' =
      !existing || existing.status === 'Planned'
        ? 'In Progress'
        : existing.status === 'In Progress'
        ? 'Completed'
        : 'Planned';

    const item: StudentLearningProgress = {
      id: existing ? existing.id : `lp-${Date.now()}-${Math.random()}`,
      studentId: currentStudentProfile.userId,
      resourceId: `task-${Date.now()}`,
      resourceTitle: taskTitle,
      skillName: skillName || selectedRole,
      status: newStatus,
      startedAt: existing?.startedAt || new Date().toISOString(),
      completedAt: newStatus === 'Completed' ? new Date().toISOString() : undefined,
    };

    db.saveLearningProgress(item);
    loadProgress();
    showToast('Progress Updated', `Task marked as ${newStatus}`, 'info');
  };

  const handleGenerateInterviewPrep = async () => {
    if (!gapData) return;
    setIsLoadingInterview(true);
    try {
      const prep = await geminiApi.getInterviewPrep({
        jobTitle: selectedRole,
        company: 'Campus Placement Tier-1 Recruiters',
        studentSkills: gapData.matchedSkills,
        missingSkills: gapData.missingSkills.map(m => m.name),
      });
      setInterviewPrep(prep);
      showToast('Mock Questions Generated', 'AI Mock Interview defense questions ready below.', 'success');
    } catch (e) {
      showToast('Error', 'Failed to generate interview questions', 'error');
    } finally {
      setIsLoadingInterview(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Skill-Gap Intelligence Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Taxonomy Aligned
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic mapping against industry hiring baselines with AI personalized roadmap generation.
          </p>
        </div>

        {/* Role Selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 shrink-0">Target Career:</span>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
          >
            {POPULAR_TARGET_ROLES.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">
            Analyzing Skill Requirements for {selectedRole}...
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Cross-referencing your GMRIT profile skills with industry standards...
          </p>
        </div>
      ) : gapData ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Metric Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Role Readiness Match
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-indigo-600">
                  {gapData.readinessScore}%
                </span>
                <span className="text-xs text-slate-400">Baseline fit</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${gapData.readinessScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Verified Matched Skills
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-emerald-600">
                  {gapData.matchedSkills.length}
                </span>
                <span className="text-xs text-slate-400">Validated in profile</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {gapData.matchedSkills.join(', ') || 'None yet'}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Critical Missing Skills
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-rose-600">
                  {gapData.missingSkills.length}
                </span>
                <span className="text-xs text-slate-400">Recommended for drives</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {gapData.missingSkills.map(m => m.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Breakdown: Matched vs Missing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Skills You Possess ({gapData.matchedSkills.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {gapData.matchedSkills.map(sk => (
                  <span
                    key={sk}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>

              {gapData.partiallyMatchedSkills && gapData.partiallyMatchedSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-amber-700 block mb-2">
                    Partially Matched / Conceptual Foundations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {gapData.partiallyMatchedSkills.map(pm => (
                      <span
                        key={pm}
                        className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium"
                      >
                        {pm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Critical Skill Gaps to Bridge ({gapData.missingSkills.length})</span>
              </h3>
              <div className="space-y-2.5">
                {gapData.missingSkills.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-rose-50/50 border border-rose-200 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{m.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-800">
                        {m.priority} Priority
                      </span>
                    </div>
                    {m.reason && (
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{m.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Week Actionable Learning Roadmap */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>4-Week Actionable Learning Roadmap</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Follow step-by-step tasks and mark deliverables as complete to improve readiness.
                </p>
              </div>
              <button
                onClick={handleGenerateInterviewPrep}
                disabled={isLoadingInterview}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors shadow-2xs"
              >
                {isLoadingInterview ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                <span>Generate Mock Interview Questions</span>
              </button>
            </div>

            <div className="space-y-6">
              {gapData.learningRoadmap?.map(item => (
                <div key={item.week} className="border border-slate-200 rounded-xl p-5 bg-slate-50/40">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      W{item.week}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.focus}</h4>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2 mt-3">
                    <span className="text-xs font-semibold text-slate-700 block">Required Learning Tasks:</span>
                    {item.tasks.map((task, tidx) => {
                      const prog = learningProgress.find(l => l.resourceTitle === task);
                      const isDone = prog?.status === 'Completed';
                      const isInProgress = prog?.status === 'In Progress';
                      return (
                        <div
                          key={tidx}
                          onClick={() => toggleTaskStatus(task, item.focus)}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}}
                            className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="flex-1 text-xs">
                            <span className={isDone ? 'line-through text-slate-400 font-medium' : 'text-slate-800'}>
                              {task}
                            </span>
                            {isInProgress && (
                              <span className="ml-2 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">
                                In Progress
                              </span>
                            )}
                            {isDone && (
                              <span className="ml-2 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommended Resources */}
                  {item.recommendedResources && item.recommendedResources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-slate-600">Curated Resources:</span>
                      {item.recommendedResources.map((res, ridx) => (
                        <a
                          key={ridx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{res.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Deliverable */}
                  <div className="mt-3 text-xs bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100 text-indigo-950 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      <strong>Milestone Deliverable:</strong> {item.deliverable}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Interview Prep Box (if requested) */}
          {interviewPrep && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Technical Interview Defense for {interviewPrep.role}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Anticipated interview scenarios generated specifically by testing your matched vs missing skill areas.
              </p>

              <div className="space-y-4 mt-4">
                {interviewPrep.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-1">
                      <span>{q.category}</span>
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                        Framework: {q.recommendedFramework}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white mt-1">{q.question}</h5>
                    <p className="text-xs text-slate-300 mt-2 italic">Why asked: {q.rationale}</p>
                    <div className="mt-3 text-xs">
                      <span className="font-semibold text-emerald-400 block mb-1">Key Talking Points:</span>
                      <ul className="space-y-1 text-slate-300">
                        {q.keyPoints.map((kp, kidx) => (
                          <li key={kidx} className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
