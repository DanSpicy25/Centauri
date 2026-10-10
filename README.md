# CENTAURI × LYBERATE — PLATAFORMA DIGITAL INTEGRAL
### Core Arquitectónico, Ecosistema Tecnológico y Centro de Control Operativo

> **Marca Comercial Pública:** Lyberate  
> **Nombre Clave de Arquitectura & Control Room:** Centauri  
> **Versión de Lanzamiento:** 1.0.0 (Fases 00 a 09 Completadas al 100%)  
> **Repositorio Oficial:** [https://github.com/Lyberate-app/Centauri](https://github.com/Lyberate-app/Centauri)  
> **Garantía de Calidad:** 14 suites de pruebas unitarias (107 tests pasando), 0 errores TypeScript (`strict`), WCAG 2.1 AA/AAA.

---

## 🌟 Resumen Ejecutivo para Socios y Equipo Directivo

Bienvenido al repositorio maestro de **Centauri × Lyberate**.

Este proyecto no es una plantilla prefabricada de agencia ni una landing comercial aislada: es un **sistema de software integral y modular**, concebido para servir simultáneamente como:
1. **La presencia pública y comercial premium de Lyberate** frente a clientes corporativos, inversores y aliados estratégicos (presentando quiénes somos, qué servicios ofrecemos, qué productos hemos desarrollado y nuestro portafolio de proyectos reales auditados).
2. **El Cuadro de Mando Ejecutivo (Centauri Control Room)** privado para los socios fundadores, desde donde se centraliza la gestión de sitios web de clientes, contenidos (CMS), pipeline de oportunidades comerciales (CRM), control financiero/facturación, automatizaciones de procesos, seguridad/RBAC y operaciones de lanzamiento/recuperación ante desastres (DR).
3. **El Núcleo de Integración Tecnológica** preparado para conectar de manera segura bases de datos, APIs de terceros, pasarelas de pago y satélites de mensajería (cumpliendo con segregación de licencias AGPLv3/propietarias).

---

## 🏛️ Las Dos Grandes Áreas del Sistema

La aplicación está arquitectónicamente dividida en dos entornos aislados mediante layouts y enrutadores dedicados:

```
                                  ┌───────────────────────────────┐
                                  │   CENTAURI PLATFORM CORE      │
                                  └──────────────┬────────────────┘
                                                 │
                      ┌──────────────────────────┴──────────────────────────┐
                      ▼                                                     ▼
       ┌─────────────────────────────┐                       ┌─────────────────────────────┐
       │      MUNDO PÚBLICO          │                       │     CENTAURI CONTROL ROOM   │
       │   (Marca Lyberate)          │                       │       (Panel Privado)       │
       └──────────────┬──────────────┘                       └──────────────┬──────────────┘
                      │                                                     │
         • / (Inicio & Ecosistema)                              • /admin (Overview Ejecutivo)
         • /sobre-nosotros (Historia & Equipo)                  • /admin/sites (Sitios & Dominios)
         • /servicios (Catálogo & Entregables)                  • /admin/cms (Gestor CMS Headless)
         • /productos (Sagitta, CMS, CRM)                       • /admin/crm (Pipeline Kanban Leads)
         • /trabajos (Portafolio & Métricas)                    • /admin/finance (Facturación & MRR)
         • /contacto (Ingestión de Leads)                       • /admin/automations (Webhooks & Workflows)
                                                                • /admin/security (RBAC, API Keys, Audit)
                                                                • /admin/profile (Perfiles de Socios)
                                                                • /admin/launch (Checklist DR & Backups)
                                                                • /admin/design-system (Showcase UI)
```

---

### 1. 🌐 Mundo Público (`/` — Marca Comercial Lyberate)
Diseñado con lenguaje visual editorial de alta gama (tipografías *Playfair Display* y *Plus Jakarta Sans*, paleta obsidian oscura con toques en oro ámbar y esmeralda):

* **Inicio (`/`):** Hero editorial distintivo, propuesta de valor, cifras de impacto, proyectos insignia, catálogo de soluciones, visualizador interactivo del ecosistema tecnológico y llamadas directas a la acción (CTA).
* **Sobre Nosotros (`/sobre-nosotros`):** Historia de origen, misión y visión estratégica, perfiles reales de los socios fundadores con aros de estado de marca, principios no negociables de ingeniería y sección de preguntas frecuentes (FAQ) acordeón accesible.
* **Servicios (`/servicios`):** 6 áreas maestras de servicio (Desarrollo Web & Plataformas, Sistemas de Gestión a Medida, CRM & Omnicanalidad, Automatizaciones de Flujos, Integración de APIs y Mantenimiento Continuo). Incluye para cada uno: alcance, entregables típicos, información requerida y estimaciones de tiempo.
* **Productos (`/productos`):** Fichas técnicas de productos propios y gestionados:
  * **Sagitta:** Plataforma ERP/Gestión integral de operaciones y negocios.
  * **Lyberate CMS:** Gestor de contenidos modular Headless con control de versiones.
  * **Lyberate CRM / Desk:** Solución omnicanal para ventas y soporte automatizado.
* **Trabajos & Casos de Estudio (`/trabajos` y `/trabajos/:slug`):**
  * Portafolio interactivo filtrable por categoría (E-Commerce, Plataformas Web, ERPs, Landing Pages).
  * Casos de estudio detallados con ficha técnica: cliente, rol, desafío resuelto, arquitectura tecnológica empleada, entregables y métricas de impacto reales (ej. reducción de rebote, incremento de conversión).
* **Contacto e Ingestión Comercial (`/contacto`):**
  * Formulario con validación en tiempo real y selector de intención del cliente (Nuevo Proyecto, Consultoría, Integración o Mantenimiento).
  * Conectado automáticamente al **CRM Hub** de Centauri: los leads enviados se guardan de forma instantánea en la base de datos de prospectos para su seguimiento comercial.
* **Widget Flotante de Contacto Rápido:** Acceso directo persistente para agendar llamadas o iniciar chat comercial desde cualquier página pública.

---

### 2. 🎛️ Mundo Privado (`/admin` — Centauri Control Room)
Plataforma operativa privada diseñada para la gestión del negocio y la infraestructura digital:

| Módulo | Ruta | Funcionalidad Principal |
| :--- | :--- | :--- |
| **Overview General** | `/admin` | Métricas ejecutivas consolidadas (sitios activos, leads mensuales, MRR, automatizaciones activas), accesos rápidos y estado del sistema. |
| **Sites Hub** | `/admin/sites` | Gestión del inventario de sitios web y aplicaciones cliente, estado de salud DNS, SSL y vinculación a repositorios. |
| **CMS Headless** | `/admin/cms` | Gestor unificado de páginas públicas (`/admin/cms/pages/:id`) y catálogo de proyectos/portfolio (`/admin/cms/projects`). Permite editar copys, imágenes y publicar cambios sin tocar código. |
| **CRM Comercial** | `/admin/crm` | Pipeline comercial visual (Leads nuevos, Contactados, En Propuesta, Cerrados Ganados). Ingesta automática desde la web pública con métricas de valor estimado y tasa de conversión. |
| **Finanzas & Facturación** | `/admin/finance` | Panel de control de ingresos recurrentes (MRR), cuentas por cobrar, facturas emitidas y desglose de servicios prestados. |
| **Automatizaciones** | `/admin/automations` | Hub de orquestación de flujos de trabajo (triggers por webhook, sincronización de leads, alertas de salud operativa) con logs de ejecución en tiempo real. |
| **Seguridad & RBAC** | `/admin/security` | Matriz de roles y permisos (Superadmin, Operador, Editor, Lector), gestión de API Keys con hash visible seguro y bitácora de auditoría inmutable. |
| **Perfiles de Socios** | `/admin/profile` | Configuración de perfiles directivos, datos de contacto de emergencia, preferencias de notificaciones y preferencias de interfaz. |
| **Lanzamiento & DR** | `/admin/launch` | Checklist de preparación para producción (DNS, SSL, CSP, Backups), prueba de fuego de recuperación ante desastres y exportación/importación atómica de datos. |
| **Design System** | `/admin/design-system` | Catálogo interactivo de todos los componentes visuales del sistema (Botones, Badges, Modales, Inputs, Paginación, etc.) para control de calidad. |

---

## 💾 Arquitectura de Datos y Persistencia

Para garantizar independencia técnica, estabilidad y portabilidad absoluta, el sistema cuenta con una arquitectura de datos desacoplada en tres capas:

```
┌────────────────────────────────────────────────────────┐
│               COMPONENTES DE LA INTERFAZ               │
│               (Public Pages / Admin Pages)             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   REPOSITORIOS TIPADOS                 │
│  (siteRepository, crmRepository, cmsRepository, etc.)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   STORAGE ADAPTER                      │
│   • Namespace aislado: lyberate_*                      │
│   • Fallback transparente en Memoria si no hay Storage  │
│   • Bus de Eventos Reactivo para sincronización en vivo │
│   • Punto de acople listo para PostgreSQL / Supabase   │
└────────────────────────────────────────────────────────┘
```

### 1. `StorageAdapter` (`src/services/storageAdapter.ts`)
* Todo dato se guarda bajo el prefijo `lyberate_*` para evitar colisiones con otras aplicaciones en el mismo navegador o dominio.
* Si el navegador tiene desactivado el almacenamiento local (modo incógnito estricto o cookies bloqueadas), conmuta automáticamente a un almacén en memoria sin lanzar excepciones fatales.
* Al trabajar mediante el patrón Repositorio (`src/repositories/*`), cambiar este almacenamiento local por llamadas a una API REST, GraphQL o base de datos PostgreSQL/Supabase solo requiere modificar el adaptador, sin tocar un solo componente visual.

### 2. `BackupService` (`src/services/backupService.ts`)
* **Exportación Atómica:** Genera un archivo JSON con la fotografía completa de todos los datos del sistema (sitios, leads, contenido CMS, finanzas, automatizaciones, auditoría).
* **Firma Criptográfica SHA-256:** Cada copia de seguridad incluye una suma de comprobación criptográfica. Al importar una copia, el sistema verifica que no haya sido corrompida ni alterada.
* **Restauración de Fábrica (Factory Reset):** Permite reiniciar todos los datos a los valores iniciales auditados con confirmación de seguridad en caso de necesidad.

---

## 🔗 Ecosistema Tecnológico y Segregación Legal (AGPLv3)

El sistema incluye el componente interactivo `EcosystemVisualizer` (`src/components/domain/EcosystemVisualizer.tsx`) que plasma la arquitectura técnica real en 4 capas operativas:

1. **Capa de Experiencia (Frontend):** Centauri Web & Landing Lyberate (React 19 + TypeScript + Tailwind CSS v4).
2. **Capa Core de Plataforma:** Centauri Orchestrator, Storage Engine y Motor de Reglas.
3. **Capa de Satélites & Puentes de Integración:**
   * **LyberateDesk / CrmChat:** Módulo de atención omnicanal basado en tecnología de chat conversacional.
   * **Stripe / Pasarelas de Pago:** Facturación y cobros seguros.
   * **Resend / Postmark:** Notificaciones transaccionales y confirmación de leads.
4. **Capa de Infraestructura:** Cloudflare Pages (Edge Global), Supabase/PostgreSQL (Persistencia Relacional) y Docker Engine (Servidores Satélite).

> ⚖️ **Aislamiento de Licencia (Compliance Legal AGPLv3):**  
> Para proteger la propiedad intelectual del código fuente de Lyberate y Centauri, las tecnologías de soporte basadas en licencias como AGPLv3 (por ejemplo, Chatwoot para mensajería) se orquestan como **satélites desacoplados e independientes a través de APIs HTTP y Webhooks**. En ningún caso se vinculan bibliotecas AGPLv3 directamente en el código empaquetado del Core, garantizando total seguridad jurídica frente a obligaciones de apertura de código.

---

## ✨ Micro-interacciones y Animaciones Táctiles

Todas las acciones de la plataforma cuentan con un sistema de animación táctil y respuesta sensorial de alta precisión:
* **Botones e Interactivos:** Micro-escala táctil (`active:scale-[0.98]`) y halo luminoso (`glow`) en estados de foco y selección.
* **Tarjetas de Proyectos y Servicios:** Elevación suave en hover (`-translate-y-1`) con transición cromática en el borde de marca.
* **Visualizador del Ecosistema:** Pulso de conexión entre nodos activos, expansión de detalle contextual y transiciones cinéticas.
* **Accesibilidad Universal (WCAG AAA):** El archivo `src/styles/index.css` incluye la directiva estricta `@media (prefers-reduced-motion: reduce)`, que desactiva automáticamente todas las transiciones complejas para usuarios con sensibilidad vestibular o preferencias de accesibilidad activadas en su sistema operativo.

---

## 🛠️ Tecnologías y Stack Técnico

* **Librería UI:** React 19.0.0
* **Lenguaje:** TypeScript 5.7.3 (Modo `strict`, `noUnusedLocals: true`)
* **Empaquetador & Dev Server:** Vite 6.1.0
* **Motor de Estilos:** Tailwind CSS v4.0.6 con tipografías web integradas
* **Enrutamiento:** React Router v7.1.5 (Jerarquía desacoplada de Layouts)
* **Iconos:** Lucide React v0.475.0
* **Testing:** Vitest 3.0.5 + `@testing-library/react` + `jsdom`
* **Despliegue Recomendado:** Cloudflare Pages (Archivos de configuración `public/_headers` y `public/_redirects` preconfigurados)

---

## 🚀 Guía de Inicio Rápido para Desarrolladores

### 1. Clonar el repositorio
```bash
git clone https://github.com/Lyberate-app/Centauri.git
cd Centauri
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar servidor de desarrollo local
```bash
npm run dev
```
La aplicación estará disponible inmediatamente en `http://localhost:3000` (o el puerto que asigne Vite).

### 4. Ejecutar la suite completa de pruebas
```bash
npm test
```
Ejecutará las 14 suites con los 107 tests unitarios y de integración.

### 5. Compilar para producción (Build)
```bash
npm run build
```
Generará el bundle optimizado en la carpeta `dist/`, verificando cero errores de tipos TypeScript.

### 6. Previsualizar el build de producción
```bash
npm run preview
```

---

## ☁️ Despliegue en Producción (Cloudflare Pages)

El proyecto está preparado para desplegarse en segundos en **Cloudflare Pages** (o cualquier servidor estático moderno como Vercel o Netlify):

1. **Configuración del Proyecto en Cloudflare:**
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Build Output Directory:** `dist`
   * **Node.js Version:** `20` o `22` (configurar en variables de entorno: `NODE_VERSION = 22`)
2. **Archivos de Producción Incluidos en `public/`:**
   * `public/_headers`: Aplica cabeceras de seguridad estrictas (Content-Security-Policy, HSTS, X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, Referrer-Policy).
   * `public/_redirects`: Regla de reescritura para Single Page Application (`/*  /index.html  200`).

---

## 📋 Estructura de Directorios del Código Fuente

```
Centauri/
├── .gitignore                    # Reglas de exclusión (node_modules, dist, *.zip)
├── CENTAURI_Lyberate_MD_Pack/    # Contratos maestros de fase y bitácora técnica
├── public/                       # Favicon, _headers de seguridad y _redirects SPA
├── src/
│   ├── components/
│   │   ├── common/               # Widgets compartidos (FloatingContactWidget)
│   │   ├── domain/               # Componentes de negocio (EcosystemVisualizer, ProjectCard, ProjectCarousel)
│   │   ├── layout/               # Layouts maestros (PublicLayout, AdminLayout, SiteHeader, Footer)
│   │   └── ui/                   # Primitivas visuales accesibles (Button, Dialog, Card, Tabs, Badge...)
│   ├── data/
│   │   └── fixtures.ts           # Datos base auditados e iniciales del ecosistema
│   ├── pages/
│   │   ├── admin/                # Páginas del Control Room privado (Overview, Sites, CMS, CRM, Finance...)
│   │   └── public/               # Páginas públicas de Lyberate (Inicio, Sobre Nosotros, Servicios...)
│   ├── repositories/             # Capa de abstracción de datos (siteRepository, crmRepository...)
│   ├── services/                 # Servicios transversales (storageAdapter, backupService)
│   ├── styles/                   # Sistema de diseño, animaciones y tokens Tailwind v4
│   ├── test/                     # 14 suites de pruebas unitarias y de integración
│   ├── types/                    # Definiciones TypeScript de entidades y contratos
│   ├── App.tsx                   # Enrutador principal y jerarquía de vistas
│   └── main.tsx                  # Punto de entrada de la aplicación
├── package.json                  # Dependencias y scripts de ejecución
├── tsconfig.json                 # Configuración estricta de compilador TypeScript
├── vite.config.ts                # Configuración de empaquetado y tests con Vitest
└── README.md                     # Documentación ejecutiva y técnica de la plataforma
```

---

## 🧭 Próximos Pasos para los Socios Fundadores

1. **Revisión del Control Room:** Ingresar a `/admin` y validar los datos de los proyectos, sitios vinculados y métricas iniciales.
2. **Personalización del CMS:** Probar la edición de textos en `/admin/cms` para verificar la reactividad en tiempo real de la web pública.
3. **Conexión de Satélites Reales:** Conectar los endpoints de producción para el CRM de mensajería externa y pasarela de cobros en `/admin/automations`.
4. **Despliegue a Dominio Oficial:** Conectar el repositorio de GitHub con Cloudflare Pages apuntando al dominio de marca `lyberate.com` o similar.

---

*Desarrollado con dedicación, excelencia arquitectónica y visión de largo plazo para el ecosistema **Centauri × Lyberate**.*
