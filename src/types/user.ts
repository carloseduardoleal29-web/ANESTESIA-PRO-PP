export interface DoctorUser {
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
  elitePlan?: {
    status: 'active' | 'inactive';
    planType: string;
    expiresAt?: string;
    activatedAt?: string;
  };
}
