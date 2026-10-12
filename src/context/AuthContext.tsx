import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, subscribeToDb } from '../services/db';
import { StudentProfile, User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  currentStudentProfile: StudentProfile | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (email: string) => boolean;
  registerUser: (name: string, email: string, role: UserRole, department?: string, company?: string) => void;
  logout: () => void;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default to student (Rahul Sharma) for immediate interactive demo experience
    const users = db.getUsers();
    return users.find(u => u.id === 'user-student-1') || users[0] || null;
  });

  const [currentStudentProfile, setCurrentStudentProfile] = useState<StudentProfile | null>(() => {
    if (currentUser && currentUser.role === 'student') {
      return db.getStudentProfile(currentUser.id) || null;
    }
    return null;
  });

  const refreshUserData = () => {
    if (!currentUser) return;
    const freshUser = db.getUserById(currentUser.id);
    if (freshUser) {
      setCurrentUser(freshUser);
      if (freshUser.role === 'student') {
        const profile = db.getStudentProfile(freshUser.id);
        setCurrentStudentProfile(profile || null);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToDb(() => {
      refreshUserData();
    });
    return unsubscribe;
  }, [currentUser?.id]);

  const loginAsRole = (role: UserRole) => {
    const users = db.getUsers();
    let target = users.find(u => u.role === role);
    if (!target) {
      // create a mock for this role if not found
      target = {
        id: `user-${role}-demo`,
        name: `Demo ${role.toUpperCase()}`,
        email: `${role}@gmrit.edu.in`,
        role: role,
        createdAt: new Date().toISOString(),
      };
      db.saveUser(target);
    }
    setCurrentUser(target);
    if (target.role === 'student') {
      const prof = db.getStudentProfile(target.id);
      setCurrentStudentProfile(prof || null);
    } else {
      setCurrentStudentProfile(null);
    }
  };

  const loginWithEmail = (email: string): boolean => {
    const users = db.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      if (found.role === 'student') {
        setCurrentStudentProfile(db.getStudentProfile(found.id) || null);
      } else {
        setCurrentStudentProfile(null);
      }
      return true;
    }
    return false;
  };

  const registerUser = (
    name: string,
    email: string,
    role: UserRole,
    department: string = 'Computer Science & Engineering',
    company?: string
  ) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      department: role === 'student' || role === 'faculty' ? department : undefined,
      company: role === 'recruiter' || role === 'alumni' ? company : undefined,
      createdAt: new Date().toISOString(),
    };
    db.saveUser(newUser);

    if (role === 'student') {
      const newStudentProfile: StudentProfile = {
        userId: newUser.id,
        fullName: name,
        email: email,
        phone: '+91 98480 00000',
        rollNumber: `22341A05${Math.floor(10 + Math.random() * 89)}`,
        department: department,
        degree: 'B.Tech',
        academicYear: '4th Year (Final Year)',
        graduationYear: 2025,
        cgpa: 8.0,
        standingBacklogs: 0,
        preferredLocation: 'Hyderabad, Bengaluru',
        targetRole: 'Software Developer',
        careerObjective: 'Motivated engineering student at GMRIT seeking industry placement.',
        skills: [
          { name: 'JavaScript', category: 'Programming', proficiency: 'Intermediate' },
          { name: 'Python', category: 'Programming', proficiency: 'Intermediate' },
          { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', proficiency: 'Intermediate' },
        ],
        softSkills: ['Problem Solving', 'Teamwork'],
        projects: [],
        experience: [],
        certifications: [],
        readinessScore: 65,
        portfolioPublic: true,
        publicSlug: name.toLowerCase().replace(/\s+/g, '-'),
      };
      db.saveStudentProfile(newStudentProfile);
      setCurrentStudentProfile(newStudentProfile);
    }

    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentStudentProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentStudentProfile,
        isAuthenticated: !!currentUser,
        loginAsRole,
        loginWithEmail,
        registerUser,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
