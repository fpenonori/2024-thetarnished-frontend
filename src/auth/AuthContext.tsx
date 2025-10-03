import { createContext } from 'react';

export interface ScheduleEntry {
  maxstudents: string;
  studentsCount: number;
  scheduleid: string;
  start_time: string;
  end_time: string;
  teacherid: string;
  dayofweek: string;
}

export interface User {
  id: BigInteger;
  firstName: string;
  lastName: string;
  email: string;
  subjects: {
    subjectid: string;
    subjectname: string;
  }[];
  schedule?: ScheduleEntry[];
  isActive: boolean;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isOnVacation: boolean;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
