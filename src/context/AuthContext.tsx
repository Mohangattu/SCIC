import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, generateAndStoreOtp, subscribeToDb, validateRoleEmail, verifyOtpCode } from '../services/db';
import { RegistrationPayload, StudentProfile, User, UserRole } from '../types';

const CURRENT_USER_KEY = 'scic_gmrit_current_user_v4';

interface AuthContextType {
  currentUser: User | null;
  currentStudentProfile: StudentProfile | null;
  isAuthenticated: boolean;
  requestOtp: (email: string, role: UserRole) => { success: boolean; message: string; otp?: string };
  verifyOtpAndLogin: (email: string, code: string) => { success: boolean; message: string; user?: User };
  registerUser: (payload: RegistrationPayload) => { success: boolean; message: string; user?: User };
  logout: () => void;
  refreshUserData: () => void;
  allRegisteredUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify user still exists in database
        const existing = db.getUserById(parsed.id);
        return existing || null;
      }
    } catch (e) {
      console.warn('Failed to parse current user from storage:', e);
    }
    return null;
  });

  const [currentStudentProfile, setCurrentStudentProfile] = useState<StudentProfile | null>(() => {
    if (currentUser && currentUser.role === 'student') {
      return db.getStudentProfile(currentUser.id) || null;
    }
    return null;
  });

  const refreshUserData = () => {
    if (!currentUser) {
      setCurrentStudentProfile(null);
      return;
    }
    const freshUser = db.getUserById(currentUser.id);
    if (freshUser) {
      setCurrentUser(freshUser);
      if (freshUser.role === 'student') {
        const profile = db.getStudentProfile(freshUser.id);
        setCurrentStudentProfile(profile || null);
      } else {
        setCurrentStudentProfile(null);
      }
    } else {
      setCurrentUser(null);
      setCurrentStudentProfile(null);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToDb(() => {
      refreshUserData();
    });
    return unsubscribe;
  }, [currentUser?.id]);

  // Request OTP for Login or Registration
  const requestOtp = (email: string, role: UserRole): { success: boolean; message: string; otp?: string } => {
    const validation = validateRoleEmail(role, email);
    if (!validation.isValid) {
      return { success: false, message: validation.error || 'Invalid email format' };
    }

    const res = generateAndStoreOtp(email, role);
    return res;
  };

  // Verify OTP and Log In
  const verifyOtpAndLogin = (
    email: string,
    code: string
  ): { success: boolean; message: string; user?: User } => {
    const trimmedEmail = email.trim().toLowerCase();
    const verification = verifyOtpCode(trimmedEmail, code);
    if (!verification.isValid) {
      return { success: false, message: verification.error || 'Invalid OTP code' };
    }

    // Look up registered user
    const user = db.getUserByEmail(trimmedEmail);
    if (!user) {
      return {
        success: false,
        message: 'No registered account found for this email. Please complete registration first.',
      };
    }

    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    if (user.role === 'student') {
      const profile = db.getStudentProfile(user.id);
      setCurrentStudentProfile(profile || null);
    } else {
      setCurrentStudentProfile(null);
    }

    return { success: true, message: `Successfully logged in as ${user.name}`, user };
  };

  // Register New User
  const registerUser = (
    payload: RegistrationPayload
  ): { success: boolean; message: string; user?: User } => {
    const trimmedEmail = payload.email.trim().toLowerCase();
    const validation = validateRoleEmail(payload.role, trimmedEmail);
    if (!validation.isValid) {
      return { success: false, message: validation.error || 'Email validation failed' };
    }

    // Check if user already exists
    const existing = db.getUserByEmail(trimmedEmail);
    if (existing) {
      return {
        success: false,
        message: `An account with ${trimmedEmail} is already registered as ${existing.role.toUpperCase()}. Please log in with OTP instead.`,
      };
    }

    // Register user & create corresponding role entity
    const newUser = db.registerUser(payload);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    if (newUser.role === 'student') {
      const profile = db.getStudentProfile(newUser.id);
      setCurrentStudentProfile(profile || null);
    } else {
      setCurrentStudentProfile(null);
    }

    return {
      success: true,
      message: `Account created successfully for ${newUser.name} (${newUser.role}).`,
      user: newUser,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentStudentProfile(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const allRegisteredUsers = db.getUsers();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentStudentProfile,
        isAuthenticated: !!currentUser,
        requestOtp,
        verifyOtpAndLogin,
        registerUser,
        logout,
        refreshUserData,
        allRegisteredUsers,
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
