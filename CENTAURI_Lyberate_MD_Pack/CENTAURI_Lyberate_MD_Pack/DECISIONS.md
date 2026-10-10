# Registro de decisiones de arquitectura (ADR)

---

### ADR-001 — Stack tecnológico para la plataforma Centauri / Lyberate

- **Estado:** aprobada (por autorización del usuario para proceder con la Fase 01)
- **Fecha:** 2026-10-10
- **Contexto:** La plataforma requiere construir una web pública rápida, accesible, atractiva y con alta fidelidad visual, junto con una aplicación privada de administración ("Lyberate Control Room"). El entorno local cuenta con Node.js 22.14.0 y npm 10.9.2. Los repositorios existentes del equipo evidencian dominio consolidado en React 19 y TypeScript.
- **Opciones consideradas:**
  1. Next.js (App Router): Potente pero agrega sobrecarga de configuración en entornos Windows locales y acopla el hosting a Vercel/Node servers.
  2. Vite + React 19 + TypeScript + Tailwind CSS v4: Extremadamente rápido, build estático limpio y reproducible, cero dependencias innecesarias, máxima compatibilidad con las habilidades del equipo y fácil despliegue en cualquier CDN/Cloudflare/Nginx.
- **Decisión:** Adoptar **React 19 + TypeScript 5.7+ + Vite 6 + Tailwind CSS v4 + Lucide React** para el frontend, con arquitectura modular y estricta separación de layouts para la zona pública y el panel de control.
- **Motivos:** Velocidad de desarrollo, cumplimiento estricto de accesibilidad y diseño sin dependencias pesadas, y portabilidad absoluta.
- **Consecuencias y riesgos:** El renderizado inicial es del lado cliente (SPA optimizada con precarga de metadatos para SEO). Para SEO avanzado en fases posteriores, se mantendrán sitemaps y metadatos estáticos listos.
- **Responsable/aprobación:** Aprobado por el usuario.
- **Evidencia:** Auditado en repositorios `Sagita`, `contactoconlanoticia` y `MotoIndy`.

---

### ADR-002 — Aislamiento y política de licencias para sistemas satélite AGPLv3

- **Estado:** aprobada
- **Fecha:** 2026-10-10
- **Contexto:** La auditoría de `CrmChatLyberateSis` reveló que el software se encuentra bajo la licencia **GNU AGPLv3** (derivado de LibreDesk).
- **Opciones consideradas:**
  1. Integrar el código de chat/CRM en el monorepo de Centauri: Inaceptable, forzaría la liberación bajo AGPLv3 de toda la propiedad intelectual de Lyberate.
  2. Reescribir el motor de chat desde cero: Demasiado costoso para las fases iniciales.
  3. Desacoplamiento total: Desplegar `CrmChatLyberateSis` como un contenedor autónomo y consumirlo exclusivamente a través de APIs de red públicas/privadas (HTTP/WebSocket) o adaptadores de integración.
- **Decisión:** Desacoplamiento total. El repositorio de Centauri/Lyberate **no contendrá ni una sola línea de código** de `CrmChatLyberateSis`. Se consumirá como servicio externo independiente.
- **Motivos:** Blindaje legal y preservación del carácter propietario de la nueva plataforma Lyberate.
- **Consecuencias y riesgos:** Se requerirá documentar la configuración de despliegue independiente de dicho servicio en la Fase 08.
- **Responsable/aprobación:** Equipo de arquitectura Centauri.

---

### ADR-003 — Arquitectura de datos: Repositorio desacoplado y Mocks explícitos

- **Estado:** aprobada
- **Fecha:** 2026-10-10
- **Contexto:** La web pública y el portafolio deben desarrollarse antes de que la API completa y el CMS estén en producción, sin inventar datos ni romper contratos cuando la API real esté lista.
- **Decisión:** Implementar un patrón de repositorio en el frontend (`ProjectRepository`, `ContentRepository`, etc.) que consuma DTOs tipados. Durante el desarrollo inicial, el repositorio lee *fixtures* explícitos localizados en `src/mocks/` o `src/data/`; cuando se conecte la API en fases posteriores, solo se conmuta la fuente en el repositorio sin tocar los componentes de UI.
- **Motivos:** Garantiza cumplimiento del contrato maestro sin bloquear el desarrollo visual ni sacrificar fidelidad.
- **Consecuencias y riesgos:** Se deben mantener los tipos DTO sincronizados con la documentación de `API.md`.
