# CENTAURI MASTER CONTRACT — Lyberate

**Tipo de documento:** contrato principal y fuente de verdad del proyecto.  
**Estado:** inicial; las decisiones que requieran inspección se marcan como pendientes.  
**Nombre interno:** Centauri. **Marca pública:** Lyberate.

## 1. Misión

Construir desde cero una plataforma digital profesional para Lyberate que incluya:

1. Una web pública de marca, servicios, productos y trabajos.
2. Una vitrina de proyectos con una presentación visual excelente y relaciones transparentes.
3. Un panel administrativo privado, independiente de la web pública, para gestionar contenido y, por etapas, operaciones comerciales.
4. Una arquitectura capaz de integrar otros productos y sitios mediante APIs/adaptadores sin convertirlos en un único monolito inseparable.

La primera prioridad es la **web pública**. El panel administrativo debe diseñarse con visión de producto desde el principio, pero implementarse por fases. No sacrificar la calidad del landing para adelantar módulos empresariales.

## 2. Principios no negociables

- Construir el proyecto nuevo desde cero. Los repositorios existentes son material de auditoría y referencia, no una arquitectura que deba copiarse obligatoriamente.
- Inspeccionar antes de afirmar. Si un repositorio, sitio, archivo o integración no es accesible, declararlo explícitamente.
- No inventar métricas, clientes, resultados, testimonios, funciones, precios, estados de producción ni propiedad intelectual.
- Mostrar con honestidad si un proyecto es propio, de cliente, una colaboración o una integración. No atribuirse trabajo que no esté confirmado.
- Separar frontend y backend física y conceptualmente. La interfaz consumirá contratos API documentados; durante el desarrollo se pueden usar fixtures/mock data claramente etiquetados.
- El servidor es responsable de autenticar, autorizar, validar, aislar tenants y proteger datos.
- No guardar tokens de sesión, secretos ni permisos como fuente de autoridad en `localStorage`.
- Mantener accesibilidad WCAG como objetivo, navegación por teclado, foco visible, etiquetas accesibles, contraste suficiente y soporte para `prefers-reduced-motion`.
- Responsive real para móvil, tablet y escritorio. Probar estados de carga, vacío, error, éxito, desconexión y permisos insuficientes.
- No añadir dependencias pesadas sin justificar beneficio, mantenimiento, licencia y coste.
- No introducir módulos futuros antes de su fase.
- No realizar cambios destructivos ni tocar repositorios heredados durante la fase de auditoría.
- No fingir que una prueba se ejecutó: informar comandos, resultados y limitaciones.

## 3. Dirección creativa: Lyberate

### Sensación buscada

Una marca tecnológica confiable, humana, contemporánea, creativa y profesional. Debe sentirse propia y reconocible: editorial, pulida, cálida y con personalidad. El sitio tiene que ser bonito sin sacrificar claridad.

### Evitar

- Landing genérico de SaaS o plantilla de startup.
- Neón excesivo, gradientes en todas partes o fondos visualmente ruidosos.
- Bordes blancos gruesos, tarjetas repetidas para absolutamente todo y sombras pesadas.
- Titulares gigantes que empujen la información útil fuera de pantalla.
- Animaciones constantes, efectos que distraigan o autoplay agresivo.
- Esquinas excesivamente redondeadas en cada componente.
- Iconos emoji usados como iconografía de interfaz.
- Textos vacíos como “revolucionamos el futuro” sin explicar qué hace Lyberate.
- Inventar fotos del equipo o usar retratos ficticios como si fueran personas reales.

### Requisitos visuales

- Diseñar un sistema propio de color, tipografía, escala, espaciado, radios, elevación, iconos y movimiento.
- El aro circular de color alrededor de retratos/avatares en Sobre nosotros es un recurso de marca, no un efecto decorativo repetido en toda la web. Usar imágenes reales autorizadas si están disponibles; si faltan, crear placeholders elegantes y claramente sustituibles.
- La página debe conservar personalidad en móvil; no limitarse a apilar bloques de escritorio.
- El carrusel debe ser accesible, táctil, controlable por teclado y sin autoplay obligatorio.
- Incluir estados hover/focus/active/disabled, skeletons y errores útiles.
- Respetar movimiento reducido y no depender del color como única señal.

