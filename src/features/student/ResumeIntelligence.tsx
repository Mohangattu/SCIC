import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle,
  CheckCircle2,
  FileCheck,
  FileText,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UploadCloud,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { geminiApi, ResumeAnalysisResult } from '../../services/gemini';
import { normalizeSkillList } from '../../services/taxonomy';

const SAMPLE_GMRIT_RESUME_TEXT = `
RAHUL SHARMA
Email: rahul.21cse045@gmrit.edu.in | Phone: +91 98480 22334
Department of Computer Science and Engineering
GMR Institute of Technology (GMRIT), Rajam, Andhra Pradesh
Degree: B.Tech in Computer Science & Engineering (2021 – 2025)
CGPA: 8.45 / 10.0 | Backlogs: 0

CAREER OBJECTIVE
Enthusiastic and solution-oriented engineering student with strong computer science fundamentals, full-stack web application development experience, and algorithmic problem-solving abilities. Seeking an entry-level Software Development Engineer role in a forward-thinking technology company.

TECHNICAL SKILLS
- Programming Languages: JavaScript (ES6+), TypeScript, Python 3, Java (Core & OOP), C++
- Web & Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Redux Toolkit
- Backend & APIs: Node.js, Express.js, RESTful APIs, JSON Web Tokens (JWT)
- Databases: PostgreSQL, MySQL, MongoDB, Redis caching fundamentals
- Tools & Cloud: Git, GitHub, Docker (basic containerization), Postman, Linux (Ubuntu/Bash)
- CS Fundamentals: Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, Database Management Systems (DBMS)

ACADEMIC PROJECTS
1. Smart Campus Event Hub (Full-Stack Web App)
   - Architected a centralized event booking portal for GMRIT campus clubs using React, Node.js, and PostgreSQL.
   - Built QR-code verification check-ins and seat reservation pipelines handling concurrent student logins.
   - Deployed on cloud platform with automated database migrations.
2. Agricultural Leaf Disease Detection using Deep Learning
   - Built convolutional neural network (CNN) model using Python, TensorFlow, and OpenCV to classify tomato leaf diseases with 93.4% accuracy.
   - Created lightweight REST API using Flask to return inference results in under 200ms.
3. Student Skill Assessment Engine
   - Implemented an interactive quiz and problem-solving module with automated scoring and instant feedback.

EXPERIENCE & INTERNSHIPS
- Summer Software Engineering Intern | GMR Varalakshmi Foundation Tech Cell (June 2024 – August 2024)
  - Assisted in upgrading the student admission portal backend; profiled SQL queries and reduced query latency by 28%.
  - Collaborated with 4 student developers following agile sprints and git branching workflows.

CERTIFICATIONS & ACHIEVEMENTS
- NPTEL Elite Certification: Programming, Data Structures and Algorithms Using Python (IIT Madras, 2023)
- AWS Certified Cloud Practitioner Foundational (2024)
- 1st Place - GMRIT Annual Campus Hackathon 2023 (Web Technologies Track)

SOFT SKILLS
- Analytical problem solving, team collaboration, technical writing, effective presentation skills.
`;

