import {
  EcosystemNode,
  EcosystemConnection,
  EcosystemNodeType,
  ArchitectureLayer,
} from '../types/ecosystem';

/**
 * Repositorio de datos del Ecosistema Tecnológico de Lyberate.
 * Sección 7 del Master Contract:
 * - Basado en un modelo de datos explícito (no diagramas dibujados a mano).
 * - Distingue sitios, productos, sistemas, automatizaciones e integraciones.
 * - Incluye valor de negocio directo para clientes sin tecnicismos.
 * - Conexiones 100% verificadas sin métricas inventadas.
 */

const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'lyberate-core',
    name: 'Lyberate Core Platform',
    type: 'site',
    categoryLabel: 'Portal & Identidad Digital',
    summary: 'Presencia web oficial con diseño editorial propio, tipografía calculada y navegación accesible.',
    businessValue: 'La vitrina digital que presenta con claridad qué hacemos, qué hemos construido y cómo contactarnos sin intermediarios.',
    status: 'active',
    architectureLayer: 'public',
    publicUrl: 'https://lyberate.com',
    connectedTo: ['centauri-control', 'cloudflare-edge', 'sagitta', 'lyberatedesk'],
    isDemoData: false,
    verifiedTechnologies: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite'],
    iconName: 'Globe',
    keyDeliverable: 'Web pública editorial, catálogo de trabajos y formulario verificado',
  },
  {
    id: 'centauri-control',
    name: 'Centauri Control Room',
    type: 'internal_tool',
    categoryLabel: 'Operaciones & Gobernanza',
    summary: 'Centro de control privado desacoplado para gestión de proyectos, clientes, perfiles y seguridad.',
    businessValue: 'Panel privado que permite a los socios controlar todo el negocio desde un solo lugar sin depender de plataformas de terceros.',
    status: 'active',
    architectureLayer: 'operations',
    caseStudySlug: undefined,
    connectedTo: ['lyberate-core', 'sagitta', 'automation-engine', 'lyberatedesk', 'motoindy'],
    isDemoData: false,
    verifiedTechnologies: ['React 19', 'LocalPersistence', 'RBAC Matrix', 'Vitest TDD'],
    iconName: 'ShieldCheck',
    keyDeliverable: 'Gobernanza RBAC, CMS de contenidos, CRM comercial y bitácora de auditoría',
  },
  {
    id: 'sagitta',
    name: 'Sagitta Enterprise Engine',
    type: 'product',
    categoryLabel: 'Plataforma Comercial & POS',
    summary: 'Motor de software componible para punto de venta, inventario, recetas de productos y facturación.',
    businessValue: 'Permite cobrar en segundos, controlar el inventario para eliminar pérdidas de mercancía y ver las ganancias del día en tiempo real desde cualquier dispositivo.',
    status: 'active',
    architectureLayer: 'platform',
    caseStudySlug: 'sagitta',
    connectedTo: ['centauri-control', 'automation-engine'],
    isDemoData: false,
    verifiedTechnologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Cloudflare Pages'],
    iconName: 'Layers',
    keyDeliverable: 'Punto de venta multi-caja, control de inventario BOM y terminología adaptable',
  },
  {
    id: 'noticia',
    name: 'Contacto con la Noticia',
    type: 'site',
    categoryLabel: 'Medios & Sala de Redacción',
    summary: 'Portal periodístico digital de alta concurrencia con capacidades PWA sin conexión a internet.',
    businessValue: 'Periódico digital que nunca se cuelga: tus lectores pueden leer noticias con poca señal y los redactores publican desde su móvil.',
    status: 'active',
    architectureLayer: 'public',
    publicUrl: 'https://contactoconlanoticia.com',
    caseStudySlug: 'contacto-con-la-noticia',
    connectedTo: ['cloudflare-edge', 'lyberate-core'],
    isDemoData: false,
    verifiedTechnologies: ['PHP 8.x PDO', 'MySQL 8.0', 'React 19 PWA', 'Service Workers'],
    iconName: 'Newspaper',
    keyDeliverable: 'Portal responsive, sala de redacción en vivo y lectura sin conexión',
  },
  {
    id: 'motoindy',
    name: 'MotoIndy Logistics & Mobility',
    type: 'system',
    categoryLabel: 'Movilidad & Despacho Urbano',
    summary: 'Plataforma para despacho de viajes en tiempo real, app para celulares y monitoreo en mapa.',
    businessValue: 'Conecta clientes con conductores en vivo, calcula tarifas automáticas y asigna viajes de inmediato sin llamadas telefónicas.',
    status: 'active',
    architectureLayer: 'platform',
    caseStudySlug: 'motoindy',
    connectedTo: ['centauri-control'],
    isDemoData: false,
    verifiedTechnologies: ['Flutter', 'React', 'NestJS', 'Prisma', 'WebSockets', 'PostgreSQL'],
    iconName: 'Compass',
    keyDeliverable: 'Aplicación móvil Flutter + Panel web de monitoreo de rutas en vivo',
  },
  {
    id: 'lyberatedesk',
    name: 'LyberateDesk / LyberateChat',
    type: 'product',
    categoryLabel: 'SaaS de Atención & Mensajería',
    summary: 'Bandeja unificada multicanal para gestionar conversaciones de WhatsApp, Telegram y chat web.',
    businessValue: 'Reúne las preguntas de tus clientes en una sola pantalla para que tu equipo responda rápido y no se pierda ninguna venta.',
    status: 'beta',
    architectureLayer: 'platform',
    publicUrl: 'https://github.com/Lyberate-app/CrmChatLyberateSis',
    connectedTo: ['centauri-control', 'automation-engine'],
    isDemoData: false,
    verifiedTechnologies: ['TypeScript', 'WebSocket Gateway', 'WhatsApp Cloud API', 'Stripe SaaS'],
    iconName: 'MessageSquare',
    keyDeliverable: 'Bandeja multicanal, demo aislada y planes de suscripción mensual',
  },
  {
    id: 'automation-engine',
    name: 'Automation & Dispatch Engine',
    type: 'automation',
    categoryLabel: 'Automatización de Comunicaciones',
    summary: 'Generador de presupuestos, cobros y mensajes personalizados listos para WhatsApp y correo electrónico.',
    businessValue: 'Genera cotizaciones profesionales y recordatorios de pago con un clic, ahorrando horas de redacción repetitiva.',
    status: 'active',
    architectureLayer: 'operations',
    connectedTo: ['centauri-control', 'sagitta', 'lyberatedesk'],
    isDemoData: false,
    verifiedTechnologies: ['Template Engine', 'WhatsApp URL Protocol', 'Mailto Parser'],
    iconName: 'Cpu',
    keyDeliverable: 'Generador de cotizaciones y mensajes directos con trazabilidad en CRM',
  },
  {
    id: 'cloudflare-edge',
    name: 'Cloudflare Perimetral & Edge Security',
    type: 'integration',
    categoryLabel: 'Seguridad Perimetral & CDN',
    summary: 'Infraestructura perimetral para distribución global, reglas de seguridad CSP/HSTS y mitigación de amenazas.',
    businessValue: 'Protege tu sitio contra ciberataques y hace que cargue casi instantáneamente desde cualquier país del mundo.',
    status: 'active',
    architectureLayer: 'infra',
    connectedTo: ['lyberate-core', 'noticia'],
    isDemoData: false,
    verifiedTechnologies: ['Cloudflare Pages', 'Edge CSP L3', 'Brotli Compression', 'HSTS'],
    iconName: 'Lock',
    keyDeliverable: 'Cabeceras de blindaje perimetral, SSL estricto y caché en el borde',
  },
];