## 4. Estructura pública requerida

### Inicio / landing page

Debe ser la página más memorable del sitio. Orden sugerido, ajustable tras auditoría:

1. Header compacto con logo, navegación, CTA principal y menú móvil accesible.
2. Hero con propuesta de valor clara, titular con personalidad, texto corto, CTA principal y CTA secundario.
3. Composición visual propia: collage editorial de productos/proyectos, capturas reales autorizadas, elementos geométricos o una escena gráfica diseñada. No usar ilustraciones genéricas sin relación con el producto.
4. Franja breve de capacidades/servicios, sin cifras inventadas.
5. **Carrusel/vitrina de proyectos integrado en Inicio**, con tarjetas visualmente variadas pero coherentes, imagen/captura, categoría, resumen, tipo de relación y enlace a detalle.
6. Sección “Qué podemos construir” o equivalente con servicios resumidos.
7. Presentación de productos propios/gestionados con enlace a sus páginas.
8. Proceso de trabajo en pasos claros.
9. CTA final para conversar o solicitar una propuesta.
10. Footer completo con navegación, contacto y enlaces legales/configurables.

El hero debe explicar rápidamente qué hace Lyberate. No convertirlo en una pared de texto. El carrusel debe tener controles anterior/siguiente, indicador de posición, soporte de swipe, foco accesible y una alternativa visible para explorar todos los proyectos. No mover tarjetas automáticamente por defecto.

### Sobre nosotros

Página independiente en la navegación. Debe incluir:

- Historia y propósito de Lyberate, sin inventar fechas o hitos.
- Qué hacemos y cómo trabajamos.
- Personas/roles, con imagen circular, aro de color, nombre, rol y descripción breve cuando los datos reales estén disponibles.
- Si falta una foto real, usar avatar/monograma ilustrado claramente identificable como placeholder; nunca hacer pasar una persona generada por una persona real.
- Bloques inferiores de información: principios de trabajo, capacidades, enfoque de colaboración, proceso y preguntas frecuentes relevantes.
- Sección de productos/proyectos relacionados cuando ayude a entender el ecosistema.
- No afirmar certificaciones, tamaño de equipo ni resultados que no se hayan confirmado.

### Trabajos / Portafolio

Página independiente con más detalle que el carrusel del Inicio:

- Filtros útiles por tipo/categoría y, cuando haya datos suficientes, por relación (propio, cliente, colaboración).
- Tarjetas o filas editoriales con captura/imagen, título, resumen, tecnologías confirmadas, rol de Lyberate y estado publicable.
- Página de detalle/case study por proyecto con contexto, problema, enfoque, alcance real, contribución de Lyberate, capturas, decisiones y resultado verificable.
- Separar hechos confirmados de datos pendientes.
- No publicar información confidencial, datos de clientes ni capturas no autorizadas.
- Permitir proyectos sin métricas; no inventar porcentajes de mejora.
- Importación automática solo como borrador pendiente de revisión humana.

### Servicios

Explicar servicios en lenguaje sencillo, por ejemplo: webs, aplicaciones web, sistemas de gestión, integraciones, automatización y soporte/asesoría, siempre que el usuario confirme que Lyberate ofrece ese servicio. Cada servicio debe explicar para quién es, qué problema resuelve, entregables típicos y cómo pedir una propuesta. No mostrar precios no aprobados.

### Productos

Presentar productos como unidades claramente diferenciadas, por ejemplo Sagitta, Lyberate CRM/chat y otros productos confirmados. Indicar propósito, público, funciones verificadas, estado (en desarrollo, beta, disponible) y CTA. No prometer disponibilidad, seguridad certificada o funciones no comprobadas. Para suscripciones, los planes y límites requieren decisión comercial explícita.

### Contacto

