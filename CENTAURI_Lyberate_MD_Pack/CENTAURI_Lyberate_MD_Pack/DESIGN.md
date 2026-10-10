# Sistema visual y experiencia — Lyberate

## Dirección

Una estética de estudio tecnológico/editorial: precisa, cálida, reconocible y con capas de detalle. El diseño debe verse intencional, no como una plantilla generada.

## Sistema de diseño a entregar

- Paleta semántica: fondo, superficie, texto principal/secundario, acento, bordes, éxito, advertencia, error e información.
- Escala tipográfica documentada y fluida sin saltos extremos.
- Escala de espaciado consistente.
- Radios y elevaciones limitados y coherentes.
- Iconografía consistente; preferir librería mantenida frente a emojis.
- Tokens para foco, hover, active, disabled y estados de validación.
- Breakpoints y reglas de composición.
- Motion tokens y soporte para `prefers-reduced-motion`.
- Componentes: Button, Link, Input, Textarea, Select, Checkbox, Badge, Alert, Dialog, Tooltip, Tabs, Breadcrumbs, Pagination, Skeleton, EmptyState, ErrorState, ProjectCard, SectionHeader, SiteHeader y Footer.

## Landing: criterio de calidad

El hero debe combinar una frase clara, una explicación breve, CTA y una composición visual propia. No colocar un carrusel gigante como hero por defecto: el carrusel de proyectos aparece en una sección destacada dentro de Inicio, tras presentar la propuesta de valor.

Usar asimetría controlada, composición editorial, imágenes reales de los proyectos, fondos con textura sutil si aporta valor y detalles de interacción moderados. El diseño debe funcionar incluso cuando las imágenes falten.

## Carrusel de proyectos

- Controles visibles anterior/siguiente y foco accesible.
- Swipe en táctil, pero sin depender solo de gestos.
- Sin autoplay obligatorio; respetar movimiento reducido.
- Tarjetas con título, categoría, resumen corto, relación con Lyberate y CTA.
- No hacer que todas las tarjetas tengan exactamente el mismo peso visual si hay contenido suficiente.
- En móvil mostrar una tarjeta principal y un indicio de continuidad sin recortar texto importante.
- Enlace “Ver todos los trabajos”.

## Sobre nosotros

Avatares/fotos circulares con aro de color, jerarquía de nombre/rol/biografía y bloques inferiores de valores, capacidades y proceso. El aro puede variar por rol o ser un único acento de marca, pero debe responder a una regla visual documentada. No inventar fotos ni biografías.

## Panel administrativo

Diseño “Control Room”: navegación lateral plegable, barra superior útil, tablas legibles, filtros, búsqueda, detalle contextual, actividad reciente y vistas guardadas cuando tengan sentido. Evitar un muro de tarjetas KPI. Las métricas siempre muestran fuente y última actualización.

## Accesibilidad

- Contraste suficiente y comprobable.
- Navegación completa por teclado.
- Foco visible.
- Labels y mensajes de error asociados.
- No comunicar estados solo mediante color.
- Objetivos táctiles cómodos.
- Texto ampliable y zoom sin pérdida de contenido.
- Movimiento reducido y animaciones no esenciales desactivables.
