# Arquitectura — Especificación técnica validada (Post-Fase 00)

## 1. Visión general y límites de la plataforma

La plataforma Centauri (marca pública Lyberate) se estructura en tres capas desacopladas con fronteras físicas y lógicas infranqueables:

1. **Frontend Público (Web Lyberate):**  
   Páginas públicas de alto impacto visual (Inicio/Landing, Sobre nosotros, Servicios, Productos, Portafolio/Casos de estudio, Contacto). Optimizado para velocidad, accesibilidad WCAG y SEO.
2. **Frontend Privado ("Lyberate Control Room"):**  
   Aplicación administrativa privada para gestión editorial de contenidos (CMS), supervisión del inventario de sitios y módulos operativos. No expone sus rutas en la navegación pública y requiere sesión autenticada validada en servidor.
3. **API Backend y Capa de Adaptadores:**  
   Servicio API versionado (`/api/v1/`) que centraliza autenticación, autorización por roles (RBAC), auditoría, validación de esquemas y conectores con sistemas satélite (Sagitta, CRM/Chat, monitores).

---

## 2. Pila tecnológica seleccionada (ADR-001)

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Lucide React.
- **Estructura de enrutamiento:** Enrutador con dos árboles de layout completamente independientes:
  - `PublicLayout`: Header de marca, menú móvil accesible, contenido público, footer institucional.
  - `AdminLayout`: Navegación lateral plegable ("Control Room"), barra superior con búsqueda global y estado de sincronización, área de trabajo densa con tablas y paneles contextuales.
- **Capa de Abstracción de Datos:** Patrón Repositorio (`src/services/` o `src/repositories/`) con interfaces DTO estrictas. Durante las fases iniciales, consume `fixtures` tipados en `src/mocks/`; una vez conectada la API real, la conmutación se realiza en un único punto sin afectar los componentes visuales.

---

## 3. Modelo canónico de datos de Proyectos (`ProjectDTO`)

```typescript
export type ProjectRelationship = 'own' | 'client' | 'collaboration' | 'managed' | 'unknown';
export type ProjectStatus = 'development' | 'beta' | 'available' | 'archived' | 'pending';

export interface ProjectDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  category: string;
  relationship: ProjectRelationship;
  status: ProjectStatus;
  lyberateContribution: string;
  verifiedTechnologies: string[];
  publicUrl?: string;
  thumbnailUrl: string;
  galleryUrls?: string[];
  isFeaturedInHomeCarousel: boolean;
  published: boolean;
  attributionApproved: boolean;
  verifiableOutcome?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Política de integración con sistemas externos (ADR-002)

- **Sistemas satélite aislados:** Repositorios como `CrmChatLyberateSis` (bajo licencia AGPLv3) no comparten código con este repositorio. Se comunican como servicios externos independientes mediante contratos HTTP/REST o WebSockets.
- **Seguridad SSRF en importador de metadatos:** Ningún componente cliente realiza llamadas directas a URLs de terceros. Toda ingesta o comprobación de enlaces se procesa a través de un servicio de servidor con validación de IP contra rangos privados (RFC 1918), timeouts y restricciones de tamaño.