Formulario accesible con nombre, medio de contacto, tipo de necesidad, descripción y consentimiento cuando sea aplicable. Validación en cliente y servidor, antispam y estados claros. Recoger solo los datos necesarios. Ofrecer correo u otro canal real si está confirmado.

### Acceso privado

El login administrativo no debe parecer otra sección pública ni exponerse como un CTA principal innecesario. Separar rutas, layout, permisos y políticas de seguridad del sitio público.

## 5. Panel administrativo: producto separado

El panel será una aplicación privada con identidad visual propia dentro de la marca Lyberate. No debe ser un dashboard genérico lleno de tarjetas. Debe sentirse como un centro de operaciones profesional, claro, denso cuando sea útil y adaptable.

### Concepto visual recomendado: “Lyberate Control Room”

- Navegación lateral compacta y plegable, con agrupación por áreas.
- Barra superior con búsqueda global, selector de espacio/organización cuando corresponda, estado de sincronización, ayuda y menú de usuario.
- Inicio configurable con actividad reciente, tareas pendientes, salud de integraciones y resúmenes basados únicamente en datos reales.
- Jerarquía tipográfica fuerte, tablas de calidad, filtros persistentes, vistas guardadas y acciones contextuales.
- Vistas de lista/detalle para gestionar muchos registros; no forzar todo a tarjetas.
- Diseño claro y modo oscuro opcional si se puede mantener accesible y coherente.
- Panel de detalles lateral o vista dedicada, según la tarea; confirmaciones explícitas para acciones destructivas.
- Indicadores con etiquetas textuales además de color; datos con fuente y fecha de última sincronización.
- Navegación rápida por teclado y búsqueda global, sin ocultar funciones críticas detrás de gestos.
- Skeletons, vacíos que expliquen el siguiente paso, errores recuperables, reintentos y avisos de datos desactualizados.

### Áreas previstas, no todas para la primera versión

1. Inicio / resumen operativo.
2. Sitios gestionados: inventario, dominio, entorno, responsable, estado y monitorización.
3. Proyectos y portafolio: registros, relaciones, borradores, publicación y casos de estudio.
4. CMS de la web pública: páginas, secciones, orden, visibilidad, imágenes, navegación, SEO, vista previa, borradores, publicación, versiones y restauración.
5. Clientes y oportunidades: contactos, empresas, etapas, notas autorizadas y tareas.
6. Productos y planes: catálogo, versiones, estado y planes aprobados.
7. Suscripciones y facturación: solo con fuente de datos real e integración validada.
8. Analítica: datos de proveedores autorizados, con fuente y última sincronización.
9. Integraciones y automatizaciones.
10. Usuarios, roles, permisos y auditoría.
11. Configuración, seguridad, notificaciones y preferencias.

### Métricas: reglas de verdad

- Estado web y tiempo de respuesta requieren un monitor real.
- Tráfico requiere una integración autorizada (por ejemplo, una herramienta analítica elegida por el equipo).
- Ingresos requieren datos de facturación/pagos válidos.
- No inferir visitas, ventas, CTR o ingresos desde el nombre de dominio.
- Mostrar “Sin conectar”, “Sin datos”, “Última sincronización…” o “Datos de demostración” en vez de inventar números.
- Las primeras pantallas pueden usar datos ficticios solo si están claramente marcados como demo y aislados de producción.

## 6. Arquitectura y límites

La tecnología final debe decidirse después de la auditoría y documentarse en ADRs. No fijar una stack por costumbre. El agente debe evaluar mantenimiento, habilidades del equipo, despliegue, coste, accesibilidad, rendimiento y separación frontend/backend.

