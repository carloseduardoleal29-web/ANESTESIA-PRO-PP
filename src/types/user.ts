export interface DoctorUser {
  id?: string;
  fullName: string;
  email: string;
  medicalId: string;
  specialty: string;
  country: string;
  registeredAt: string;
  isPro?: boolean;
  updatedAt?: string;
}
