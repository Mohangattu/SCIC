import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Plus,
  Save,
  Share2,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../services/db';
import { normalizeSkill } from '../../services/taxonomy';
import { SkillCategory, SkillItem, StudentCertification, StudentExperience, StudentProject } from '../../types';

const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming',
  'Web Development',
  'Backend Development',
  'Databases',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Data Analytics',
  'CS Fundamentals',
  'Soft Skills',
];

export const StudentProfile: React.FC = () => {
  const { currentStudentProfile, refreshUserData } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState(() => currentStudentProfile || null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Programming');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Project form states
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjLink, setNewProjLink] = useState('');

  // Experience form states
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpOrg, setNewExpOrg] = useState('');
  const [newExpDur, setNewExpDur] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // Certification form states
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  if (!formData) {
    return <div className="p-8 text-center text-slate-500">No student profile loaded.</div>;
  }

  const handleAddProject = () => {
    if (!newProjTitle.trim()) return;
    const project: StudentProject = {
      id: `proj-${Date.now()}`,
      title: newProjTitle.trim(),
      description: newProjDesc.trim() || 'Academic project built at GMRIT.',
      technologies: newProjTech.split(',').map(t => t.trim()).filter(Boolean),
      link: newProjLink.trim() || undefined,
      verified: true,
    };
    setFormData(prev => prev ? { ...prev, projects: [...prev.projects, project] } : null);
    setShowAddProject(false);
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjTech('');
    setNewProjLink('');
    showToast('Project Added', `${project.title} added to profile.`, 'success');
  };

  const handleDeleteProject = (id: string) => {
    setFormData(prev => prev ? { ...prev, projects: prev.projects.filter(p => p.id !== id) } : null);
  };

  const handleAddExp = () => {
    if (!newExpRole.trim() || !newExpOrg.trim()) return;
    const exp: StudentExperience = {
      id: `exp-${Date.now()}`,
      role: newExpRole.trim(),
      organization: newExpOrg.trim(),
      duration: newExpDur.trim() || 'Summer 2024 (2 months)',
      description: newExpDesc.trim() || 'Internship responsibilities and accomplishments.',
      type: 'Internship',
    };
    setFormData(prev => prev ? { ...prev, experience: [...prev.experience, exp] } : null);
    setShowAddExp(false);
    setNewExpRole('');
    setNewExpOrg('');
    setNewExpDur('');
    setNewExpDesc('');
    showToast('Experience Added', `${exp.role} added to profile.`, 'success');
  };

  const handleDeleteExp = (id: string) => {
    setFormData(prev => prev ? { ...prev, experience: prev.experience.filter(e => e.id !== id) } : null);
  };

  const handleAddCert = () => {
    if (!newCertName.trim()) return;
    const cert: StudentCertification = {
      id: `cert-${Date.now()}`,
      name: newCertName.trim(),
      issuer: newCertIssuer.trim() || 'Industry / Institute',
      year: newCertYear.trim() || '2024',
    };
    setFormData(prev => prev ? { ...prev, certifications: [...prev.certifications, cert] } : null);
    setShowAddCert(false);
    setNewCertName('');
    setNewCertIssuer('');
    setNewCertYear('');
    showToast('Certification Added', `${cert.name} added to profile.`, 'success');
  };

  const handleDeleteCert = (id: string) => {
    setFormData(prev => prev ? { ...prev, certifications: prev.certifications.filter(c => c.id !== id) } : null);
  };

  const handleSave = () => {
    db.saveStudentProfile(formData);
    refreshUserData();
    showToast('Profile Updated', 'Student profile saved successfully to GMRIT database.', 'success');
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const { canonical, category } = normalizeSkill(newSkillName);

    const exists = formData.skills.some(s => s.name.toLowerCase() === canonical.toLowerCase());
    if (exists) {
      showToast('Skill Exists', `${canonical} is already listed in your profile.`, 'warning');
      return;
    }

    const newSkill: SkillItem = {
      name: canonical,
      category: category || newSkillCategory,
      proficiency: newSkillProficiency,
      verified: false,
    };

    setFormData(prev => (prev ? { ...prev, skills: [...prev.skills, newSkill] } : null));
    setNewSkillName('');
    showToast('Skill Added', `${canonical} added under ${category || newSkillCategory}.`, 'success');
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData(prev =>
      prev ? { ...prev, skills: prev.skills.filter(s => s.name !== skillName) } : null
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile & Credentials</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Verified GMRIT Record
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your academic standing, verified skills taxonomy, portfolio projects, and placement preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Personal, Academic, Target Role */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Academic Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Personal & Academic Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">GMRIT Roll Number</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Department / Branch</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Current Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  max="10.0"
                  min="0.0"
                  value={formData.cgpa}
                  onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-indigo-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Standing Backlogs Count</label>
                <input
                  type="number"
                  min="0"
                  value={formData.standingBacklogs}
                  onChange={e => setFormData({ ...formData, standingBacklogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={e => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2025 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Career Objective & Target Role */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Career Objectives & Target Preferences</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Full Stack Developer, Cloud DevOps, AI Engineer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Preferred Job Locations</label>
                <input
                  type="text"
                  value={formData.preferredLocation}
                  onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
                  placeholder="e.g. Hyderabad, Bengaluru, Visakhapatnam, Chennai"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Career Objective Statement</label>
                <textarea
                  rows={3}
                  value={formData.careerObjective}
                  onChange={e => setFormData({ ...formData, careerObjective: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Academic Projects */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Academic & Capstone Projects ({formData.projects.length})</span>
              </h2>
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {showAddProject && (
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
                <span className="font-bold text-indigo-900 block">Add New Project Record:</span>
                <input
                  type="text"
                  placeholder="Project Title (e.g. Campus LoRa Air Quality Monitor)"
                  value={newProjTitle}
                  onChange={e => setNewProjTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <textarea
                  placeholder="Project summary and engineering problem solved..."
                  value={newProjDesc}
                  onChange={e => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Technologies used (comma separated, e.g. React, Node.js, PostgreSQL)"
                  value={newProjTech}
                  onChange={e => setNewProjTech(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="url"
                  placeholder="GitHub / Demonstration link (optional)"
                  value={newProjLink}
                  onChange={e => setNewProjLink(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddProject(false)}
                    className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProject}
                    className="px-4 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {formData.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900 text-sm">{proj.title}</span>
                    <div className="flex items-center gap-2">
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          Repository ↗
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internships & Experience */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Internships & Work Experience ({formData.experience.length})</span>
              </h2>
              <button
                onClick={() => setShowAddExp(!showAddExp)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            {showAddExp && (
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
                <span className="font-bold text-indigo-900 block">Add Internship Record:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Role (e.g. Summer SDE Intern)"
                    value={newExpRole}
                    onChange={e => setNewExpRole(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Organization (e.g. GMR Tech Cell)"
                    value={newExpOrg}
                    onChange={e => setNewExpOrg(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration (e.g. June 2024 – August 2024)"
                  value={newExpDur}
                  onChange={e => setNewExpDur(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <textarea
                  placeholder="Responsibilities and measurable achievements..."
                  value={newExpDesc}
                  onChange={e => setNewExpDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddExp(false)}
                    className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExp}
                    className="px-4 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
                  >
                    Save Internship
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {formData.experience.map(exp => (
                <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-indigo-700 font-semibold">{exp.organization} • {exp.duration}</div>
                  <p className="text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Certifications & Achievements ({formData.certifications.length})</span>
              </h2>
              <button
                onClick={() => setShowAddCert(!showAddCert)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>

            {showAddCert && (
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
                <span className="font-bold text-indigo-900 block">Add Certification:</span>
                <input
                  type="text"
                  placeholder="Certification Name (e.g. NPTEL Python, AWS Cloud Practitioner)"
                  value={newCertName}
                  onChange={e => setNewCertName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Issuer (e.g. IIT Madras, Amazon AWS)"
                    value={newCertIssuer}
                    onChange={e => setNewCertIssuer(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Year (e.g. 2024)"
                    value={newCertYear}
                    onChange={e => setNewCertYear(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddCert(false)}
                    className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCert}
                    className="px-4 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
                  >
                    Save Certification
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {formData.certifications.map(cert => (
                <div key={cert.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{cert.name}</span>
                    <span className="text-[11px] text-slate-500">{cert.issuer} • {cert.year}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Skills Taxonomy & Portfolio Settings */}
        <div className="space-y-6">
          {/* Skills Taxonomy Manager */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Skills Matrix ({formData.skills.length})</span>
            </h2>

            {/* Add New Skill Box */}
            <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs">
              <span className="font-bold text-indigo-900 block">Add Normalized Skill:</span>
              <input
                type="text"
                placeholder="Skill name (e.g. React, Docker, Python)..."
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
              />
              <div className="flex gap-2">
                <select
                  value={newSkillCategory}
                  onChange={e => setNewSkillCategory(e.target.value as any)}
                  className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-md text-[11px]"
                >
                  {SKILL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Existing Skills List */}
            <div className="space-y-2 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {formData.skills.map(sk => (
                <div key={sk.name} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{sk.name}</span>
                    <span className="text-[10px] text-slate-400 block">{sk.category} • {sk.proficiency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sk.verified && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                        Verified
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveSkill(sk.name)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Portfolio Settings */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Digital Portfolio Privacy</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              When public, verified recruiters can view your digital portfolio using your campus slug.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-800">Public Portfolio:</span>
              <button
                onClick={() => setFormData({ ...formData, portfolioPublic: !formData.portfolioPublic })}
                className={`px-3 py-1 rounded-full font-bold text-xs transition-colors ${
                  formData.portfolioPublic
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {formData.portfolioPublic ? 'Enabled (Public)' : 'Disabled (Private)'}
              </button>
            </div>
            <div className="text-[11px] text-slate-400 break-all">
              Slug: /portfolio/{formData.publicSlug}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