- Frontend público y frontend administrativo pueden compartir componentes/tokens cuando tenga sentido, pero deben tener layouts, rutas y permisos separados.
- Backend mediante API versionada y documentada.
- Las aplicaciones existentes se conectan mediante adaptadores/API documentadas; no se fusionan automáticamente en un repositorio.
- Contratos API y modelos tipados deben permitir desarrollo frontend con mocks y sustitución por datos reales.
- Diseñar pensando en múltiples productos/sitios, pero no implementar multi-tenancy ficticia antes de saber qué sistemas la necesitan.
- No exponer claves de servicio al navegador.
- Importar metadatos de URL de forma segura en servidor o servicio aislado. Prevenir SSRF, bloquear IP privadas/loopback/link-local, validar redirecciones, protocolos y tamaño, establecer timeout y límites, y no ejecutar contenido importado.
- No abrir un sitio externo automáticamente como parte de una acción privilegiada sin validación y confirmación.

## 7. Seguridad y privacidad

- Autenticación segura y sesiones con política definida; protección CSRF cuando aplique, XSS, inyección, abuso de formularios y rate limiting.
- Autorización en servidor para cada operación y recurso.
- Principio de mínimo privilegio; roles y permisos explícitos.
- Aislamiento por organización/tenant solo donde aplique, probado en servidor.
- Secretos en variables de entorno/gestor de secretos, nunca en frontend ni en Git.
- Auditoría para acciones sensibles, cambios de permisos, publicación y operaciones financieras.
- No almacenar credenciales de clientes sin una necesidad clara y controles adecuados.
- Retención y eliminación de datos documentadas.
- Copias de seguridad y restauración probadas antes de producción.
- No afirmar cumplimiento legal/certificaciones sin revisión profesional.
- Los detalles de licencia de repositorios y dependencias deben verificarse antes de redistribuir o vender productos derivados.

## 8. Flujo de trabajo para agentes de IA

Al iniciar una fase:

1. Leer este contrato y solo los documentos indicados para la fase.
2. Revisar el estado actual del repositorio de trabajo.
3. Resumir brevemente el alcance y los riesgos antes de actuar.
4. Ejecutar únicamente el alcance de la fase.
5. No reescribir documentación aprobada por estilo ni eliminar requisitos.
6. Si encuentra contradicciones, listarlas y proponer resolución; no escoger silenciosamente.
7. Implementar pruebas proporcionales al cambio.
8. Ejecutar build/lint/tests disponibles y reportar resultados reales.
9. Actualizar documentación relacionada sin modificar documentos no relacionados.
10. Entregar informe con archivos cambiados, decisiones, pruebas, limitaciones y siguiente paso.

### Restricciones de tokens/contexto

- No leer todos los documentos de todas las fases en cada conversación.
- Leer el contrato maestro, `PHASES.md`, el documento de la fase actual y el informe anterior.
- No implementar fases futuras “para adelantar”.
- No crear una plataforma genérica ni reemplazar requisitos por una solución simplificada sin aprobación.
- No borrar archivos ni ejecutar migraciones destructivas sin autorización explícita.

## 9. Criterios globales de aceptación

- `npm run build`/comando equivalente termina correctamente cuando exista proyecto.
- Lint, tipos y pruebas disponibles pasan; cualquier excepción se documenta.
- Layout validado en móvil, tablet y escritorio.
- Teclado, foco visible, formularios y movimiento reducido revisados.
- No hay enlaces/CTA muertos ni datos ficticios presentados como reales.
- Estados de carga, vacío, error y éxito considerados.
- No hay secretos en el repositorio ni permisos críticos confiados al cliente.
- La documentación coincide con lo implementado.
- No se declara completada una fase sin evidencias.

## 10. Decisiones pendientes que no deben inventarse

- Stack definitiva, proveedor de hosting, dominio de administración y entorno de despliegue.
- Logo oficial, archivos de marca, tipografías licenciadas y fotografías autorizadas.
- Nombres, biografías, roles y fotografías reales del equipo.
- Lista definitiva de servicios, productos, estados, planes y precios.
- Relaciones/atribución permitida de cada proyecto del portafolio.
- Proveedor de analítica, monitorización, facturación, correo y automatizaciones.
- Requisitos fiscales, privacidad y condiciones comerciales.
- Disponibilidad de APIs y credenciales de los sistemas existentes.

Registrar las decisiones aprobadas en `DECISIONS.md` con fecha, contexto, opciones y consecuencias.
