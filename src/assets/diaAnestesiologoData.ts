export interface AnesthesiologistHonorItem {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  role: string;
  badge?: string;
}

export const DIA_ANESTESIOLOGO_INFO = {
  date: '16 de Octubre',
  year: '2026',
  title: 'Día Mundial del Anestesiólogo & Día del Anestesiólogo',
  headline: '¡Homenaje Oficial a la Anestesiología y a los Guardianes de la Vida en Quirófano!',
  historicalEvent: 'El 16 de Octubre de 1846, William Thomas Green Morton realizó la primera demostración pública exitosa de anestesia general con éter sulfúrico en el Massachusetts General Hospital (Ether Dome), transformando la medicina y eliminando el dolor quirúrgico para siempre.',
  authorQuote: 'La Anestesiología es la ciencia de la precisión, la calma en la tormenta y el arte de mantener el equilibrio vital en cada latido.',
  authorName: 'Dr. Carlos Eduardo Leal',
  authorTitle: 'Especialista en Anestesiología Cardiovascular & TIVA (Autor y Fundador de AnestesiaPro)',
  bannerImage: '/dia_del_anestesiologo.jpg',
  fallbackImage: '/dia del anestesiologo.jpg',
  motto: 'Seguridad, Vigilancia Continua y Excelencia Quirúrgica',
  stats: {
    totalRegistered: '11+ Médicos Especialistas',
    hospitalsConnected: 'Maracay, Caracas, Valencia, Bogotá, CDMX',
    countries: '🇻🇪 Venezuela • 🇨🇴 Colombia • 🇲🇽 México'
  }
};

export const HONOR_ROLL_DOCTORS: AnesthesiologistHonorItem[] = [
  {
    id: '1',
    name: 'Dr. Carlos Eduardo Leal',
    title: 'Dr.',
    specialty: 'Anestesiología Cardiovascular y TIVA',
    location: 'Maracay, Edo. Aragua (Venezuela)',
    role: 'Autor, Fundador & Director Médico AnestesiaPro',
    badge: '👑 PRO ELITE FUNDADOR'
  },
  {
    id: '2',
    name: 'Dr. David Solórzano',
    title: 'Dr.',
    specialty: 'Anestesia Cardiovascular y Cuidados Críticos',
    location: 'Maracay, Edo. Aragua (Venezuela)',
    role: 'Equipo Quirúrgico & Colega Consultor',
    badge: '⭐ MIEMBRO HONORARIO'
  },
  {
    id: '3',
    name: 'Dra. Katiusca',
    title: 'Dra.',
    specialty: 'Anestesia General, Obstétrica y Manejo del Dolor',
    location: 'Maracay, Edo. Aragua (Venezuela)',
    role: 'Equipo Quirúrgico & Especialista Senior',
    badge: '⭐ MIEMBRO HONORARIO'
  },
  {
    id: '4',
    name: 'Dra. María Fernanda Gómez',
    title: 'Dra.',
    specialty: 'Anestesiología Obstétrica',
    location: 'Maternidad Concepción Palacios (Caracas, Venezuela)',
    role: 'Especialista en Anestesia Neuroaxial',
    badge: 'VERIFICADO'
  },
  {
    id: '5',
    name: 'Dr. Carlos Manuel Silva',
    title: 'Dr.',
    specialty: 'Anestesiología General',
    location: 'Hospital Central de Maracay (Venezuela)',
    role: 'Médico Anestesiólogo Adjunto',
    badge: 'VERIFICADO'
  },
  {
    id: '6',
    name: 'Dra. Valentina Morales',
    title: 'Dra.',
    specialty: 'Anestesiología Obstétrica & Analgesia Neuroaxial',
    location: 'Hospital Universitario de Caracas (Venezuela)',
    role: 'Especialista en Parto Humanizado',
    badge: 'PRO ELITE'
  },
  {
    id: '7',
    name: 'Dr. Gabriel A. Pérez',
    title: 'Dr.',
    specialty: 'Anestesiología e Cuidados Intensivos',
    location: 'Hospital San Ignacio (Bogotá, Colombia)',
    role: 'Especialista en Reanimación Hemodinámica',
    badge: 'INTERNACIONAL'
  },
  {
    id: '8',
    name: 'Dra. Elena Rodríguez',
    title: 'Dra.',
    specialty: 'Anestesiología Pediátrica',
    location: 'Ciudad Hospitalaria Dr. Enrique Tejera (Valencia, Venezuela)',
    role: 'Especialista en Vía Aérea Pediátrica',
    badge: 'PRO ELITE'
  },
  {
    id: '9',
    name: 'Dr. Miguel Ángel Santos',
    title: 'Dr.',
    specialty: 'Anestesiología y Medicina del Dolor',
    location: 'Clínica Las Américas (Medellín, Colombia)',
    role: 'Especialista en Anestesia Regional Ecoguiada',
    badge: 'INTERNACIONAL'
  },
  {
    id: '10',
    name: 'Dra. Sofía Benítez',
    title: 'Dra.',
    specialty: 'Residente de Anestesiología (R3)',
    location: 'Hospital Central de Maracaibo (Venezuela)',
    role: 'Anestesia General y TIVA',
    badge: 'RESIDENTE'
  },
  {
    id: '11',
    name: 'Dr. Roberto Mendoza',
    title: 'Dr.',
    specialty: 'Anestesiología Cardiovascular & ETE',
    location: 'Instituto Nacional de Cardiología (CDMX, México)',
    role: 'Ecocardiografía Transesofágica',
    badge: 'INTERNACIONAL'
  }
];
