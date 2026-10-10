# INFORME DE AUDITORÍA TÉCNICA — FASE 00 (CENTAURI / LYBERATE)

**Fecha de ejecución:** 10 de octubre de 2026  
**Carácter:** Auditoría exhaustiva de solo lectura, análisis de licencias, evaluación de riesgos e inventario de activos.  
**Estado:** Completado.

---

## 1. Resumen ejecutivo

Se realizó la auditoría técnica de los 4 repositorios de código y los 3 sitios web públicos designados en la documentación del contrato maestro. El entorno local cuenta con **Node.js v22.14.0 (LTS)**, **npm 10.9.2** y **Git 2.55.0**.

### Conclusiones fundamentales:
1. **Riesgo crítico de licencia en CRM/Chat (`CrmChatLyberateSis`):**  
   El repositorio está bajo licencia **GNU AGPLv3** (heredada de *LibreDesk*). Esto impone una obligación estricta de copyleft para servicios en red. **No debe fusionarse ni vincularse directamente en el código de la nueva plataforma**. Debe tratarse exclusivamente como un microservicio satélite externo aislado vía API HTTP/WebSockets.
2. **Ecosistema tecnológico predominante:**  
   Los proyectos propios (`Sagita`, `contactoconlanoticia` y `MotoIndy`) demuestran una clara madurez del equipo en **React 19 + TypeScript + Vite + Tailwind CSS** con arquitectura de componentes moderna, diseño responsivo y mocks desacoplados.
3. **Plataforma multi-tienda observada en producción:**  
   Los dominios `orgemac.com` y `pinkfashionve.com` comparten el mismo bundle de frontend en producción (`/assets/index-CjtBiq5a.js`), confirmando que operan bajo un modelo de plataforma multi-tenant o marca blanca.
4. **Viabilidad de construcción desde cero:**  
   Queda plenamente confirmada la decisión no negociable de edificar **Lyberate desde cero**, adoptando patrones limpios, desacoplando los sistemas existentes y garantizando una base escalable, accesible y libre de deuda técnica o riesgos legales.

---

## 2. Inspección detallada de repositorios

### A. Repositorio: `CrmChatLyberateSis`
- **URL remota:** `https://github.com/Lyberate-app/CrmChatLyberateSis`
- **Rama principal:** `main` (último commit: `0e971c8` - "feat: white-label CRM to Lyberate, remove LibreDesk branding...")
- **Stack Backend:** Go 1.22+ (`go.mod`), PostgreSQL (`schema.sql`), soporte Docker (`Dockerfile`, `docker-compose.yml`), soporte WebSocket y agentes IA (`aiagent.go`, `aitools.go`).
- **Stack Frontend:** JavaScript / Vite + Tailwind CSS (`apps/`, `shared-ui/`, `cypress/`).
- **Licencia:** **GNU AGPLv3 (GNU Affero General Public License v3)**.
- **Riesgo / Hallazgo:** Es un fork directo o derivado de *LibreDesk*. El uso de AGPLv3 es legalmente incompatible con el cierre de código en un monolito propietario.
- **Recomendación de integración:** Aislar completamente. Si Lyberate ofrece este chat/CRM, debe desplegarse como un servicio autónomo en su propio contenedor y consumirse mediante API REST / WebSockets sin mezclar código fuente.

---

### B. Repositorio: `Sagita`
- **URL remota:** `https://github.com/DanSpicy25/Sagita`
- **Ramas activas:** `main`, `master`, `feature/cloudflare-preview` (último commit: `7454160` - "chore(deploy): trigger Cloudflare Pages redeploy...")
- **Stack:** React 19.0.0, TypeScript 5.7, Vite 6.0, Tailwind CSS 3.4, Lucide React 0.460, React Router v6.27, Vitest 2.1, MSW (Mock Service Worker) 2.6.
- **Despliegue:** Cloudflare Pages (`wrangler.jsonc`) y Vercel (`vercel.json`).
- **Propósito:** Plataforma empresarial componible multi-vertical (salud, belleza, fitness) con terminología dinámica (`tTerm`), punto de venta (POS), control de inventario y comisiones.
- **Licencia:** Propietaria / sin archivo LICENSE explícito en la raíz.
- **Recomendación de integración:** Referencia de patrones de arquitectura modular y mock data. Integrable en Centauri mediante adaptador REST / DTO.

---

