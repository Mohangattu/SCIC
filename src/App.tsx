import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { InstitutionalDashboard } from './features/admin/InstitutionalDashboard';
import { AlumniDashboard } from './features/alumni/AlumniDashboard';
import { CDCDashboard } from './features/cdc/CDCDashboard';
import { FacultyDashboard } from './features/faculty/FacultyDashboard';
import { RecruiterDashboard } from './features/recruiter/RecruiterDashboard';
import { ApplicationTracker } from './features/student/ApplicationTracker';
import { AssessmentsHub } from './features/student/AssessmentsHub';
import { DigitalPortfolioView } from './features/student/DigitalPortfolioView';
import { OpportunitiesMarketplace } from './features/student/OpportunitiesMarketplace';
import { ResumeIntelligence } from './features/student/ResumeIntelligence';
import { SkillGapExplorer } from './features/student/SkillGapExplorer';
import { StudentDashboard } from './features/student/StudentDashboard';
import { StudentProfile } from './features/student/StudentProfile';

function AppContent() {
  const { currentUser } = useAuth();
  const [isLanding, setIsLanding] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  if (isLanding) {
    return <LandingPage onEnterApp={() => setIsLanding(false)} />;
  }

  const role = currentUser?.role || 'student';

  const renderRoleView = () => {
    switch (role) {
      case 'student':
        switch (activeView) {
          case 'resume-ai':
            return <ResumeIntelligence />;
          case 'skill-gap':
            return <SkillGapExplorer />;
          case 'opportunities':
            return <OpportunitiesMarketplace />;
          case 'applications':
            return <ApplicationTracker />;
          case 'profile':
            return <StudentProfile />;
          case 'assessments':
            return <AssessmentsHub />;
          case 'portfolio':
            return <DigitalPortfolioView />;
          case 'dashboard':
          default:
            return <StudentDashboard onNavigate={setActiveView} />;
        }

      case 'recruiter':
        return <RecruiterDashboard activeView={activeView} onNavigate={setActiveView} />;

      case 'cdc_admin':
        return <CDCDashboard activeView={activeView} onNavigate={setActiveView} />;

      case 'faculty':
        return <FacultyDashboard activeView={activeView} onNavigate={setActiveView} />;

      case 'alumni':
        return <AlumniDashboard activeView={activeView} onNavigate={setActiveView} />;

      case 'institutional_admin':
        return <InstitutionalDashboard activeView={activeView} onNavigate={setActiveView} />;

      default:
        return <StudentDashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      <Navbar
        onNavigateLanding={() => setIsLanding(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto bg-slate-50/70">
          {renderRoleView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
