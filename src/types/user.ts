export type ElitePlanStatus = 'active' | 'pending' | 'inactive';
export type ElitePlanType = 'trial' | 'monthly' | 'annual' | 'lifetime' | 'vip';

export interface ElitePlanConfig {
  status: ElitePlanStatus;
  planType: ElitePlanType;
  activatedAt?: string;
  expiresAt?: string; // ISO date string or 'Ilimitado'
  activatedBy?: string; // 'Dr. Carlos Leal (Admin)'
  adminNotes?: string;
}

export interface RegisteredUserAutoSendConfig {
  autoSendWhatsApp?: boolean;
  autoSendEmail?: boolean;
  defaultRecipientPhone?: string;
  defaultRecipientEmail?: string;
}

export interface RegisteredUser {
  id: string; // e.g. "usr_17892348923_x7z"
  fullName: string;
  email: string;
  idNumber: string; // Cédula de Identidad / DNI
  country: string; // e.g. "🇻🇪 Venezuela", "🇨🇴 Colombia", "🇲🇽 México", etc.
  specialty: string; // e.g. "Médico Especialista en Anestesiología", "Residente", etc.
  phone?: string; // Teléfono / WhatsApp
  workplace?: string; // Hospital, Clínica o Centro de Salud
  // Credenciales Médicas Profesionales para Preanestesia Digital
  medicalLicenseNumber?: string; // Registro Médico / Cédula Profesional / Matrícula (M.P. / M.S.P.S.)
  collegeRegistration?: string; // Num. Colegiación / Colegio Médico
  subspecialty?: string; // Subespecialidad / Fellow
  digitalSignatureUrl?: string; // Firma digitalizada / Sello en Base64
  autoSendConfig?: RegisteredUserAutoSendConfig;
  device?: string; // e.g. "Smartphone Android 📱", "Computadora / PC 💻"
  platform?: 'android' | 'ios' | 'pc';
  isInstalledPWA?: boolean;
  registeredAt: string; // ISO timestamp
  lastActiveAt?: string; // ISO timestamp
  elitePlan: ElitePlanConfig;
}

export interface RegistrationStatsSummary {
  totalUsers: number;
  activeElite: number;
  pendingElite: number;
  inactiveElite: number;
  countriesCount: Record<string, number>;
  specialtiesCount: Record<string, number>;
}
