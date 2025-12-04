export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum Subject {
  MATH = 'Mathe',
  GERMAN = 'Deutsch',
  ENGLISH = 'Englisch'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string;
  address?: string; // For onboarding
  hasPaid?: boolean; // For onboarding status
  joinedDate: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  isAi?: boolean;
}

export interface Exercise {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}