const ECOSYSTEM_CONNECTIONS: EcosystemConnection[] = [
  {
    id: 'conn-01',
    fromNodeId: 'lyberate-core',
    toNodeId: 'centauri-control',
    relationshipLabel: 'Gobernanza y sincronización administrativa',
    isVerified: true,
    protocol: 'LocalState / REST Adapter',
  },
  {
    id: 'conn-02',
    fromNodeId: 'centauri-control',
    toNodeId: 'sagitta',
    relationshipLabel: 'Supervisión de módulos y catálogo comercial',
    isVerified: true,
    protocol: 'Modular Engine Contract',
  },
  {
    id: 'conn-03',
    fromNodeId: 'centauri-control',
    toNodeId: 'lyberatedesk',
    relationshipLabel: 'Gestión de planes de suscripción y usuarios',
    isVerified: true,
    protocol: 'SaaS Subscription Bridge',
  },
  {
    id: 'conn-04',
    fromNodeId: 'centauri-control',
    toNodeId: 'automation-engine',
    relationshipLabel: 'Despacho de presupuestos y sincronización de CRM',
    isVerified: true,
    protocol: 'Dynamic Automation Dispatcher',
  },
  {
    id: 'conn-05',
    fromNodeId: 'lyberate-core',
    toNodeId: 'cloudflare-edge',
    relationshipLabel: 'Entrega por CDN y cabeceras de seguridad CSP',
    isVerified: true,
    protocol: 'Edge Routing HTTPS',
  },
  {
    id: 'conn-06',
    fromNodeId: 'noticia',
    toNodeId: 'cloudflare-edge',
    relationshipLabel: 'Caché multimedia WebP/AVIF y distribución global',
    isVerified: true,
    protocol: 'PWA Service Worker / Edge CDN',
  },
  {
    id: 'conn-07',
    fromNodeId: 'motoindy',
    toNodeId: 'centauri-control',
    relationshipLabel: 'Monitor de arquitectura y despliegue backend',
    isVerified: true,
    protocol: 'REST / WebSocket Telemetry',
  },
  {
    id: 'conn-08',
    fromNodeId: 'automation-engine',
    toNodeId: 'lyberatedesk',
    relationshipLabel: 'Plantillas de bienvenida y respuestas automáticas',
    isVerified: true,
    protocol: 'Message Formatting Protocol',
  },
];

export class EcosystemRepository {
  getNodes(): EcosystemNode[] {
    return [...ECOSYSTEM_NODES];
  }

  getNodeById(id: string): EcosystemNode | undefined {
    return ECOSYSTEM_NODES.find((node) => node.id === id);
  }

  getNodesByType(type: EcosystemNodeType): EcosystemNode[] {
    return ECOSYSTEM_NODES.filter((node) => node.type === type);
  }

  getNodesByLayer(layer: ArchitectureLayer): EcosystemNode[] {
    return ECOSYSTEM_NODES.filter((node) => node.architectureLayer === layer);
  }

  getConnections(): EcosystemConnection[] {
    return [...ECOSYSTEM_CONNECTIONS];
  }

  getConnectionsForNode(nodeId: string): EcosystemConnection[] {
    return ECOSYSTEM_CONNECTIONS.filter(
      (conn) => conn.fromNodeId === nodeId || conn.toNodeId === nodeId
    );
  }
}

export const ecosystemRepository = new EcosystemRepository();