### C. Repositorio: `contactoconlanoticia` (Lyberate CMS Engine)
- **URL remota:** `https://github.com/Lyberate-app/contactoconlanoticia.com`
- **Rama principal:** `main` (último commit: `c1bd9b5` - "Fix live preview real-time rendering...")
- **Stack Frontend:** React 19.0.0, TypeScript 5.7, Vite 6.1, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React 0.475, React Router v7.1.
- **Stack Backend:** PHP 8.x nativo + PDO + MySQL 8.0 (arquitectura "anti-monolito / anti-Laravel").
- **Propósito:** Motor CMS y portal de noticias multi-tenant con soporte PWA, Web Push y publicidad programática.
- **Licencia:** Propietaria / sin archivo LICENSE explícito en la raíz.
- **Recomendación de integración:** Puede exponer sus noticias vía API REST o feeds RSS/JSON estructurados para nutrir la sección de casos de estudio o integraciones.

---

### D. Repositorio: `MotoIndy`
- **URL remota:** `https://github.com/Lyberate-app/MotoIndy`
- **Rama principal:** `main` (último commit: `d4fd3fc` - "feat(maps): integrate real Google Maps and native GPS...")
- **Arquitectura:** Monorepo con npm workspaces (`apps/*`, `packages/*`, `backend`).
  - `apps/mobile`: Aplicación móvil unificada Flutter (iOS/Android).
  - `apps/web-admin`: Panel web en React + Vite.
  - `apps/landing`: Landing page.
  - `backend`: NestJS 10, Prisma ORM, PostgreSQL (Supabase), WebSockets, AWS S3 / Cloudflare R2.
- **Licencia:** Propietaria / sin archivo LICENSE explícito en la raíz.
- **Recomendación de integración:** Excelente caso de estudio para el portafolio de Lyberate (desarrollo integral móvil, backend tiempo real y web admin).

---

## 3. Auditoría de sitios web en producción

| Sitio Web | URL Canónica | Estado HTTP | Detección Técnica | Rol / Observación |
|---|---|---|---|---|
| **Orgemac** | `https://orgemac.com/` | `200 OK` | SPA Vite (`/assets/index-CjtBiq5a.js`), Cloudflare | Tienda oficial / E-commerce. Comparte infraestructura y bundle con Pink Fashion VE. |
| **Pink Fashion VE** | `https://pinkfashionve.com/` | `200 OK` | SPA Vite (`/assets/index-CjtBiq5a.js`) | Tienda de moda en línea. Cliente / tenant de plataforma e-commerce. |
| **Wilanye** | `https://wilanye.com/` | `200 OK` | SPA Vite (`/assets/index-BarsqxKZ.js`), Tailwind CDN, jsPDF | Aplicación web de gestión, presupuestos o facturación interactiva. |

---

## 4. Evaluación de riesgos

1. **Riesgo de Licenciamiento (Severidad Alta):**
   - La inclusión involuntaria de código de `CrmChatLyberateSis` en la base de código de Centauri activaría el copyleft de AGPLv3. Se establece la regla no negociable de **cero código compartido a nivel de repositorio**.
2. **Riesgo de Contenido y Confidencialidad (Severidad Media):**
   - Para incorporar `orgemac.com`, `pinkfashionve.com`, `wilanye.com` y `contactoconlanoticia.com` al portafolio público con capturas y logotipos, se requiere la aprobación humana formal mediante [`CONTENT_APPROVAL_CHECKLIST.md`](file:///C:/Users/Valdez/Documents/Centauri/CENTAURI_Lyberate_MD_Pack/CENTAURI_Lyberate_MD_Pack/templates/CONTENT_APPROVAL_CHECKLIST.md).
3. **Riesgo de Seguridad SSRF en URL Importer (Severidad Media):**
   - El importador de metadatos del CMS debe rechazar estrictamente IPs locales y privadas (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`, `169.254.169.254`).

---

## 5. Recomendación arquitectónica para Centauri / Lyberate

Basado en la compatibilidad de herramientas del entorno (Node 22, npm 10), la familiaridad del equipo y los estándares modernos de accesibilidad y rendimiento:
- **Frontend Core:** **React 19 + TypeScript + Vite + Tailwind CSS v4**.
- **Iconografía:** **Lucide React** (consistencia probada con los proyectos auditados).
- **Enrutamiento:** Enrutamiento modular con separación estricta de layouts público (`/`) y privado (`/admin`).
- **Sistema de Datos:** Adaptador de repositorio desacoplado con *fixtures* tipados para desarrollo y cliente HTTP centralizado para consumo de API REST v1.

