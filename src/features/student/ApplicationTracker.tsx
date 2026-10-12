import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { Application, ApplicationStatus } from '../../types';

const STAGES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected',
];

export const ApplicationTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const applications = db
    .getApplications()
    .filter(a => a.studentId === currentUser?.id);

  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    applications[0]?.id || null
  );

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleWithdraw = (appId: string, company: string) => {
    if (confirm(`Are you sure you want to withdraw your application for ${company}? This action is irreversible.`)) {
      db.deleteApplication(appId);
      showToast('Application Withdrawn', `Your application for ${company} was removed.`, 'info');
      if (selectedAppId === appId) {
        setSelectedAppId(null);
      }
    }
  };

  const getStageIndex = (status: ApplicationStatus) => {
    if (status === 'Rejected') return -1;
    return STAGES.indexOf(status);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Lifecycle Tracker</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Real-Time ATS
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your application progression from initial submission to final campus placement offer.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No applications found</h3>
          <p className="text-xs text-slate-500 mt-1">
            You have not applied to any opportunities yet. Head over to the Marketplace to apply!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Applications List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Applications ({applications.length})
            </h2>
            {applications.map(app => {
              const isSelected = activeApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{app.opportunityTitle}</h3>
                      <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">{app.company}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                    <span className="font-semibold text-slate-600">{app.matchScore}% Match</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Lifecycle Stepper & Notes */}
          {activeApp && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Application ID: {activeApp.id}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {activeApp.opportunityTitle}
                    </h2>
                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                      <strong className="text-indigo-700">{activeApp.company}</strong>
                      <span>•</span>
                      <span>Applied on {new Date(activeApp.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {activeApp.status !== 'Selected' && activeApp.status !== 'Rejected' && (
                    <button
                      onClick={() => handleWithdraw(activeApp.id, activeApp.company)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Withdraw Application</span>
                    </button>
                  )}
                </div>

                {/* Progress Stepper */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Recruitment Stage Pipeline
                  </h3>
                  {activeApp.status === 'Rejected' ? (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong>Application Not Selected</strong>: The recruitment team decided not to proceed further at this time.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {STAGES.map((st, idx) => {
                        const currentIdx = getStageIndex(activeApp.status);
                        const isDone = currentIdx > idx;
                        const isCurrent = currentIdx === idx;
                        return (
                          <div
                            key={st}
                            className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                                : isDone
                                ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="text-[10px] opacity-75">Step {idx + 1}</span>
                            <span className="text-xs mt-0.5">{st}</span>
                            {isDone && <CheckCircle className="w-3.5 h-3.5 text-indigo-600 mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Interview Callout (if in Interview stage) */}
                {activeApp.status === 'Interview' && activeApp.interviewDetails && (
                  <div className="p-5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      <span>Interview Invitation & Campus Logistics</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-purple-200 block text-[11px]">Scheduled Date & Time</span>
                        <span className="font-bold text-white text-sm">
                          {activeApp.interviewDetails.date} at {activeApp.interviewDetails.time}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-200 block text-[11px]">Mode & Location</span>
                        <span className="font-semibold text-white">
                          {activeApp.interviewDetails.meetingLinkOrVenue}
                        </span>
                      </div>
                      {activeApp.interviewDetails.interviewerName && (
                        <div className="sm:col-span-2">
                          <span className="text-purple-200 block text-[11px]">Interview Panel</span>
                          <span className="text-white font-medium">
                            {activeApp.interviewDetails.interviewerName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recruiter Notes / Feedback */}
                {activeApp.recruiterNotes && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">Recruitment Panel Feedback:</span>
                    <p className="italic leading-relaxed">"{activeApp.recruiterNotes}"</p>
                  </div>
                )}

                {/* Status Timeline History */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Audit Trail & Timeline
                  </h3>
                  <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
                    {activeApp.statusHistory.map((hist, idx) => (
                      <div key={idx} className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 absolute -left-[21px] top-1"></div>
                        <div className="text-xs font-bold text-slate-900">{hist.status}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(hist.timestamp).toLocaleString()}
                        </div>
                        {hist.note && (
                          <div className="text-xs text-slate-600 mt-0.5">{hist.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
