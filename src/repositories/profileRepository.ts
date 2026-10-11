export interface FounderProfileDTO {
  id: string;
  name: string;
  roleTitle: string;
  bio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  specialties: string[];
  themePreference: 'ios27' | 'studio' | 'dark';
  emailSignature: string;
  githubUrl?: string;
  portfolioUrl?: string;
  updatedAt: string;
}

const DEFAULT_PROFILES: FounderProfileDTO[] = [
  {
    id: 'valdez',
    name: 'Valdez',
    roleTitle: 'Dirección y desarrollo digital',
    bio: 'Acompaña a cada cliente desde la definición de sus necesidades hasta la puesta en marcha de herramientas digitales a su medida.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: 'valdez@lyberate.com',
    phone: '+58 412 889 0012',
    whatsappNumber: '+584128890012',
    specialties: [
      'Arquitectura de Software',
      'React 19 & TypeScript',
      'NestJS / APIs REST & GraphQL',
      'PostgreSQL & Supabase',
      'Cloudflare Pages / Workers',
      'Sistemas Financieros & POS',
      'Seguridad & RBAC',
    ],
    themePreference: 'ios27',
    emailSignature: 'Valdez — Arquitecto de Software & Full Stack Lead | Lyberate Engineering',
    githubUrl: 'https://github.com/Lyberate-app',
    portfolioUrl: '/trabajos',
    updatedAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'socio',
    name: 'Socio Fundador',
    roleTitle: 'Operaciones y diseño de producto',
    bio: 'Ayuda a convertir las necesidades del negocio en experiencias claras, útiles y fáciles de adoptar por los equipos.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'socio@lyberate.com',
    phone: '+58 414 772 3344',
    whatsappNumber: '+584147723344',
    specialties: [
      'Diseño UI/UX Editorial',
      'Sistemas de Diseño & Tokens',
      'E-commerce & Conversión',
      'Gestión de Clientes & CRM',
      'Automatización de Mensajería',
      'Plataformas Componibles',
      'Estrategia de Producto SaaS',
    ],
    themePreference: 'ios27',
    emailSignature: 'Socio Fundador — Operaciones & Producto | Lyberate',
    githubUrl: 'https://github.com/Lyberate-app',
    portfolioUrl: '/sobre-nosotros',
    updatedAt: '2026-10-10T08:00:00Z',
  },
];

export class ProfileRepository {
  private profiles: FounderProfileDTO[];
  private activeProfileId: string;

  constructor() {
    this.profiles = [...DEFAULT_PROFILES];
    this.activeProfileId = 'valdez';
    this.loadState();
  }

  private loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('lyberate_founder_profiles');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.profiles = parsed;
          }

        } catch {
          this.profiles = [...DEFAULT_PROFILES];
        }
      }
      const storedActive = localStorage.getItem('lyberate_active_profile_id');
      if (storedActive) {
        this.activeProfileId = storedActive;
      }
    }
  }

  reloadFromStorage(): void {
    this.profiles = [...DEFAULT_PROFILES];
    this.loadState();
  }

  private saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lyberate_founder_profiles', JSON.stringify(this.profiles));
      localStorage.setItem('lyberate_active_profile_id', this.activeProfileId);
    }
  }

  getProfiles(): FounderProfileDTO[] {
    return [...this.profiles];
  }

  getProfileById(id: string): FounderProfileDTO | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  getActiveProfile(): FounderProfileDTO {
    return this.getProfileById(this.activeProfileId) || this.profiles[0];
  }

  setActiveProfileId(id: string): void {
    if (this.profiles.some((p) => p.id === id)) {
      this.activeProfileId = id;
      this.saveState();
    }
  }

  updateProfile(id: string, updates: Partial<FounderProfileDTO>): FounderProfileDTO {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Perfil con ID ${id} no encontrado.`);

    const updated: FounderProfileDTO = {
      ...this.profiles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.profiles[index] = updated;
    this.saveState();
    return updated;
  }

  updateOwnProfile(
    actorProfileId: string,
    updates: Partial<FounderProfileDTO>
  ): FounderProfileDTO {
    const profileId = updates.id ?? actorProfileId;
    if (profileId !== actorProfileId) {
      throw new Error('Solo puedes modificar tu propio perfil.');
    }
    const { id, ...changes } = updates;
    return this.updateProfile(actorProfileId, changes);
  }

  resetToDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('lyberate_founder_profiles');
      localStorage.removeItem('lyberate_active_profile_id');
    }
    this.profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
    this.activeProfileId = 'valdez';
  }
}

export const profileRepository = new ProfileRepository();
