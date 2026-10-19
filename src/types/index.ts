export interface MedicoRegistrado {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  deviceInfo: string;
  createdAt: string;
}

export interface EducationResource {
  id: string;
  title: string;
  category: string;
  summary: string;
  type: string;
  date: string;
  videoUrl?: string;
  imageUrl?: string;
  content?: string;
}
