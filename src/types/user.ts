export interface ElitePlanConfig {
  status: 'active' | 'inactive';
  planType: string;
  expiresAt?: string;
  activatedAt?: string;
}

export interface RegisteredUser {
  id: string;
  fullName: string;
  idNumber: string;
  email: string;
  phone?: string;
  country: string;
  specialty: string;
  subspecialty?: string;
  workplace?: string;
  medicalLicenseNumber?: string;
  collegeRegistration?: string;
  role?: 'admin' | 'user';
  isAdmin?: boolean;
  device?: string;
  registeredAt: string;
  lastActiveAt?: string;
  isPro?: boolean;
  avatarUrl?: string;
  elitePlan?: ElitePlanConfig;
}

export interface RegistrationStatsSummary {
  totalUsers: number;
  eliteUsers: number;
  activeToday: number;
  lastRegistration?: string;
}

export type DoctorUser = RegisteredUser;
