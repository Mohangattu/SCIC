import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  FileCode,
  Flag,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import {
  Assessment,
  AssessmentAttempt,
  CodingChallenge,
  CodingSubmission,
  QuestionDifficulty,
} from '../../types';

export const AssessmentsHub: React.FC = () => {
  const { currentStudentProfile, currentUser, refreshUserData } = useAuth();
  const { showToast } = useNotification();

  // Active Hub Tab: 'quizzes' | 'coding' | 'history'
  const [activeTab, setActiveTab] = useState<'quizzes' | 'coding' | 'history'>('quizzes');

  // Core Subject Quizzes State
  const assessments = db.getAssessments();
  const attempts = db.getAttempts(currentUser?.id);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [quizTimerSeconds, setQuizTimerSeconds] = useState<number>(0);
  const [testFinished, setTestFinished] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<AssessmentAttempt | null>(null);

  // Coding Assignments State
  const codingChallenges = db.getCodingChallenges();
  const codingSubmissions = db.getCodingSubmissions(currentUser?.id);
  const [activeChallenge, setActiveChallenge] = useState<CodingChallenge | null>(null);
  const [selectedCodingLanguage, setSelectedCodingLanguage] = useState<'javascript' | 'python'>('javascript');
  const [userCode, setUserCode] = useState<string>('');
  const [selectedCodingSubject, setSelectedCodingSubject] = useState<string>('All');
  const [testRunResults, setTestRunResults] = useState<{
    isRunning: boolean;
    hasRun: boolean;
    allPassed: boolean;
    totalCases: number;
    passedCases: number;
    details: {
      id: string;
      description?: string;
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
      isHidden?: boolean;
      executionTimeMs: number;
      error?: string;
    }[];
    consoleLogs: string[];
  } | null>(null);
  const [activeHintIdx, setActiveHintIdx] = useState<number>(-1);
  const [isCopied, setIsCopied] = useState(false);

  // Countdown timer for active assessment
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeAssessment && !testFinished && quizTimerSeconds > 0) {
      interval = setInterval(() => {
        setQuizTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeAssessment, testFinished, quizTimerSeconds]);

  // When opening a coding challenge, initialize code template
  useEffect(() => {
    if (activeChallenge) {
      setUserCode(
        selectedCodingLanguage === 'javascript'
          ? activeChallenge.starterCode.javascript
          : activeChallenge.starterCode.python
      );
      setTestRunResults(null);
      setActiveHintIdx(-1);
    }
  }, [activeChallenge, selectedCodingLanguage]);

  // Start Assessment Quiz
  const startAssessment = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTestFinished(false);
    setLastAttempt(null);
    setQuizTimerSeconds(assessment.durationMinutes * 60);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitQuiz = () => {
    if (!activeAssessment || !currentUser || !currentStudentProfile) return;

    let totalScore = 0;
    const questions = activeAssessment.questions;
    const marksPerQuestion = Math.max(1, Math.round(activeAssessment.totalMarks / questions.length));

    let easyPassed = 0;
    let easyTotal = 0;
    let mediumPassed = 0;
    let mediumTotal = 0;
    let hardPassed = 0;
    let hardTotal = 0;

    questions.forEach(q => {
      const isCorrect = selectedAnswers[q.id] === q.correctIndex;
      if (q.difficulty === 'Easy') {
        easyTotal++;
        if (isCorrect) easyPassed++;
      } else if (q.difficulty === 'Medium') {
        mediumTotal++;
        if (isCorrect) mediumPassed++;
      } else if (q.difficulty === 'Hard') {
        hardTotal++;
        if (isCorrect) hardPassed++;
      }

      if (isCorrect) {
        totalScore += marksPerQuestion;
      }
    });

    // Cap total score to totalMarks
    totalScore = Math.min(totalScore, activeAssessment.totalMarks);
    const passed = totalScore >= activeAssessment.passingMarks;

    const attempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      studentId: currentUser.id,
      assessmentId: activeAssessment.id,
      assessmentTitle: activeAssessment.title,
      skill: activeAssessment.skill,
      score: totalScore,
      totalMarks: activeAssessment.totalMarks,
      passed,
      attemptedAt: new Date().toISOString(),
      difficultyBreakdown: {
        easyPassed,
        easyTotal,
        mediumPassed,
        mediumTotal,
        hardPassed,
        hardTotal,
      },
    };

    db.saveAttempt(attempt);
    setLastAttempt(attempt);
    setTestFinished(true);

    if (passed) {
      const skills = [...currentStudentProfile.skills];
      const matchIdx = skills.findIndex(
        s => s.name.toLowerCase() === activeAssessment.skill.toLowerCase()
      );
      if (matchIdx >= 0) {
        skills[matchIdx] = {
          ...skills[matchIdx],
          verified: true,
          sourceEvidence: `Passed SCIC Campus Diagnostic: ${activeAssessment.title} (${totalScore}/${activeAssessment.totalMarks})`,
        };
      } else {
        skills.push({
          name: activeAssessment.skill,
          category: activeAssessment.category,
          proficiency: 'Advanced',
          verified: true,
          sourceEvidence: `Passed SCIC Campus Diagnostic: ${activeAssessment.title} (${totalScore}/${activeAssessment.totalMarks})`,
        });
      }

      db.saveStudentProfile({ ...currentStudentProfile, skills });
      refreshUserData();
      showToast(
        'Assessment Passed!',
        `Official skill badge "${activeAssessment.skill}" is now verified on your GMRIT profile!`,
        'success'
      );
    } else {
      showToast(
        'Assessment Completed',
        `Score: ${totalScore}/${activeAssessment.totalMarks}. Passing threshold is ${activeAssessment.passingMarks}. Review the technical rationales below and retake when prepared.`,
        'info'
      );
    }
  };

  // Run Test Cases for Coding Challenge
  const handleRunCode = () => {
    if (!activeChallenge) return;

    if (selectedCodingLanguage !== 'javascript') {
      showToast(
        'Execution Sandbox Note',
        'In-browser test runner executes JavaScript natively. For Python, verify syntax and submit for algorithmic validation.',
        'info'
      );
    }

    setTestRunResults({
      isRunning: true,
      hasRun: false,
      allPassed: false,
      totalCases: activeChallenge.testCases.length,
      passedCases: 0,
      details: [],
      consoleLogs: [],
    });

    const logs: string[] = [];
    const originalConsoleLog = console.log;

    try {
      // Create user function from code
      const interceptedLog = (...args: unknown[]) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      };

      const testResults = activeChallenge.testCases.map(tc => {
        const startTime = performance.now();
        let actualOutputStr = '';
        let passed = false;
        let executionError = '';

        try {
          const inputData = JSON.parse(tc.input);

          // We extract the function execution logic
          // Supported problem signatures:
          // palindrome: isPalindrome(s)
          // missingNumber: missingNumber(nums)
          // twoSum: twoSum(nums, target)
          // isValid: isValid(s)
          // merge: merge(intervals)
          // findSecondHighest: findSecondHighest(salaries)

          const runnerCode = `
            ${userCode}
            
            // Evaluator adapter
            if (typeof isPalindrome === 'function') {
              return isPalindrome(inputData.s);
            }
            if (typeof missingNumber === 'function') {
              return missingNumber(inputData.nums);
            }
            if (typeof twoSum === 'function') {
              return twoSum(inputData.nums, inputData.target);
            }
            if (typeof isValid === 'function') {
              return isValid(inputData.s);
            }
            if (typeof merge === 'function') {
              return merge(inputData.intervals);
            }
            if (typeof findSecondHighest === 'function') {
              return findSecondHighest(inputData.salaries);
            }
            if (typeof solve === 'function') {
              return solve(inputData);
            }
            throw new Error("Target solver function not found. Please implement the required function name.");
          `;

          // Execute with isolated function
          const fn = new Function('inputData', 'console', runnerCode);
          const result = fn(inputData, { log: interceptedLog });
          const endTime = performance.now();

          actualOutputStr = JSON.stringify(result);

          // Compare expected vs actual
          const normalizedActual = String(actualOutputStr).replace(/\s+/g, '');
          const normalizedExpected = String(tc.expectedOutput).replace(/\s+/g, '');

          // Allow array order flexibility for twoSum or direct equivalence
          passed = normalizedActual === normalizedExpected;
          if (!passed && Array.isArray(result) && tc.expectedOutput.startsWith('[')) {
            try {
              const expectedArr = JSON.parse(tc.expectedOutput);
              if (
                Array.isArray(expectedArr) &&
                result.length === expectedArr.length &&
                result.every(val => expectedArr.includes(val))
              ) {
                passed = true;
              }
            } catch {
              // fallback
            }
          }

          return {
            id: tc.id,
            description: tc.description,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: actualOutputStr,
            passed,
            isHidden: tc.isHidden,
            executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          };
        } catch (err: unknown) {
          const endTime = performance.now();
          executionError = err instanceof Error ? err.message : String(err);
          return {
            id: tc.id,
            description: tc.description,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: 'Error: ' + executionError,
            passed: false,
            isHidden: tc.isHidden,
            executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
            error: executionError,
          };
        }
      });

      const passedCount = testResults.filter(t => t.passed).length;
      const allPassed = passedCount === testResults.length;

      setTestRunResults({
        isRunning: false,
        hasRun: true,
        allPassed,
        totalCases: testResults.length,
        passedCases: passedCount,
        details: testResults,
        consoleLogs: logs,
      });

      if (allPassed) {
        showToast('All Test Cases Passed!', `${passedCount}/${testResults.length} tests succeeded! Ready to submit.`, 'success');
      } else {
        showToast(
          'Tests Completed',
          `${passedCount} of ${testResults.length} test cases passed. Inspect failure logs to debug edge cases.`,
          'info'
        );
      }
    } finally {
      console.log = originalConsoleLog;
    }
  };

  // Submit Coding Challenge
  const handleSubmitCodingAssignment = () => {
    if (!activeChallenge || !currentUser || !currentStudentProfile) return;

    if (!testRunResults || !testRunResults.hasRun) {
      showToast('Run Tests First', 'Please run tests against your solution before final submission.', 'info');
      return;
    }

    const passed = testRunResults.allPassed;
    const submission: CodingSubmission = {
      id: `sub-${Date.now()}`,
      studentId: currentUser.id,
      challengeId: activeChallenge.id,
      challengeTitle: activeChallenge.title,
      language: selectedCodingLanguage,
      code: userCode,
      passed,
      passedTestCases: testRunResults.passedCases,
      totalTestCases: testRunResults.totalCases,
      outputLog: `Completed in ${testRunResults.details.reduce((a, b) => a + b.executionTimeMs, 0).toFixed(2)}ms`,
      submittedAt: new Date().toISOString(),
    };

    db.saveCodingSubmission(submission);

    if (passed) {
      const skills = [...currentStudentProfile.skills];
      const matchIdx = skills.findIndex(
        s => s.name.toLowerCase() === activeChallenge.category.toLowerCase() ||
             s.name.toLowerCase() === 'programming' ||
             s.name.toLowerCase() === 'data structures & algorithms'
      );

      const skillName = activeChallenge.subject === 'DBMS & SQL' ? 'SQL' : 'Data Structures & Algorithms';

      const existingSkillIdx = skills.findIndex(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (existingSkillIdx >= 0) {
        skills[existingSkillIdx] = {
          ...skills[existingSkillIdx],
          verified: true,
          sourceEvidence: `Passed SCIC Coding Challenge: ${activeChallenge.title} (100% test cases verified)`,
        };
      } else {
        skills.push({
          name: skillName,
          category: activeChallenge.category,
          proficiency: 'Advanced',
          verified: true,
          sourceEvidence: `Passed SCIC Coding Challenge: ${activeChallenge.title} (100% test cases verified)`,
        });
      }

      db.saveStudentProfile({ ...currentStudentProfile, skills });
      refreshUserData();
      showToast(
        'Assignment Accepted!',
        `Excellent job! Verified skill badge "${skillName}" has been updated on your profile.`,
        'success'
      );
    } else {
      showToast(
        'Submission Recorded',
        `Solution scored ${testRunResults.passedCases}/${testRunResults.totalCases} test cases. Review hints and optimize to earn verified badges.`,
        'info'
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper formatting for timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtered lists
  const filteredAssessments = assessments.filter(a => {
    if (selectedSubjectFilter === 'All') return true;
    return a.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()) ||
           a.title.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
  });

  const filteredChallenges = codingChallenges.filter(c => {
    if (selectedCodingSubject === 'All') return true;
    return c.subject === selectedCodingSubject;
  });

  // Unique subjects
  const quizSubjects = ['All', 'Data Structures & Algorithms', 'Core Systems (OS & CN)', 'DBMS & Query Optimization', 'Core OOP & Java Design', 'Web Engineering & REST APIs'];
  const codingSubjects = ['All', 'Data Structures', 'Algorithms', 'Core CS', 'DBMS & SQL'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                GMRIT Placement & Technical Qualification Standard
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Progressive Easy ➔ Hard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineering Skill Assessment & Coding Hub
            </h1>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Standardized campus evaluation aligned with TCS NQT, Infosys, Wipro, and top product hiring rounds.
              Validate core subjects (OS, DBMS, CN, DSA, OOP) and solve hands-on coding challenges to earn verified portfolio badges.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-2xl font-black text-white">{attempts.filter(a => a.passed).length}</div>
              <div className="text-[10px] uppercase font-bold text-indigo-200">Quizzes Passed</div>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <div className="text-2xl font-black text-white">
                {codingSubmissions.filter(s => s.passed).length}
              </div>
              <div className="text-[10px] uppercase font-bold text-indigo-200">Coding Solved</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-emerald-400">
                {currentStudentProfile?.skills.filter(s => s.verified).length || 0}
              </div>
              <div className="text-[10px] uppercase font-bold text-indigo-200">Verified Badges</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('quizzes');
              setActiveAssessment(null);
              setActiveChallenge(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Core Subjects Diagnostic (MCQs: Easy ➔ Hard)</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">
              {assessments.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('coding');
              setActiveAssessment(null);
              setActiveChallenge(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'coding'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Hands-on Coding Assignments Sandbox</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
              {codingChallenges.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              setActiveAssessment(null);
              setActiveChallenge(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Verified Badges & Attempt Record</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-100 text-amber-800 font-extrabold">
              {attempts.length + codingSubmissions.length}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. CORE SUBJECTS DIAGNOSTIC QUIZZES (PROGRESSIVE EASY -> HARD) */}
      {/* ============================================================== */}
      {activeTab === 'quizzes' && (
        <div>
          {/* Active Quiz Runner */}
          {activeAssessment ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
              {/* Quiz Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {activeAssessment.subject}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Passing: {activeAssessment.passingMarks}/{activeAssessment.totalMarks} Marks
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{activeAssessment.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Countdown Timer */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      quizTimerSeconds <= 120
                        ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{formatTimer(quizTimerSeconds)}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to exit? Your progress in this attempt will be lost.')) {
                        setActiveAssessment(null);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
                    title="Exit Assessment"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {!testFinished ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Question Area (3 cols) */}
                  <div className="lg:col-span-3 space-y-5">
                    {/* Current Question Card */}
                    {activeAssessment.questions[currentQuestionIdx] && (() => {
                      const q = activeAssessment.questions[currentQuestionIdx];
                      const isFlagged = !!flaggedQuestions[q.id];
                      const selectedOption = selectedAnswers[q.id];

                      const getDifficultyBadge = (diff: QuestionDifficulty) => {
                        if (diff === 'Easy') {
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              🟢 Level 1: Easy (Foundational)
                            </span>
                          );
                        }
                        if (diff === 'Medium') {
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              🟡 Level 2: Medium (Intermediate)
                            </span>
                          );
                        }
                        return (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            🔴 Level 3: Hard (Advanced Mastery)
                          </span>
                        );
                      };

                      return (
                        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-5 shadow-2xs">
                          {/* Question Meta Bar */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">
                                Question {currentQuestionIdx + 1} of {activeAssessment.questions.length}
                              </span>
                              {getDifficultyBadge(q.difficulty)}
                              <span className="text-[11px] text-slate-500 font-medium">
                                • {q.subject}
                              </span>
                            </div>

                            <button
                              onClick={() => toggleFlagQuestion(q.id)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                                isFlagged
                                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
                            </button>
                          </div>

                          {/* Question Text */}
                          <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                            {q.question}
                          </div>

                          {/* Code Snippet if present */}
                          {q.codeSnippet && (
                            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 shadow-inner">
                              <div className="bg-slate-900 px-4 py-1.5 flex items-center justify-between border-b border-slate-800 text-[11px] text-slate-400">
                                <span className="font-mono flex items-center gap-1.5">
                                  <Terminal className="w-3 h-3 text-emerald-400" />
                                  Technical Snippet
                                </span>
                                <button
                                  onClick={() => copyToClipboard(q.codeSnippet!)}
                                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300/90 whitespace-pre">
                                {q.codeSnippet}
                              </pre>
                            </div>
                          )}

                          {/* Options */}
                          <div className="space-y-2.5 pt-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedOption === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-indigo-50 border-indigo-600 font-semibold text-indigo-950 shadow-2xs ring-1 ring-indigo-500'
                                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/80'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                        isSelected
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                  {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <button
                              disabled={currentQuestionIdx === 0}
                              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Previous</span>
                            </button>

                            <div className="text-xs text-slate-500">
                              Answered: {Object.keys(selectedAnswers).length} / {activeAssessment.questions.length}
                            </div>

                            {currentQuestionIdx < activeAssessment.questions.length - 1 ? (
                              <button
                                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>Next</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={handleSubmitQuiz}
                                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Submit & Score Test</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Question Palette Sidebar (1 col) */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>Question Palette</span>
                        <span className="text-[10px] text-slate-400 font-normal">Progressive Flow</span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                        {activeAssessment.questions.map((q, idx) => {
                          const isCurrent = currentQuestionIdx === idx;
                          const isAnswered = selectedAnswers[q.id] !== undefined;
                          const isFlagged = !!flaggedQuestions[q.id];

                          let statusClasses = 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                          if (isCurrent) {
                            statusClasses = 'ring-2 ring-indigo-600 bg-indigo-600 text-white font-bold';
                          } else if (isFlagged) {
                            statusClasses = 'bg-amber-100 border-amber-300 text-amber-900 font-bold';
                          } else if (isAnswered) {
                            statusClasses = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                          }

                          return (
                            <button
                              key={q.id}
                              onClick={() => setCurrentQuestionIdx(idx)}
                              className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer relative ${statusClasses}`}
                            >
                              <span>{idx + 1}</span>
                              {isFlagged && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                          <span>Answered ({Object.keys(selectedAnswers).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                          <span>Flagged ({Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                          <span>Unanswered ({activeAssessment.questions.length - Object.keys(selectedAnswers).length})</span>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmitQuiz}
                        className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        Finish & Submit Exam
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Results & Detailed Scorecard View */
                <div className="space-y-6 animate-in zoom-in-95 duration-200">
                  <div
                    className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden ${
                      lastAttempt?.passed
                        ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/50 border-emerald-300 text-emerald-950'
                        : 'bg-gradient-to-b from-amber-50 via-white to-amber-50/50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-white shadow-md">
                      {lastAttempt?.passed ? (
                        <Award className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                      )}
                    </div>
                    <h3 className="text-2xl font-black">
                      {lastAttempt?.passed ? 'Assessment Qualified! Badge Verified' : 'Assessment Completed — Retake Recommended'}
                    </h3>
                    <div className="text-4xl font-black mt-2 text-slate-900">
                      {lastAttempt?.score}{' '}
                      <span className="text-base font-normal text-slate-500">/ {lastAttempt?.totalMarks} Marks</span>
                    </div>

                    <p className="text-xs mt-2 max-w-lg mx-auto text-slate-600 leading-relaxed">
                      {lastAttempt?.passed
                        ? `Congratulations! You successfully cleared the passing threshold (${activeAssessment.passingMarks} marks). The "${activeAssessment.skill}" competency badge has been verified on your official GMRIT digital profile.`
                        : `Passing benchmark requires ${activeAssessment.passingMarks} marks. Study the technical rationales below and retake when prepared to earn placement verification.`}
                    </p>

                    {/* Difficulty Breakdown Bar */}
                    {lastAttempt?.difficultyBreakdown && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mt-6 pt-4 border-t border-slate-200">
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            Level 1: Easy
                          </span>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {lastAttempt.difficultyBreakdown.easyPassed} / {lastAttempt.difficultyBreakdown.easyTotal}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              (
                              {lastAttempt.difficultyBreakdown.easyTotal > 0
                                ? Math.round(
                                    (lastAttempt.difficultyBreakdown.easyPassed /
                                      lastAttempt.difficultyBreakdown.easyTotal) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            Level 2: Medium
                          </span>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {lastAttempt.difficultyBreakdown.mediumPassed} / {lastAttempt.difficultyBreakdown.mediumTotal}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              (
                              {lastAttempt.difficultyBreakdown.mediumTotal > 0
                                ? Math.round(
                                    (lastAttempt.difficultyBreakdown.mediumPassed /
                                      lastAttempt.difficultyBreakdown.mediumTotal) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                            Level 3: Hard
                          </span>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {lastAttempt.difficultyBreakdown.hardPassed} / {lastAttempt.difficultyBreakdown.hardTotal}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              (
                              {lastAttempt.difficultyBreakdown.hardTotal > 0
                                ? Math.round(
                                    (lastAttempt.difficultyBreakdown.hardPassed /
                                      lastAttempt.difficultyBreakdown.hardTotal) *
                                      100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Rationales Review */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        Comprehensive Technical Analysis & Rationales
                      </h4>
                      <span className="text-xs text-slate-400">
                        Total {activeAssessment.questions.length} Questions Reviewed
                      </span>
                    </div>

                    <div className="space-y-4">
                      {activeAssessment.questions.map((q, qidx) => {
                        const userAnswer = selectedAnswers[q.id];
                        const isCorrect = userAnswer === q.correctIndex;
                        return (
                          <div
                            key={q.id}
                            className={`p-5 rounded-2xl border text-xs space-y-3 ${
                              isCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                            }`}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                Q{qidx + 1}. {q.question}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                  isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            </div>

                            {q.codeSnippet && (
                              <pre className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                                {q.codeSnippet}
                              </pre>
                            )}

                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-medium">Your answer:</span>
                                <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                                  {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                                </span>
                              </div>

                              {!isCorrect && (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 font-medium">Correct answer:</span>
                                  <span className="text-emerald-800 font-bold">
                                    {q.options[q.correctIndex]}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                                Industry / Architectural Rationale
                              </span>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{q.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => startAssessment(activeAssessment)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Diagnostic</span>
                    </button>
                    <button
                      onClick={() => setActiveAssessment(null)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                    >
                      Return to Assessment Catalog
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Catalog of Core Subject Quizzes */
            <div className="space-y-5">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Filter Subject:
                </span>
                {quizSubjects.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubjectFilter(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSubjectFilter === sub
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Assessment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAssessments.map(ass => {
                  const pastAttempts = attempts.filter(a => a.assessmentId === ass.id);
                  const highestAttempt = pastAttempts.reduce<AssessmentAttempt | null>(
                    (max, cur) => (!max || cur.score > max.score ? cur : max),
                    null
                  );

                  return (
                    <div
                      key={ass.id}
                      className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                            {ass.subject}
                          </span>
                          {highestAttempt && (
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                highestAttempt.passed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {highestAttempt.passed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              Score: {highestAttempt.score}/{highestAttempt.totalMarks}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{ass.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ass.description}</p>
                        </div>

                        {/* Question difficulty distribution tag */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Easy: {ass.questions.filter(q => q.difficulty === 'Easy').length}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Medium: {ass.questions.filter(q => q.difficulty === 'Medium').length}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            Hard: {ass.questions.filter(q => q.difficulty === 'Hard').length}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {ass.durationMinutes} mins
                          </span>
                          <span>•</span>
                          <span>{ass.questions.length} Questions</span>
                          <span>•</span>
                          <span>Pass: {ass.passingMarks} M</span>
                        </div>

                        <button
                          onClick={() => startAssessment(ass)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{highestAttempt ? 'Retake Exam' : 'Start Diagnostic'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HANDS-ON CODING ASSIGNMENTS SANDBOX                         */}
      {/* ============================================================== */}
      {activeTab === 'coding' && (
        <div>
          {activeChallenge ? (
            /* Interactive Code Editor & Sandbox Workspace */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
              {/* Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      {activeChallenge.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeChallenge.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeChallenge.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {activeChallenge.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">
                      • Time limit: {activeChallenge.timeLimitMinutes} mins
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{activeChallenge.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Challenges</span>
                  </button>
                </div>
              </div>

              {/* Two-Column Editor Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Problem Description & Test Cases (5 cols) */}
                <div className="lg:col-span-5 space-y-5 overflow-y-auto max-h-[750px] pr-1">
                  {/* Problem Description */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Problem Statement
                    </div>
                    <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-normal">
                      {activeChallenge.description}
                    </div>

                    {/* Constraints */}
                    {activeChallenge.constraints.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Constraints & Boundaries
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          {activeChallenge.constraints.map((c, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {c}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Sample Test Examples
                    </span>
                    {activeChallenge.examples.map((ex, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5 font-mono shadow-2xs">
                        <div className="text-slate-500 font-sans font-bold text-[11px]">
                          Example {idx + 1}:
                        </div>
                        <div className="text-slate-800">
                          <strong className="text-slate-400 font-normal font-sans">Input: </strong>
                          <span className="bg-slate-100 px-1 rounded">{ex.input}</span>
                        </div>
                        <div className="text-emerald-700 font-bold">
                          <strong className="text-slate-400 font-normal font-sans">Output: </strong>
                          <span className="bg-emerald-50 px-1 rounded border border-emerald-200">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-[11px] text-slate-500 font-sans italic pt-1">
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progressive Hints */}
                  {activeChallenge.hints.length > 0 && (
                    <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Algorithmic Hints
                        </span>
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          {activeChallenge.hints.length} available
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeChallenge.hints.map((hint, hidx) => {
                          const isOpen = activeHintIdx === hidx;
                          return (
                            <div key={hidx} className="border border-indigo-200/60 rounded-lg overflow-hidden bg-white">
                              <button
                                onClick={() => setActiveHintIdx(isOpen ? -1 : hidx)}
                                className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                              >
                                <span>Hint {hidx + 1}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isOpen && (
                                <div className="px-3 pb-3 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                                  {hint}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Code Editor & Execution Runner (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Editor Top Bar */}
                  <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-t-2xl border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">Code Sandbox</span>

                      {/* Language Selector */}
                      <div className="ml-3 flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                        <button
                          onClick={() => setSelectedCodingLanguage('javascript')}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            selectedCodingLanguage === 'javascript'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          JavaScript (Live Sandbox)
                        </button>
                        <button
                          onClick={() => setSelectedCodingLanguage('python')}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                            selectedCodingLanguage === 'python'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Python 3
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (window.confirm('Reset code to starter template?')) {
                            setUserCode(
                              selectedCodingLanguage === 'javascript'
                                ? activeChallenge.starterCode.javascript
                                : activeChallenge.starterCode.python
                            );
                          }
                        }}
                        className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(userCode)}
                        className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Area */}
                  <div className="relative border-x border-b border-slate-800 rounded-b-2xl overflow-hidden bg-slate-950">
                    <textarea
                      value={userCode}
                      onChange={e => setUserCode(e.target.value)}
                      spellCheck={false}
                      className="w-full h-[320px] p-4 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                      placeholder="// Implement your algorithm solution here..."
                    />
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Total Test Cases: {activeChallenge.testCases.length} (including edge cases)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunCode}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        <span>Run Test Cases</span>
                      </button>
                      <button
                        onClick={handleSubmitCodingAssignment}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Assignment</span>
                      </button>
                    </div>
                  </div>

                  {/* Test Execution Console Output */}
                  {testRunResults && (
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-slate-200">Execution Console</span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            testRunResults.allPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {testRunResults.passedCases} / {testRunResults.totalCases} Passed
                        </span>
                      </div>

                      {/* Cases List */}
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {testRunResults.details.map((tc, idx) => (
                          <div
                            key={tc.id}
                            className={`p-3 rounded-xl border font-mono text-xs space-y-1.5 ${
                              tc.passed
                                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                                : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold flex items-center gap-1.5">
                                {tc.passed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                )}
                                Case {idx + 1} {tc.description ? `(${tc.description})` : ''}
                                {tc.isHidden && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                                    Hidden Edge Case
                                  </span>
                                )}
                              </span>
                              <span className="text-slate-400 text-[10px]">{tc.executionTimeMs}ms</span>
                            </div>

                            <div className="text-[11px] text-slate-300">
                              Input: <span className="text-slate-400">{tc.input}</span>
                            </div>
                            <div className="text-[11px]">
                              Expected: <span className="text-emerald-400">{tc.expectedOutput}</span>
                            </div>
                            <div className="text-[11px]">
                              Actual: <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{tc.actualOutput}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {testRunResults.consoleLogs.length > 0 && (
                        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500">stdout logs:</span>
                          <pre className="font-mono text-slate-300 whitespace-pre-wrap">
                            {testRunResults.consoleLogs.join('\n')}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Catalog of Coding Assignments */
            <div className="space-y-5">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Subject Category:
                </span>
                {codingSubjects.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedCodingSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCodingSubject === sub
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Coding Challenges Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredChallenges.map(ch => {
                  const pastSubmissions = codingSubmissions.filter(s => s.challengeId === ch.id);
                  const isSolved = pastSubmissions.some(s => s.passed);

                  return (
                    <div
                      key={ch.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {ch.subject}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ch.difficulty === 'Easy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ch.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ch.difficulty}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">{ch.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                            {ch.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ch.timeLimitMinutes} mins</span>
                          <span>•</span>
                          <span>{ch.testCases.length} Test Cases</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        {isSolved ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Solved</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {pastSubmissions.length > 0 ? `${pastSubmissions.length} Attempts` : 'Unattempted'}
                          </span>
                        )}

                        <button
                          onClick={() => setActiveChallenge(ch)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          <span>{isSolved ? 'Review & Code' : 'Open Challenge'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. VERIFIED BADGES & COMPLETE ATTEMPT RECORD                   */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Verified Badges on Student Profile (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Technical Competencies on Profile ({currentStudentProfile?.skills.filter(s => s.verified).length || 0})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentStudentProfile?.skills
                .filter(s => s.verified)
                .map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 shadow-2xs space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {skill.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{skill.name}</h3>

                    <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-emerald-100">
                      {skill.sourceEvidence || 'Verified via GMRIT SCIC Technical Evaluation Benchmark'}
                    </p>
                  </div>
                ))}
            </div>

            {(!currentStudentProfile?.skills ||
              currentStudentProfile.skills.filter(s => s.verified).length === 0) && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No Verified Badges Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Take the diagnostic assessments in Core Subjects or solve coding assignments to automatically verify skills on your digital portfolio.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Complete Attempt History */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Diagnostic Logs & Coding Submissions
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 max-h-[600px] overflow-y-auto">
              {attempts.length === 0 && codingSubmissions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No activity logs recorded yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {/* Quizzes attempts */}
                  {attempts.map(att => (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{att.assessmentTitle}</div>
                        <span className="text-[10px] text-slate-400">
                          Diagnostic Exam • {new Date(att.attemptedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            att.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {att.score}/{att.totalMarks} M
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Coding submissions */}
                  {codingSubmissions.map(sub => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{sub.challengeTitle}</div>
                        <span className="text-[10px] text-slate-400">
                          Coding Assignment ({sub.language}) • {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            sub.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.passedTestCases}/{sub.totalTestCases} Tests
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
