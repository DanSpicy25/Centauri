# Inventario de proyectos y sitios — Resultado tras Fase 00

Actualizado tras la ejecución de la auditoría técnica de solo lectura de la Fase 00 (10 de octubre de 2026).

---

## 1. Inventario de proyectos y sistemas auditados

| Nombre / Identificador | URL Canónica / Repo | Relación con Lyberate | Stack Verificada | Estado Verificado | Licencia detectada | Método de Integración Aprobado |
|---|---|---|---|---|---|---|
| **Lyberate (Sitio de Marca)** | Por definir / en construcción | Propio | React 19 + TS + Vite + Tailwind | En desarrollo | Propietaria | Núcleo de la nueva plataforma |
| **Lyberate CRM / Chat** | `github.com/Lyberate-app/CrmChatLyberateSis` | Propio / Satélite | Go 1.22 + PostgreSQL + Vite SPA | Funcional / Activo | **GNU AGPLv3** | Microservicio externo aislado vía API / Webhook (no fusionar código) |
| **Sagitta** | `github.com/DanSpicy25/Sagita` | Propio / Producto | React 19 + TS + Vite + Tailwind 3.4 + Cloudflare Pages | Funcional / Activo | Propietaria | Adaptador API REST / Catálogo de Productos y Portafolio |
| **Contacto con la Noticia** | `github.com/Lyberate-app/contactoconlanoticia.com` | Producto / Tenant | React 19 + Vite + Tailwind v4 + PHP 8 MySQL | Funcional / Activo | Propietaria | Caso de Estudio / Adaptador de contenidos |
| **MotoIndy** | `github.com/Lyberate-app/MotoIndy` | Producto / Cliente | Flutter (iOS/Android) + NestJS 10 + Prisma + Postgres | Funcional / Activo | Propietaria | Caso de Estudio / Monitoreo operativo |
| **Orgemac** | `https://orgemac.com/` | Cliente / Tenant | SPA Vite (`index-CjtBiq5a.js`), Cloudflare | Producción (`200 OK`) | N/A (Web pública) | Portafolio (pendiente aprobación de atribución) |
| **Pink Fashion VE** | `https://pinkfashionve.com/` | Cliente / Tenant | SPA Vite (`index-CjtBiq5a.js`) | Producción (`200 OK`) | N/A (Web pública) | Portafolio (pendiente aprobación de atribución) |
| **Wilanye** | `https://wilanye.com/` | Cliente / Aplicación | SPA Vite (`index-BarsqxKZ.js`), Tailwind CDN | Producción (`200 OK`) | N/A (Web pública) | Portafolio (pendiente aprobación de atribución) |
| **Otros sitios (~40)** | Pendiente de entrega por el usuario | Por clasificar | Por auditar | Por verificar | Por verificar | Se incorporarán progresivamente al inventario |

---

## 2. Esquema de datos por sitio

- `display_name`: Nombre visible al público.
- `canonical_url`: Enlace canónico de producción.
- `repository_url`: Enlace a repositorio si existe y está confirmado.
- `relationship_type`: `own` (propio), `client` (cliente), `collaboration` (colaboración), `managed` (gestionado), `unknown` (desconocido).
- `lyberate_contribution`: Alcance exacto y comprobado de lo aportado por Lyberate.
- `public_attribution_approved`: Booleano que indica si el titular autorizó la exhibición pública de capturas y marca.
- `stack_verified`: Resumen de tecnologías comprobadas en código o headers.
- `public_status_verified`: Código HTTP o estado funcional comprobado.
- `integration_method`: Enlace externo, adaptador de lectura, conector API o aislado.
- `metrics_source`: Origen de métricas (prohibido inventar datos).
- `last_checked_at`: Marca de tiempo de la última inspección.
- `open_questions`: Preguntas pendientes de respuesta legal o técnica.