export const ResumeIntelligence: React.FC = () => {
  const { currentStudentProfile, refreshUserData } = useAuth();
  const { showToast } = useNotification();

  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit. Please upload a smaller document.');
      return;
    }

    setFileName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    if (file.type === 'text/plain') {
      reader.onload = () => {
        setResumeText(reader.result as string);
        setMimeType('text/plain');
      };
      reader.readAsText(file);
    } else {
      // For PDF or DOCX, read as Data URL base64 for multimodal Gemini processing
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setFileBase64(base64);
        setMimeType(file.type || 'application/pdf');
        setResumeText(`[Document Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleResume = () => {
    setResumeText(SAMPLE_GMRIT_RESUME_TEXT.trim());
    setFileName('Rahul_Sharma_GMRIT_Resume.txt');
    setFileBase64(null);
    setMimeType('text/plain');
    setErrorMsg(null);
    showToast('Sample Resume Loaded', 'Preloaded GMRIT student sample resume ready for AI analysis.', 'info');
  };

  const handleStartAnalysis = async () => {
    if (!resumeText.trim() && !fileBase64) {
      setErrorMsg('Please upload a resume file or paste resume text first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setIsSaved(false);

    try {
      const result = await geminiApi.analyzeResume({
        resumeText: resumeText.trim(),
        fileData: fileBase64 || undefined,
        mimeType: mimeType || undefined,
        fileName: fileName || 'resume.pdf',
      });

      setAnalysisResult(result);
      showToast(
        'Resume Analyzed Successfully',
        `Extracted ${result.skills?.length || 0} skills, ${result.projects?.length || 0} projects, and calculated readiness score ${result.readinessScore}/100.`,
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze resume. Please try again.');
      showToast('Analysis Error', 'Failed to parse resume via AI service.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToProfile = () => {
    if (!analysisResult || !currentStudentProfile) return;

    // Normalize all extracted skills through taxonomy engine
    const normalizedSkills = normalizeSkillList(
      analysisResult.skills.map(s => ({
        name: s.name,
        category: s.category as any,
        confidence: s.confidence,
        sourceEvidence: s.sourceEvidence || 'Extracted from Resume via Gemini',
        proficiency: s.confidence > 0.85 ? 'Advanced' : 'Intermediate',
        verified: false, // Resume self-reported skills are not yet verified by assessment
      }))
    );

    // Merge or update student profile
    const updated = {
      ...currentStudentProfile,
      fullName: analysisResult.fullName || currentStudentProfile.fullName,
      email: analysisResult.email || currentStudentProfile.email,
      phone: analysisResult.phone || currentStudentProfile.phone,
      cgpa: parseFloat(analysisResult.cgpa) || currentStudentProfile.cgpa,
      careerObjective: analysisResult.summary || currentStudentProfile.careerObjective,
      skills: normalizedSkills,
      softSkills: analysisResult.softSkills || currentStudentProfile.softSkills,
      projects: analysisResult.projects.map((p, idx) => ({
        id: `proj-res-${idx}`,
        title: p.title,
        description: p.description,
        technologies: p.technologies || [],
        link: p.link,
        verified: true,
      })),
      experience: analysisResult.experience.map((e, idx) => ({
        id: `exp-res-${idx}`,
        role: e.role,
        organization: e.organization,
        duration: e.duration,
        description: e.description,
        type: 'Internship' as const,
      })),
      certifications: analysisResult.certifications.map((c, idx) => ({
        id: `cert-res-${idx}`,
        name: c.name,
        issuer: c.issuer || 'Academic / Industry',
        year: c.year || '2024',
      })),
      readinessScore: analysisResult.readinessScore || currentStudentProfile.readinessScore,
      resumeFileName: fileName || 'GMRIT_Student_Resume.pdf',
      resumeLastAnalyzed: new Date().toISOString(),
    };

    db.saveStudentProfile(updated);
    refreshUserData();
    setIsSaved(true);
    showToast('Profile Synchronized', 'All extracted skills and projects have been saved to your student profile!', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Resume Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash Powered</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload your resume to extract skills, project evidence, and calculate industry readiness scores.
          </p>
        </div>

        <button
          onClick={loadSampleResume}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-2 shrink-0"
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Load GMRIT Sample Resume</span>
        </button>
      </div>

      {/* Input / Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Upload Resume Document</span>
          </h2>

          <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Click to browse or drop file here
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports PDF, DOCX, or TXT (Max 5MB)
            </span>
          </label>

          {fileName && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-medium">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>{fileName}</span>
              </div>
              <button
                onClick={() => {
                  setFileName(null);
                  setResumeText('');
                  setFileBase64(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || (!resumeText.trim() && !fileBase64)}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing Resume with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Analyze Skills</span>
              </>
            )}
          </button>
        </div>

        {/* Text View / Edit Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Extracted Text Preview</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              {resumeText.length > 0 ? `${resumeText.length} characters` : 'Empty'}
            </span>
          </div>

          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste raw resume text or view extracted contents here..."
            className="w-full flex-1 min-h-[220px] p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 resize-none text-slate-800"
          />

          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Resume text is parsed securely without storing confidential identity tokens.</span>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
          {/* Top Result Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Analysis Complete
                </span>
                <span className="text-xs text-slate-400">
                  Engine: {analysisResult._source || 'Gemini 3.8 Flash'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{analysisResult.fullName}</h2>
              <p className="text-xs text-slate-600">
                {analysisResult.department} • {analysisResult.degree} • CGPA: {analysisResult.cgpa}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 block">Computed Readiness</span>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-3xl font-extrabold text-indigo-600">{analysisResult.readinessScore}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              <button
                onClick={handleSaveToProfile}
                disabled={isSaved}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-2 ${
                  isSaved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>Saved in Profile</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save to My Student Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Strengths & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysisResult.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Recommended Improvements</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysisResult.improvementAreas?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extracted Skills Categorized */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Extracted Technical Skills & Taxonomy Evidence</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {analysisResult.skills?.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{sk.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">
                      {sk.category}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500">
                    Confidence: {(sk.confidence * 100).toFixed(0)}%
                    {sk.sourceEvidence && (
                      <span className="block italic text-slate-400 mt-0.5 line-clamp-1">
                        "{sk.sourceEvidence}"
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Projects */}
          {analysisResult.projects && analysisResult.projects.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Extracted Academic & Capstone Projects</span>
              </h3>
              <div className="space-y-3">
                {analysisResult.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-indigo-600 hover:underline"
                        >
                          Repository Link ↗
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.technologies?.map(t => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Quote */}
          {analysisResult.summary && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
              "{analysisResult.summary}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
