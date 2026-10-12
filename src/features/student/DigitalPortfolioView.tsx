import React from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';

export const DigitalPortfolioView: React.FC = () => {
  const { currentStudentProfile } = useAuth();
  const { showToast } = useNotification();

  const profile = currentStudentProfile;
  if (!profile) {
    return <div className="p-8 text-center text-slate-500">Student profile not loaded.</div>;
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#portfolio-${profile.publicSlug}`;
    navigator.clipboard.writeText(url);
    showToast('Link Copied', 'Digital Portfolio public link copied to clipboard.', 'success');
  };

  const verifiedSkills = (profile.skills || []).filter(s => s.verified);
  const otherSkills = (profile.skills || []).filter(s => !s.verified);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Copy Link Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">
            GMRIT Verified Digital Portfolio
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Recruiter-Ready Candidate Showcase</h1>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Shareable Link</span>
        </button>
      </div>

      {/* Main Portfolio Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 space-y-8">
        {/* Profile Bio Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                GMRIT Campus Verified
              </span>
              <span className="text-xs text-slate-400">Roll No: {profile.rollNumber}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile.fullName}</h2>
            <p className="text-sm font-semibold text-indigo-600">
              Aspiring {profile.targetRole || 'Software Development Engineer'}
            </p>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-1">
              {profile.careerObjective}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.preferredLocation}</span>
              </span>
            </div>
          </div>

          {/* Academic Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Academic Standing
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {profile.cgpa.toFixed(2)} <span className="text-xs font-normal text-slate-500">CGPA</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mt-1 inline-block">
              {profile.standingBacklogs === 0 ? '0 Active Backlogs' : `${profile.standingBacklogs} Backlogs`}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              {profile.department} • Class of {profile.graduationYear}
            </div>
          </div>
        </div>

        {/* Verified Skills Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Verified Technical Competencies ({verifiedSkills.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Skills validated through objective campus assessments, hackathons, or faculty project reviews.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {verifiedSkills.map(sk => (
              <span
                key={sk.name}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-950 flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{sk.name}</span>
                <span className="text-[10px] text-indigo-500 font-normal">({sk.category})</span>
              </span>
            ))}
          </div>

          {otherSkills.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                Coursework & Practical Exposure:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {otherSkills.map(sk => (
                  <span
                    key={sk.name}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Academic & Capstone Projects */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Demonstrated Projects ({profile.projects.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map(proj => (
              <div key={proj.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.technologies.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internships */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Internships & Industry Training</span>
            </h3>
            {profile.experience.length === 0 ? (
              <p className="text-xs text-slate-400">No industry internships listed.</p>
            ) : (
              profile.experience.map(exp => (
                <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{exp.role}</div>
                  <div className="text-indigo-700 font-semibold">{exp.organization}</div>
                  <div className="text-slate-400 text-[11px]">{exp.duration}</div>
                  <p className="text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Recognitions & Certifications</span>
            </h3>
            {profile.certifications.length === 0 ? (
              <p className="text-xs text-slate-400">No external certifications recorded.</p>
            ) : (
              profile.certifications.map(cert => (
                <div key={cert.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <span className="text-slate-500 text-[11px]">{cert.issuer} • {cert.year}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Institutional Sign-off Footer */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-indigo-900 gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>
              <strong>GMR Institute of Technology</strong> — Academic Credential Record verified by CDC Placement Cell.
            </span>
          </div>
          <span className="text-[11px] text-indigo-600 font-mono">
            ID: GMRIT-VERIFIED-{profile.rollNumber}
          </span>
        </div>
      </div>
    </div>
  );
};
